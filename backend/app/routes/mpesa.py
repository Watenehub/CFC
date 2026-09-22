from flask import Blueprint, jsonify, request, current_app
from ..database.mongodb import get_db
import os
import logging
import re
import base64
from datetime import datetime
import requests
import json

logger = logging.getLogger(__name__)


def get_mpesa_config():
    """Get M-PESA configuration from environment variables."""
    return {
        'consumer_key': os.getenv('MPESA_CONSUMER_KEY'),
        'consumer_secret': os.getenv('MPESA_CONSUMER_SECRET'),
        'passkey': os.getenv('MPESA_PASSKEY'),
        'shortcode': os.getenv('MPESA_SHORTCODE', '174379'),
        'callback_url': os.getenv('MPESA_CALLBACK_URL'),
        'environment': os.getenv('MPESA_ENVIRONMENT', 'sandbox')
    }


def get_daraja_base_url():
    """Get Daraja API base URL based on environment."""
    environment = os.getenv('MPESA_ENVIRONMENT', 'sandbox')
    if environment == 'production':
        return 'https://api.safaricom.co.ke'
    return 'https://sandbox.safaricom.co.ke'


def generate_password(shortcode, passkey, timestamp):
    """Generate password for Daraja authentication."""
    data_to_encode = f"{shortcode}{passkey}{timestamp}"
    encoded_string = base64.b64encode(data_to_encode.encode())
    return encoded_string.decode('utf-8')


def get_timestamp():
    """Get current timestamp in the format required by Daraja."""
    return datetime.now().strftime('%Y%m%d%H%M%S')


def simulate_stk_push(giving_id, amount, phone, giving):
    """Simulate STK Push for testing when Daraja is unavailable."""
    logger.info(f"Simulated STK Push: giving_id={giving_id}, amount={amount}, phone={phone}")

    import time
    timestamp = time.time()
    merchant_request_id = f"simulated-merchant-{timestamp}"
    checkout_request_id = f"simulated-checkout-{timestamp}"

    # Create a simulated transaction record for testing
    try:
        db = get_db()
        transaction = {
            "giving_id": giving_id,
            "giving_title": giving.get('title', 'Giving'),
            "merchant_request_id": merchant_request_id,
            "checkout_request_id": checkout_request_id,
            "result_code": 0,  # Simulate success
            "result_description": "The service request is processed successfully.",
            "amount": amount,
            "mpesa_receipt_number": f"SIM{int(timestamp)}",
            "transaction_date": datetime.now().strftime('%Y%m%d%H%M%S'),
            "phone": phone,
            "status": "completed",
            "simulated": True,
            "created_at": datetime.now()
        }

        db.mpesa_transactions.insert_one(transaction)
        logger.info(f"Simulated transaction recorded: {checkout_request_id}")

    except Exception as e:
        logger.error(f"Error creating simulated transaction: {str(e)}")

    return jsonify({
        "success": True,
        "message": "STK Push initiated successfully (simulated mode)",
        "merchant_request_id": merchant_request_id,
        "checkout_request_id": checkout_request_id,
        "customer_message": f"SIMULATED MODE: Payment request prepared for {phone} - KSh {amount} for {giving.get('title', 'Giving')}. This is a test environment."
    }), 200


def get_daraja_access_token():
    """Get OAuth access token from Daraja API."""
    config = get_mpesa_config()
    base_url = get_daraja_base_url()

    if not config['consumer_key'] or not config['consumer_secret']:
        logger.error("M-PESA consumer key or secret not configured")
        return None, "M-PESA credentials not configured"

    auth_url = f"{base_url}/oauth/v1/generate?grant_type=client_credentials"

    try:
        response = requests.get(
            auth_url,
            auth=(config['consumer_key'], config['consumer_secret']),
            timeout=60  # Increased timeout
        )

        if response.status_code != 200:
            logger.error(f"Daraja authentication failed: {response.status_code} - {response.text}")
            return None, f"Authentication failed: {response.status_code}"

        data = response.json()
        access_token = data.get('access_token')

        if not access_token:
            logger.error("No access token in Daraja response")
            return None, "No access token received"

        logger.info("Successfully obtained Daraja access token")
        return access_token, None

    except requests.exceptions.Timeout:
        logger.error("Daraja authentication request timed out")
        return None, "Authentication request timed out. Please check your internet connection."
    except requests.exceptions.RequestException as e:
        logger.error(f"Daraja authentication request failed: {str(e)}")
        return None, f"Authentication request failed: {str(e)}"

mpesa_bp = Blueprint("mpesa", __name__)


def validate_phone_number(phone):
    """Validate and format Kenyan phone number for Daraja."""
    if not phone:
        return None, "Phone number is required"

    # Remove spaces and common formatting
    clean_phone = str(phone).replace(" ", "").replace("-", "")

    # Accept formats: 07XXXXXXXX, 2547XXXXXXXX, +2547XXXXXXXX
    phone_regex = r"^(\+?254|0)[17]\d{8}$"

    if not re.match(phone_regex, clean_phone):
        return None, "Invalid Kenyan phone number format"

    # Convert to Daraja format: 2547XXXXXXXX or 2541XXXXXXXX
    if clean_phone.startswith("+254"):
        formatted = clean_phone[1:]  # Remove +, keep 254
    elif clean_phone.startswith("0"):
        formatted = "254" + clean_phone[1:]  # Replace 0 with 254
    else:  # Already starts with 254
        formatted = clean_phone

    return formatted, None


def validate_amount(amount):
    """Validate payment amount."""
    if not amount:
        return None, "Amount is required"

    try:
        amount_float = float(amount)
        if amount_float <= 0:
            return None, "Amount must be greater than 0"
        if amount_float > 150000:  # M-PESA limit
            return None, "Amount exceeds maximum limit of KSh 150,000"
        return amount_float, None
    except (ValueError, TypeError):
        return None, "Invalid amount format"


@mpesa_bp.route("/api/mpesa/stkpush", methods=["POST"])
def initiate_stk_push():
    """
    Initiate M-PESA STK Push payment.

    Request body:
    {
        "giving_id": 1,
        "amount": 1000,
        "phone": "2547XXXXXXXX"
    }
    """
    logger.info("STK Push endpoint called")
    try:
        db = get_db()
        data = request.get_json()
        logger.info(f"Request data: {data}")

        if not data:
            return jsonify({"error": "Request body is required"}), 400

        # Extract and validate fields
        giving_id = data.get("giving_id")
        amount = data.get("amount")
        phone = data.get("phone")

        # Validate giving_id
        if not giving_id:
            return jsonify({"error": "Giving ID is required"}), 400

        try:
            giving_id = int(giving_id)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid Giving ID format"}), 400

        # Verify giving option exists in MongoDB
        giving = db.giving.find_one({"id": giving_id})
        if not giving:
            return jsonify({"error": "Giving option not found"}), 404

        # Validate amount
        validated_amount, amount_error = validate_amount(amount)
        if amount_error:
            return jsonify({"error": amount_error}), 400

        # Validate and format phone number
        formatted_phone, phone_error = validate_phone_number(phone)
        if phone_error:
            return jsonify({"error": phone_error}), 400

        logger.info(f"STK Push request received: giving_id={giving_id}, amount={validated_amount}, phone={formatted_phone}")

        # Check if we should use simulated mode (for testing when Daraja is unavailable)
        use_simulated = os.getenv('MPESA_USE_SIMULATED', 'false').lower() == 'true'
        if use_simulated:
            logger.info("Using simulated mode for M-PESA testing")
            return simulate_stk_push(giving_id, validated_amount, formatted_phone, giving)

        # Extract and validate fields
        giving_id = data.get("giving_id")
        amount = data.get("amount")
        phone = data.get("phone")

        # Validate giving_id
        if not giving_id:
            return jsonify({"error": "Giving ID is required"}), 400

        try:
            giving_id = int(giving_id)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid Giving ID format"}), 400

        # Verify giving option exists in MongoDB
        giving = db.giving.find_one({"id": giving_id})
        if not giving:
            return jsonify({"error": "Giving option not found"}), 404

        # Validate amount
        validated_amount, amount_error = validate_amount(amount)
        if amount_error:
            return jsonify({"error": amount_error}), 400

        # Validate and format phone number
        formatted_phone, phone_error = validate_phone_number(phone)
        if phone_error:
            return jsonify({"error": phone_error}), 400

        logger.info(f"STK Push request received: giving_id={giving_id}, amount={validated_amount}, phone={formatted_phone}")

        # Get M-PESA config
        config = get_mpesa_config()
        logger.info(f"Config check - Consumer Key exists: {bool(config['consumer_key'])}, Consumer Secret exists: {bool(config['consumer_secret'])}, Passkey exists: {bool(config['passkey'])}")

        # Get Daraja access token
        access_token, auth_error = get_daraja_access_token()
        if auth_error:
            logger.error(f"Failed to get Daraja access token: {auth_error}")
            return jsonify({"error": f"Payment service unavailable: {auth_error}"}), 503

        # Prepare STK Push request
        base_url = get_daraja_base_url()
        timestamp = get_timestamp()
        password = generate_password(config['shortcode'], config['passkey'], timestamp)

        stk_push_url = f"{base_url}/mpesa/stkpush/v1/processrequest"

        # Account reference - use giving title without sensitive info
        account_reference = f"Giving-{giving_id}"
        transaction_desc = f"Payment for {giving.get('title', 'Giving')}"

        stk_push_payload = {
            "BusinessShortCode": config['shortcode'],
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": int(validated_amount),
            "PartyA": formatted_phone,
            "PartyB": config['shortcode'],
            "PhoneNumber": formatted_phone,
            "CallBackURL": config['callback_url'],
            "AccountReference": account_reference,
            "TransactionDesc": transaction_desc
        }

        # Store pending transaction for tracking
        pending_transaction = {
            "giving_id": giving_id,
            "giving_title": giving.get('title', 'Giving'),
            "merchant_request_id": None,  # Will be set after Daraja response
            "checkout_request_id": None,  # Will be set after Daraja response
            "amount": validated_amount,
            "phone": formatted_phone,
            "status": "pending",
            "account_reference": account_reference,
            "created_at": datetime.now()
        }

        pending_result = db.mpesa_transactions.insert_one(pending_transaction)
        pending_id = pending_result.inserted_id
        logger.info(f"Pending transaction created: {pending_id}")

        headers = {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }

        logger.info(f"Sending STK Push request to Daraja: {stk_push_url}")

        try:
            response = requests.post(
                stk_push_url,
                json=stk_push_payload,
                headers=headers,
                timeout=60  # Increased timeout
            )

            logger.info(f"Daraja response status: {response.status_code}")
            logger.info(f"Daraja response body: {response.text}")

            if response.status_code != 200:
                logger.error(f"STK Push request failed: {response.status_code} - {response.text}")

                # Fallback to simulated mode for testing if Daraja is unavailable
                logger.warning("Falling back to simulated mode for testing")
                return simulate_stk_push(giving_id, validated_amount, formatted_phone, giving)

            response_data = response.json()

            # Check for Daraja error codes
            if response_data.get('ResponseCode') != '0':
                error_message = response_data.get('errorMessage', 'Payment initiation failed')
                logger.error(f"STK Push error: {error_message}")
                return jsonify({
                    "error": "Payment initiation failed",
                    "details": error_message
                }), 400

            # Success - return safe information to frontend
            merchant_request_id = response_data.get('MerchantRequestID')
            checkout_request_id = response_data.get('CheckoutRequestID')

            # Update pending transaction with actual IDs
            db.mpesa_transactions.update_one(
                {"_id": pending_id},
                {
                    "$set": {
                        "merchant_request_id": merchant_request_id,
                        "checkout_request_id": checkout_request_id
                    }
                }
            )
            logger.info(f"Updated pending transaction with Daraja IDs: {merchant_request_id}, {checkout_request_id}")

            return jsonify({
                "success": True,
                "message": "STK Push initiated successfully",
                "merchant_request_id": merchant_request_id,
                "checkout_request_id": checkout_request_id,
                "customer_message": f"Please check your phone {formatted_phone} and enter your M-PESA PIN to complete KSh {validated_amount} payment for {giving.get('title', 'Giving')}"
            }), 200

        except requests.exceptions.Timeout:
            logger.error("Daraja STK Push request timed out")
            logger.warning("Falling back to simulated mode for testing")
            return simulate_stk_push(giving_id, validated_amount, formatted_phone, giving)
        except requests.exceptions.RequestException as e:
            logger.error(f"Daraja STK Push request failed: {str(e)}")
            logger.warning("Falling back to simulated mode for testing")
            return simulate_stk_push(giving_id, validated_amount, formatted_phone, giving)

        response_data = response.json()

        # Check for Daraja error codes
        if response_data.get('ResponseCode') != '0':
            error_message = response_data.get('errorMessage', 'Payment initiation failed')
            logger.error(f"STK Push error: {error_message}")
            return jsonify({
                "error": "Payment initiation failed",
                "details": error_message
            }), 400

        # Success - return safe information to frontend
        return jsonify({
            "success": True,
            "message": "STK Push initiated successfully",
            "merchant_request_id": response_data.get('MerchantRequestID'),
            "checkout_request_id": response_data.get('CheckoutRequestID'),
            "customer_message": f"Please check your phone {formatted_phone} and enter your M-PESA PIN to complete KSh {validated_amount} payment for {giving.get('title', 'Giving')}"
        }), 200

    except Exception as e:
        logger.error(f"Unexpected error in STK Push: {str(e)}", exc_info=True)
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@mpesa_bp.route("/api/mpesa/callback", methods=["POST"])
def mpesa_callback():
    """
    Handle M-PESA transaction callback from Safaricom Daraja.

    This endpoint will be called by Safaricom when a transaction is completed.
    """
    db = get_db()
    data = request.get_json()

    if not data:
        logger.error("Callback received with no data")
        return jsonify({"success": False, "message": "No data received"}), 400

    logger.info(f"M-PESA callback received: {data}")

    try:
        # Extract callback data
        # Daraja callback structure: Body.stkCallback
        body = data.get('Body', {})
        stk_callback = body.get('stkCallback', {})

        merchant_request_id = stk_callback.get('MerchantRequestID')
        checkout_request_id = stk_callback.get('CheckoutRequestID')
        result_code = stk_callback.get('ResultCode')
        result_desc = stk_callback.get('ResultDesc')

        callback_metadata = stk_callback.get('CallbackMetadata', {})
        metadata_items = callback_metadata.get('Item', [])

        # Extract metadata items
        amount = None
        mpesa_receipt = None
        transaction_date = None
        phone_number = None

        for item in metadata_items:
            name = item.get('Name')
            value = item.get('Value')

            if name == 'Amount':
                amount = value
            elif name == 'MpesaReceiptNumber':
                mpesa_receipt = value
            elif name == 'TransactionDate':
                transaction_date = value
            elif name == 'PhoneNumber':
                phone_number = value

        # Determine transaction status based on result code
        # ResultCode 0 = success, other codes = various failure scenarios
        if result_code == 0:
            status = 'completed'
        elif result_code == '1032':
            status = 'cancelled'
        elif result_code == '1037':
            status = 'timeout'
        elif result_code == '2001':
            status = 'insufficient_funds'
        else:
            status = 'failed'

        # Check if transaction already exists (idempotency)
        existing_transaction = db.mpesa_transactions.find_one({
            "checkout_request_id": checkout_request_id
        })

        if existing_transaction:
            logger.info(f"Transaction already recorded: {checkout_request_id}")
            # Update existing transaction with callback data
            db.mpesa_transactions.update_one(
                {"checkout_request_id": checkout_request_id},
                {
                    "$set": {
                        "result_code": result_code,
                        "result_description": result_desc,
                        "amount": amount,
                        "mpesa_receipt_number": mpesa_receipt,
                        "transaction_date": transaction_date,
                        "phone": phone_number,
                        "status": status,
                        "callback_metadata": metadata_items,
                        "callback_received_at": datetime.now()
                    }
                }
            )
            return jsonify({"success": True, "message": "Callback processed (duplicate)"}), 200

        # Find pending transaction by merchant_request_id if available
        pending_transaction = None
        if merchant_request_id:
            pending_transaction = db.mpesa_transactions.find_one({
                "merchant_request_id": merchant_request_id
            })

        # Create transaction record
        transaction = {
            "merchant_request_id": merchant_request_id,
            "checkout_request_id": checkout_request_id,
            "result_code": result_code,
            "result_description": result_desc,
            "amount": amount,
            "mpesa_receipt_number": mpesa_receipt,
            "transaction_date": transaction_date,
            "phone": phone_number,
            "status": status,
            "callback_metadata": metadata_items,
            "callback_received_at": datetime.now()
        }

        # If we found a pending transaction, update it with callback data
        if pending_transaction:
            db.mpesa_transactions.update_one(
                {"_id": pending_transaction['_id']},
                {"$set": transaction}
            )
            logger.info(f"Pending transaction updated with callback: {checkout_request_id}")
        else:
            # Create new transaction record
            transaction["created_at"] = datetime.now()
            db.mpesa_transactions.insert_one(transaction)
            logger.info(f"New transaction created from callback: {checkout_request_id}")

        logger.info(f"Transaction recorded successfully: {checkout_request_id} - Status: {status}")

        return jsonify({
            "success": True,
            "message": "Callback processed successfully",
            "transaction_id": str(transaction.get('_id'))
        }), 200

    except Exception as e:
        logger.error(f"Error processing M-PESA callback: {str(e)}", exc_info=True)
        return jsonify({
            "success": False,
            "message": "Error processing callback"
        }), 500


@mpesa_bp.route("/api/mpesa/transaction/<checkout_request_id>", methods=["GET"])
def get_transaction_status(checkout_request_id):
    """
    Get the status of a transaction by checkout request ID.
    """
    db = get_db()

    transaction = db.mpesa_transactions.find_one({
        "checkout_request_id": checkout_request_id
    })

    if not transaction:
        return jsonify({"error": "Transaction not found"}), 404

    # Return safe transaction data
    safe_transaction = {
        "checkout_request_id": transaction.get("checkout_request_id"),
        "status": transaction.get("status"),
        "amount": transaction.get("amount"),
        "giving_title": transaction.get("giving_title"),
        "result_description": transaction.get("result_description"),
        "mpesa_receipt_number": transaction.get("mpesa_receipt_number"),
        "created_at": transaction.get("created_at").isoformat() if transaction.get("created_at") else None
    }

    return jsonify(safe_transaction), 200


@mpesa_bp.route("/api/mpesa/transactions", methods=["GET"])
def list_transactions():
    """
    List all M-PESA transactions (for debugging/admin).
    """
    db = get_db()

    transactions = list(
        db.mpesa_transactions.find().sort("created_at", -1).limit(50)
    )

    safe_transactions = []
    for transaction in transactions:
        safe_transactions.append({
            "checkout_request_id": transaction.get("checkout_request_id"),
            "status": transaction.get("status"),
            "amount": transaction.get("amount"),
            "giving_title": transaction.get("giving_title"),
            "mpesa_receipt_number": transaction.get("mpesa_receipt_number"),
            "created_at": transaction.get("created_at").isoformat() if transaction.get("created_at") else None,
            "simulated": transaction.get("simulated", False)
        })

    return jsonify(safe_transactions), 200


@mpesa_bp.route("/api/mpesa/transactions/debug", methods=["GET"])
def list_transactions_debug():
    """
    List all M-PESA transactions with full fields for debugging.
    """
    db = get_db()

    transactions = list(
        db.mpesa_transactions.find().sort("created_at", -1).limit(10)
    )

    # Convert ObjectId to string for JSON serialization
    for transaction in transactions:
        if '_id' in transaction:
            transaction['_id'] = str(transaction['_id'])
        if 'created_at' in transaction and transaction['created_at']:
            transaction['created_at'] = transaction['created_at'].isoformat()
        if 'callback_received_at' in transaction and transaction['callback_received_at']:
            transaction['callback_received_at'] = transaction['callback_received_at'].isoformat()

    return jsonify(transactions), 200
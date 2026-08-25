from flask import Flask

def create_app():
    app = Flask(__name__)

    @app.route("/")
    def home():
        return "Cornerstone Family Chapel API is running!"

    return app
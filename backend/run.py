from app import create_app
import os

app = create_app()

if __name__ == "__main__":
    debug = os.getenv("FLASK_ENV", "development") == "development"
    app.run(debug=debug)

from flask import Flask
from views import views
from flask_redis import FlaskRedis

app = Flask(__name__)
app.secret_key = "secretKey"  # Set a secret key for session management


app.register_blueprint(views, url_prefix="/")

if __name__ == "__main__":
    app.run(debug=True, port=8000)

from flask import Flask
from views import views
from flask_redis import FlaskRedis

application = Flask(__name__)
application.secret_key = "secretKey"  # Set a secret key for session management


application.register_blueprint(views, url_prefix="/")

if __name__ == "__main__":
    application.run(host='0.0.0.0')

from flask import Flask
from views import views
from filters import format_datetime

application = Flask(__name__)
application.secret_key = "secretKey"  # Set a secret key for session management
application.jinja_env.filters['datetime'] = format_datetime


application.register_blueprint(views, url_prefix="/")

if __name__ == "__main__":
    application.run(debug=True, host="0.0.0.0")

# if __name__ == "__main__":
#    application.run(host='0.0.0.0')

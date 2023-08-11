from flask import Flask
from views import views
from filters import format_datetime
from actualDsBot import run_bot
import threading

application = Flask(__name__)
application.secret_key = "secretKey"  # Set a secret key for session management
application.jinja_env.filters['datetime'] = format_datetime


application.register_blueprint(views, url_prefix="/")

if __name__ == "__main__":
    bot_thread = threading.Thread(target=run_bot)
    bot_thread.start()

    application.run(debug=True)

# if __name__ == "__main__":
#    application.run(debug=True, host="0.0.0.0")

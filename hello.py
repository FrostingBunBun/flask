from flask import Flask
import multiprocessing
from socketio_instance import socketio  # Import the SocketIO instance

# Import your views blueprint and any other necessary modules
from views import views, handle_match_status  # Import the handle_match_status function
from filters import format_datetime
from actualDsBot import run_bot

# Create the Flask app
application = Flask(__name__)
application.secret_key = "secretKey"
application.jinja_env.filters['datetime'] = format_datetime

# Initialize Flask-SocketIO with your Flask app
socketio.init_app(application)  # Initialize SocketIO with the Flask app

# Register your 'views' blueprint
application.register_blueprint(views, url_prefix="/")

# Define WebSocket event handlers
@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('request_match_status')
def request_match_status():
    handle_match_status()  # Trigger the match status update
    

def run_bot_process():
    run_bot()

if __name__ == "__main__":
    # Create a WebSocket process alongside your Flask app
    bot_process = multiprocessing.Process(target=run_bot_process)
    bot_process.start()

    # Use socketio.run() instead of application.run() to run your Flask app with WebSocket support
    socketio.run(application, debug=True)





# if __name__ == "__main__":
#    application.run(debug=True, host="0.0.0.0")

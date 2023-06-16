from flask import Flask, render_template
from flask_socketio import SocketIO, emit

from views import views
from filters import format_datetime

application = Flask(__name__)
application.secret_key = "secretKey"  # Set a secret key for session management
application.jinja_env.filters['datetime'] = format_datetime

# Initialize SocketIO
socketio = SocketIO(application)

# Register the views blueprint
application.register_blueprint(views, url_prefix="/")

# Store the chat messages
messages = []

# Serve the index.html page
@application.route('/')
def index():
    return render_template('index.html')

# Handle socket.io events
@socketio.on('message')
def handle_message(message):
    print('Received message: ' + message)
    messages.append(message)  # Add the message to the list
    emit('message', message, broadcast=True)

@socketio.on('connect')
def on_connect():
    # Send existing messages to the new client
    for message in messages:
        emit('message', message)

if __name__ == "__main__":
    socketio.run(application, debug=True, host="0.0.0.0")

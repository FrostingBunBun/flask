document.addEventListener("DOMContentLoaded", () => {
    // Connect to the Socket.IO server
    const socket = io();

    // Send a message to the server when the "Send" button is clicked
    document.getElementById('sendButton').addEventListener('click', () => {
        const message = document.getElementById('messageInput').value;
        socket.emit('message', message);
    });

    // Handle incoming messages from the server
    socket.on('message', (message) => {
        console.log('Received message: ' + message);
        // Display the received message on the page
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        document.body.appendChild(messageElement);
    });
});

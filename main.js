const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const readline = require('readline');

// Create a new client instance
const client = new Client({  
    authStrategy: new LocalAuth({
        dataPath: './tokens',
        clientID: 'client',
    })
});

// Variable to store the last sender
let lastSender = null;

// Set up readline interface for keyboard input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Handle keyboard input
process.stdin.on('keypress', (str, key) => {
    if (key && key.name === 'tab') {
        if (lastSender) {
            // Prompt user to type a message
            rl.question(`Type message to send to ${lastSender}: `, (message) => {
                if (message.trim()) {
                    // Send the message to the last sender
                    client.sendMessage(lastSender, message)
                        .then(() => {
                            console.log(`Message sent to ${lastSender}: ${message}`);
                        })
                        .catch(err => {
                            console.error('Error sending message:', err);
                        });
                }
            });
        } else {
            console.log('No recent sender to reply to.');
        }
    }
});

// Enable keypress events
readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Client is ready!');
});

// When the client received QR-Code
client.on('qr', (qr) => {
    console.log('QR RECIBIDO', qr);
    qrcode.generate(qr, {small: true});
});
client.on('message_create', message => {
    console.log('('+message.from+')'+message.body);
    
    // Update the last sender
    lastSender = message.from;

	if (message.body === '!ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
    if (message.body.toLowerCase === 'hola') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'Hola! como estas? Ahora no estoy disponible. Pero ni bien pueda te respondo. Gracias por escribirme.');
	}
});
client.on('message', async (msg) => {
    // Update the last sender
    lastSender = msg.from;
    
    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
        console.log('Document received from', msg.from);
        // No automatic response is sent
    }
});


// Start your client
client.initialize();

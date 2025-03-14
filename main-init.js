const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Create a new client instance
const client = new Client({  
    authStrategy: new LocalAuth({
        dataPath: './tokens',
        clientID: 'client',
    })
});

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
    if (msg.hasMedia) {
        const media = await msg.downloadMedia();
         console.log('Media received', media);
         client.sendMessage(message.from, 'Documento recibido. Verificaremos y nos pondremos en contacto.');

    }
});


// Start your client
client.initialize();
const net = require('net');
const readline = require('readline');

// Configurar readline para entrada interactiva
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para obtener la hora actual en formato HH:MM:SS
function getCurrentTime() {
    return new Date().toTimeString().split(' ')[0];
}

// Función para hacer preguntas de manera asíncrona
async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Función principal asíncrona
async function main() {
    // Obtener datos de conexión
    const serverHost = await askQuestion('Ingresa la dirección IP del servidor: ');
    const serverPort = parseInt(await askQuestion('Ingresa el puerto del servidor: '));
    const username = await askQuestion('Ingresa tu nombre de usuario: ');

    // Crear el cliente
    const client = new net.Socket();

    // Conectar al servidor
    client.connect(serverPort, serverHost, () => {
        console.log('Conectado al servidor');

        // Función para enviar mensajes
        async function sendMessage() {
            while (true) {
                try {
                    const message = await askQuestion('Escribe un mensaje: ');
                    if (message) {
                        const currentTime = getCurrentTime();
                        const fullMessage = `${currentTime} ${username}: ${message}`;
                        client.write(fullMessage);
                    }
                } catch (error) {
                    console.error('Error al enviar mensaje:', error);
                }
            }
        }

        // Iniciar el envío de mensajes
        sendMessage();
    });

    // Manejar recepción de datos
    client.on('data', (data) => {
        console.log(data.toString());
    });

    // Manejar errores
    client.on('error', (error) => {
        console.error('Error en la conexión:', error);
        rl.close();
        process.exit(1);
    });

    // Manejar cierre de conexión
    client.on('close', () => {
        console.log('Conexión cerrada');
        rl.close();
        process.exit(0);
    });
}

// Iniciar la aplicación
main().catch(error => {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
});
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
    console.clear(); // Limpiar la consola después de la configuración

    // Crear el cliente
    const client = new net.Socket();

    // Configurar una nueva interfaz de readline después de la conexión
    const chatRl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false // Desactivar el modo terminal para evitar el eco
    });

    // Conectar al servidor
    client.connect(serverPort, serverHost, () => {
        console.log('=== Chat conectado ===');
        console.log('Presiona Ctrl+C para salir');
        console.log(''); // Línea en blanco para separar los mensajes
        process.stdout.write('> ');

        // Manejar la entrada del usuario
        chatRl.on('line', (line) => {
            if (line.trim()) {
                const currentTime = getCurrentTime();
                const fullMessage = `${currentTime} ${username}: ${line}`;
                client.write(fullMessage);
                // Mostrar el prompt nuevamente sin imprimir la entrada
                process.stdout.write('> ');
            } else {
                process.stdout.write('> ');
            }
        });
    });

    // Manejar recepción de datos
    client.on('data', (data) => {
        // Limpiar la línea actual del prompt
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        
        // Mostrar el mensaje recibido
        console.log(data.toString());
        
        // Volver a mostrar el prompt
        process.stdout.write('> ');
    });

    // Manejar errores
    client.on('error', (error) => {
        console.error('Error en la conexión:', error);
        chatRl.close();
        rl.close();
        process.exit(1);
    });

    // Manejar cierre de conexión
    client.on('close', () => {
        console.log('\nConexión cerrada');
        chatRl.close();
        rl.close();
        process.exit(0);
    });

    // Manejar Ctrl+C
    process.on('SIGINT', () => {
        console.log('\nDesconectando del chat...');
        client.destroy();
        chatRl.close();
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
const net = require('net');
const readline = require('readline');

// Lista para almacenar los clientes
const clients = new Set();

// Función para obtener la dirección IP local
function getLocalIP() {
    const { networkInterfaces } = require('os');
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return '127.0.0.1'; // Fallback to localhost
}

// Función para manejar cada cliente
function handleClient(socket) {
    const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Nueva conexión desde ${clientAddress}`);
    
    // Agregar el cliente a la lista
    clients.add(socket);

    // Manejar datos recibidos del cliente
    socket.on('data', (data) => {
        const message = data.toString();
        console.log(`Cliente ${clientAddress}: ${message}`);

        // Reenviar el mensaje a todos los demás clientes
        for (const client of clients) {
            if (client !== socket && client.writable) {
                client.write(message);
            }
        }
    });

    // Manejar desconexión del cliente
    socket.on('close', () => {
        console.log(`Cliente ${clientAddress} desconectado`);
        clients.delete(socket);
    });

    // Manejar errores
    socket.on('error', (error) => {
        console.error(`Error con cliente ${clientAddress}:`, error);
        clients.delete(socket);
        socket.destroy();
    });
}

// Crear el servidor
const server = net.createServer(handleClient);

// Configurar readline para input del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Solicitar puerto al usuario
rl.question('Ingresa el puerto para el servidor: ', (port) => {
    port = parseInt(port);
    if (isNaN(port)) {
        console.error('El puerto debe ser un número entero válido.');
        process.exit(1);
    }

    const host = getLocalIP();

    // Iniciar el servidor
    server.listen(port, host, () => {
        console.log(`Servidor escuchando en ${host}:${port}`);
    });

    // Manejar errores del servidor
    server.on('error', (error) => {
        console.error('Error en el servidor:', error);
        process.exit(1);
    });

    rl.close();
});

// Manejar cierre del servidor
process.on('SIGINT', () => {
    console.log('\nCerrando servidor...');
    for (const client of clients) {
        client.destroy();
    }
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});
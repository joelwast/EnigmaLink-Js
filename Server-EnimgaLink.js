const net = require('net');
const readline = require('readline');
const os = require('os');

// Función para obtener la dirección IP del servidor
function getServerIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Filtrar direcciones IPv4 y no-internas
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // Devolver localhost si no se encuentra una IP externa
}

// Lista para almacenar los clientes
const clients = new Set();

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

    // Escuchar en todas las interfaces
    server.listen(port, '0.0.0.0', () => {
        const serverIP = getServerIP();
        console.log(`Servidor iniciado, IP: ${serverIP}, Puerto: ${port}`);
        console.log('Usa ngrok para exponer este puerto al exterior');
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
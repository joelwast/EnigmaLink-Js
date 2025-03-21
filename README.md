# EnigmaLink-Js

EnigmaLink-Js es una aplicación desarrollada en JavaScript con Node.js que permite levantar un servidor de mensajería de texto dentro de una red local. Proporciona un cliente que facilita la comunicación entre usuarios mediante una dirección IP y un puerto personalizado.

## Características
- **Servidor de mensajería**: Permite la comunicación en una red local sin necesidad de acceso a Internet.
- **Cliente integrado**: Facilita el envío y recepción de mensajes entre los usuarios conectados.
- **Configuración personalizable**: Define la IP y el puerto según las necesidades de la red.
- **Escrito en JavaScript**: Utiliza Node.js para un rendimiento eficiente y una fácil extensibilidad.

## Requisitos
- Node.js instalado en el sistema.

## Instalación
1. Clona el repositorio:
   ```bash
   https://github.com/joelwast/EnigmaLink-Js.git
   cd EnigmaLink-Js
   ```
2. Instala las dependencias necesarias:
   ```bash
   npm install
   ```

## Uso
### Iniciar el servidor
Ejecuta el siguiente comando para levantar el servidor:
```bash
node server.js
```

### Iniciar el cliente
Ejecuta el cliente para conectarte al servidor:
```bash
node client.js
```

Asegúrate de configurar la dirección IP y el puerto en el archivo de configuración antes de iniciar la aplicación.

## Contribución
Si deseas contribuir, por favor realiza un fork del repositorio y envía un pull request con tus mejoras.

## Licencia
Este proyecto está bajo la licencia MIT.

---
Desarrollado por Joelwast.


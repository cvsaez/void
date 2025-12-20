# VOID Shop

E-commerce con gestión de inventario en tiempo real.

## 🚀 Tecnologías

- **Backend**: Node.js + Express
- **Base de datos**: MongoDB
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Pagos**: PayPal SDK
- **Email**: EmailJS

## 📦 Instalación

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar MongoDB

**Windows:**
- Descarga MongoDB Community Server: https://www.mongodb.com/try/download/community
- O usa MongoDB Atlas (cloud gratuito): https://www.mongodb.com/cloud/atlas

**macOS (con Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

### 3. Configurar variables de entorno

Edita el archivo `.env` con tu configuración:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/void-shop
```

## 🎯 Uso

### Desarrollo local

1. **Iniciar MongoDB** (si usas instalación local):
```bash
# Windows
net start MongoDB

# macOS/Linux
brew services start mongodb-community
```

2. **Iniciar servidor**:
```bash
npm run dev
```

3. **Abrir en navegador**:
```
http://localhost:3000
```

### Producción

```bash
npm start
```

## 📡 API Endpoints

### Inventario

- `GET /api/inventory` - Obtener todo el inventario
- `GET /api/inventory/:productId` - Obtener un producto específico
- `GET /api/inventory/:productId/available` - Verificar disponibilidad
- `POST /api/inventory/:productId/purchase` - Comprar producto (decrementa inventario)

### Admin

- `POST /api/inventory/reset` - Resetear inventario a 1 unidad cada uno
- `PUT /api/inventory/:productId` - Actualizar cantidad de un producto

### Salud

- `GET /api/health` - Estado del servidor

## 🔐 Panel de Administración

Accede a `http://localhost:3000/admin.html` para:
- Ver inventario en tiempo real
- Resetear inventario
- Gestionar productos

## 🌐 Despliegue

### Opción 1: Railway (Recomendado)

1. Crea cuenta en [railway.app](https://railway.app)
2. Instala Railway CLI:
```bash
npm i -g @railway/cli
```
3. Deploy:
```bash
railway login
railway init
railway up
```
4. Agrega MongoDB desde el dashboard de Railway

### Opción 2: Heroku

1. Instala Heroku CLI
2. Crea app:
```bash
heroku create void-shop
```
3. Agrega MongoDB:
```bash
heroku addons:create mongolab
```
4. Deploy:
```bash
git push heroku main
```

### Opción 3: VPS (DigitalOcean, AWS, etc.)

1. Sube el código al servidor
2. Instala Node.js y MongoDB
3. Configura PM2:
```bash
npm install -g pm2
pm2 start server/server.js --name void-shop
pm2 startup
pm2 save
```

## 🛠️ Estructura del Proyecto

```
VOID/
├── server/
│   └── server.js          # Servidor Node.js + Express
├── js/
│   ├── api-client.js      # Cliente API
│   └── cart.js            # Lógica del carrito
├── css/
│   └── styles.css
├── assets/
├── index.html
├── checkout.html
├── admin.html
├── package.json
├── .env
└── README.md
```

## 📝 Notas

- El inventario se inicializa automáticamente con 1 unidad de cada producto
- La sincronización entre usuarios se hace mediante polling cada 3 segundos
- Las transacciones de compra son atómicas (usa MongoDB transactions)
- El sistema previene condiciones de carrera (race conditions)

## 🐛 Troubleshooting

**Error: Cannot connect to MongoDB**
- Verifica que MongoDB esté corriendo
- Revisa la MONGODB_URI en .env

**Error: Port 3000 already in use**
- Cambia el PORT en .env o cierra la aplicación que usa ese puerto

**Inventario no se sincroniza**
- Verifica que el servidor esté corriendo
- Abre la consola del navegador para ver errores
- Revisa que la API_BASE_URL sea correcta en api-client.js

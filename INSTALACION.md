# 🚀 GUÍA DE INSTALACIÓN - VOID Shop con Node.js

## ✅ Paso 1: Instalar Node.js

1. **Descarga Node.js**: https://nodejs.org/
   - Descarga la versión **LTS (Recommended)**
   - Ejecuta el instalador
   - **IMPORTANTE**: En la instalación, marca la opción "Automatically install necessary tools"

2. **Verifica la instalación**:
   - Abre una NUEVA terminal PowerShell
   - Ejecuta:
   ```powershell
   node --version
   npm --version
   ```
   - Deberías ver números de versión (ej: v20.10.0 y 10.2.3)

## ✅ Paso 2: Instalar MongoDB

### Opción A: MongoDB Local (Para desarrollo)

1. **Descarga MongoDB Community Server**:
   https://www.mongodb.com/try/download/community
   
2. **Instala** con las opciones por defecto

3. **Verifica** que MongoDB esté corriendo:
   ```powershell
   mongod --version
   ```

### Opción B: MongoDB Atlas (Cloud - Recomendado para producción)

1. Crea cuenta gratis en: https://www.mongodb.com/cloud/atlas
2. Crea un cluster gratuito (M0)
3. Crea un usuario de base de datos
4. Obtén la connection string
5. Pega la connection string en tu archivo `.env`:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/void-shop?retryWrites=true&w=majority
   ```

## ✅ Paso 3: Instalar Dependencias del Proyecto

Abre PowerShell en la carpeta VOID y ejecuta:

```powershell
npm install
```

Esto instalará:
- express (servidor web)
- mongoose (MongoDB ORM)
- cors (permitir peticiones cross-origin)
- dotenv (variables de entorno)
- body-parser (parsear JSON)
- nodemon (auto-reinicio en desarrollo)

## ✅ Paso 4: Iniciar el Servidor

### Modo Desarrollo (con auto-reload):
```powershell
npm run dev
```

### Modo Producción:
```powershell
npm start
```

## ✅ Paso 5: Abrir la Aplicación

Abre tu navegador en:
```
http://localhost:3000
```

## 🎯 Testing del Sistema

1. **Abre dos ventanas de navegador** (o usa modo incógnito)
2. **En ambas ventanas**, abre: http://localhost:3000
3. **En una ventana**, compra un producto
4. **En la otra ventana**, espera 3 segundos - deberías ver "sold out"

## 🔧 Troubleshooting

### Error: "npm no se reconoce"
- Reinicia PowerShell después de instalar Node.js
- Cierra y abre una nueva terminal

### Error: "Cannot connect to MongoDB"
Si usas MongoDB local:
```powershell
# Iniciar servicio MongoDB
net start MongoDB
```

Si usas MongoDB Atlas:
- Verifica que tu IP esté en la whitelist
- Revisa el connection string en .env

### Error: "Port 3000 already in use"
Cambia el puerto en `.env`:
```env
PORT=3001
```

### Los cambios no se reflejan entre usuarios
- Verifica que el servidor esté corriendo
- Abre la consola del navegador (F12) y busca errores
- Espera 3 segundos (tiempo de polling)

## 📱 Panel de Administración

Accede a: http://localhost:3000/admin.html

Desde aquí puedes:
- Ver el inventario en tiempo real
- Resetear productos a 1 unidad
- Ver estado de la base de datos

## 🌐 Desplegar a Producción

Una vez que todo funcione localmente, puedes desplegarlo:

### Opción 1: Railway (Más fácil)
1. https://railway.app
2. Conecta tu repositorio de GitHub
3. Railway detectará Node.js automáticamente
4. Agrega MongoDB desde el dashboard

### Opción 2: Render
1. https://render.com
2. Crea un Web Service
3. Conecta tu repo
4. Agrega variables de entorno

### Opción 3: Heroku
1. Instala Heroku CLI
2. `heroku create void-shop`
3. `heroku addons:create mongolab`
4. `git push heroku main`

## 📊 Estructura Final

```
VOID/
├── server/
│   └── server.js           ← Servidor Node.js + API REST
├── js/
│   ├── api-client.js       ← Cliente que llama a la API
│   └── cart.js             ← Lógica del carrito
├── node_modules/           ← Dependencias (auto-generado)
├── package.json            ← Configuración npm
├── .env                    ← Variables de entorno
└── README.md
```

## 🎉 ¡Listo!

Tu tienda ahora tiene:
✅ Backend con Node.js + Express
✅ Base de datos MongoDB
✅ Inventario sincronizado entre todos los usuarios
✅ Transacciones atómicas (sin race conditions)
✅ API RESTful profesional
✅ Listo para producción

## 💡 Próximos Pasos (Opcional)

- [ ] Agregar autenticación admin
- [ ] Implementar WebSockets para tiempo real instantáneo
- [ ] Agregar logging con Winston
- [ ] Tests con Jest
- [ ] CI/CD con GitHub Actions

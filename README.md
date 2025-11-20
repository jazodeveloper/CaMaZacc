# CaMaZac - Plataforma Inmobiliaria

Sitio web completo y funcional para la inmobiliaria **CaMaZac**, especializada en la venta de propiedades.

## 🌟 Características

### Para Usuarios
- **Catálogo de Propiedades**: Navegación completa de propiedades disponibles con filtros de búsqueda
- **Detalles de Propiedades**: Visualización detallada con galería de hasta 5 imágenes por propiedad
- **Sistema de Mensajería**: Envío de consultas al administrador sobre propiedades específicas
- **Autenticación Segura**: Registro e inicio de sesión con contraseñas encriptadas

### Para Administradores
- **Panel de Administración**: Dashboard completo con estadísticas
- **Gestión de Propiedades**: Agregar, editar y eliminar propiedades
- **Carga de Imágenes**: Subida de hasta 5 imágenes por propiedad
- **Bandeja de Mensajes**: Visualización de todas las consultas recibidas

## 🎨 Diseño

- **Tema Principal**: Tonos amarillos (#FFD700, #F2C200) con gris oscuro
- **Tipografía**: Poppins y Montserrat para un aspecto profesional y moderno
- **Layout**: Diseño tipo tarjetas con efectos hover suaves
- **Navbar Fija**: Navegación persistente con logo CaMaZac
- **Footer**: Información de contacto y enlaces a redes sociales
- **Responsive**: Optimizado para todos los dispositivos

## 🛠️ Tecnologías

### Frontend
- **React** con TypeScript
- **Wouter** para enrutamiento
- **TanStack Query** para gestión de estado
- **Tailwind CSS** para estilos
- **Shadcn UI** para componentes

### Backend
- **Node.js** con Express
- **PostgreSQL** (vía Neon) para base de datos
- **Drizzle ORM** para manejo de datos
- **Bcrypt** para encriptación de contraseñas
- **Multer** para carga de archivos
- **Express Session** para autenticación

## 📦 Instalación

### Requisitos Previos
- Node.js 20 o superior
- PostgreSQL (o acceso a Neon Database)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd camazac
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Las siguientes variables ya están configuradas en Replit:
   - `DATABASE_URL`: URL de conexión a PostgreSQL
   - `SESSION_SECRET`: Clave secreta para sesiones (cambiar en producción)
   - `PORT`: Puerto del servidor (por defecto 5000)

4. **Inicializar la base de datos**
   ```bash
   npm run db:push
   ```

5. **Crear usuario administrador**
   ```bash
   npx tsx server/seed.ts
   ```

   Esto creará un usuario administrador con:
   - **Usuario**: `admin`
   - **Contraseña**: `admin123`
   - **Email**: `admin@camazac.com`

6. **Iniciar el servidor**
   ```bash
   npm start
   ```

   O en modo desarrollo:
   ```bash
   npm run dev
   ```

7. **Acceder a la aplicación**
   
   Abre tu navegador en `http://localhost:5000`

## 🚀 Uso

### Como Usuario

1. **Navegar Propiedades**
   - Visita la página principal para ver propiedades destacadas
   - Ve a "Propiedades" para ver el catálogo completo
   - Usa los filtros para buscar por tipo, precio o ubicación

2. **Crear Cuenta**
   - Haz clic en "Iniciar Sesión" y luego en "Regístrate aquí"
   - Completa el formulario de registro
   - Inicia sesión con tus credenciales

3. **Consultar Propiedades**
   - Navega a una propiedad específica
   - Visualiza las imágenes y detalles
   - Envía un mensaje al administrador (requiere iniciar sesión)

### Como Administrador

1. **Acceder al Panel**
   - Inicia sesión con las credenciales de administrador
   - Haz clic en "Panel Admin" en la navegación

2. **Gestionar Propiedades**
   - En la pestaña "Propiedades", haz clic en "Agregar Propiedad"
   - Completa el formulario con:
     - Título
     - Tipo (Casa, Departamento, Terreno, etc.)
     - Precio
     - Dirección
     - Descripción
     - Hasta 5 imágenes
   - Haz clic en "Crear Propiedad"

3. **Editar Propiedades**
   - En la lista de propiedades, haz clic en "Editar"
   - Modifica los campos deseados
   - Agrega o elimina imágenes
   - Guarda los cambios

4. **Ver Mensajes**
   - Ve a la pestaña "Mensajes"
   - Visualiza todas las consultas recibidas
   - Contacta a los usuarios por email

## 📁 Estructura del Proyecto

```
camazac/
├── client/                 # Frontend (React)
│   ├── public/            # Archivos estáticos
│   └── src/
│       ├── components/    # Componentes reutilizables
│       ├── pages/         # Páginas de la aplicación
│       ├── lib/           # Utilidades
│       └── App.tsx        # Componente principal
├── server/                # Backend (Express)
│   ├── db.ts             # Configuración de base de datos
│   ├── storage.ts        # Interfaz de almacenamiento
│   ├── routes.ts         # Rutas de API
│   ├── seed.ts           # Script de seed
│   └── index.ts          # Punto de entrada
├── shared/               # Código compartido
│   └── schema.ts         # Esquemas de base de datos
├── uploads/              # Imágenes subidas
└── package.json          # Dependencias
```

## 🔒 Seguridad

- **Contraseñas Encriptadas**: Uso de bcrypt con salt rounds = 10
- **Sesiones Seguras**: Express Session con cookies HTTP-only
- **Validación de Archivos**: Solo imágenes (JPEG, PNG, WebP) hasta 5MB
- **Autenticación por Rol**: Middleware para rutas de administrador
- **Validación de Datos**: Zod schemas en frontend y backend

## 📝 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Propiedades
- `GET /api/properties` - Listar todas las propiedades
- `GET /api/properties/:id` - Obtener propiedad específica
- `POST /api/properties` - Crear propiedad (admin)
- `PATCH /api/properties/:id` - Actualizar propiedad (admin)
- `DELETE /api/properties/:id` - Eliminar propiedad (admin)

### Mensajes
- `POST /api/messages` - Enviar mensaje (autenticado)
- `GET /api/messages` - Listar mensajes (admin)

## 🧪 Testing

Para probar el sistema completo:

1. **Como Usuario Visitante**
   - Navega las propiedades sin iniciar sesión
   - Visualiza detalles de propiedades

2. **Como Usuario Registrado**
   - Crea una cuenta nueva
   - Envía mensajes sobre propiedades

3. **Como Administrador**
   - Inicia sesión como `admin` / `admin123`
   - Agrega nuevas propiedades con imágenes
   - Edita propiedades existentes
   - Elimina propiedades
   - Revisa mensajes recibidos

## 🎯 Próximas Características

- Filtros avanzados de búsqueda
- Sistema de favoritos
- Galería lightbox para imágenes
- Notificaciones por email
- Dashboard con estadísticas avanzadas
- Integración con mapas

## 📄 Licencia

Copyright © 2025 CaMaZac Inmobiliaria. Todos los derechos reservados.

## 👥 Contacto

- **Email**: info@camazac.com
- **Teléfono**: +1 (555) 123-4567
- **Dirección**: Av. Principal 123, Ciudad

---

Desarrollado con ❤️ usando React, Node.js y PostgreSQL

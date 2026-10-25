# Sistema de Citas Médicas

Aplicación web educativa para gestionar citas médicas mediante una interfaz gráfica (front-end) conectada a una API REST creada con Node.js, Express y MySQL. Permite registrar, consultar, buscar, filtrar, actualizar y eliminar citas.

## Tecnologías utilizadas
- **HTML5:** estructura de la página y formularios.
- **CSS3:** diseño visual adaptable a computadoras y móviles.
- **JavaScript:** interacción con los formularios, búsqueda y solicitudes a la API.
- **Node.js y Express:** servidor web y rutas de la API.
- **MySQL:** almacenamiento de las citas.

## Requisitos
- Node.js y npm
- MySQL o MySQL/MariaDB de XAMPP

## Instalación y ejecución
1. Inicia MySQL desde XAMPP o tu instalación local.
2. Importa `database.sql` desde phpMyAdmin o la consola MySQL.
3. Instala las dependencias en la carpeta del proyecto:
   ```bash
   npm install
   ```
4. Copia `.env.example` como `.env` y ajusta los datos de conexión a tu base de datos. No publiques `.env` en GitHub.
5. Inicia el servidor:
   ```bash
   npm run dev
   ```
6. Abre **http://localhost:3000** en el navegador. La página gráfica se sirve desde la carpeta `public`.
7. Para consultar la descripción de las rutas de la API, abre **http://localhost:3000/api**.

## Funcionalidades de la interfaz
- Registrar citas con paciente, médico, fecha, hora, motivo y estado.
- Ver las citas guardadas en MySQL.
- Buscar por nombre de paciente, médico o motivo.
- Filtrar por estado: pendiente, confirmada o cancelada.
- Editar y eliminar citas.
- Ver contadores de citas totales, pendientes y confirmadas.
- Diseño adaptable a distintos tamaños de pantalla.

## Rutas de la API
| Método | Ruta | Función |
|---|---|---|
| GET | `/api/citas` | Consultar todas las citas |
| GET | `/api/citas/:id` | Consultar una cita por ID |
| POST | `/api/citas` | Registrar una cita |
| PUT | `/api/citas/:id` | Actualizar una cita |
| DELETE | `/api/citas/:id` | Eliminar una cita |

## Estructura de carpetas y archivos
```text
proyecto-citas-medicas-EsPr/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── src/
│   ├── db.js
│   ├── server.js
│   └── routes/
│       └── citas.js
├── .env.example
├── .gitignore
├── database.sql
├── package.json
├── package-lock.json
└── README.md
```

### Función e importancia de cada elemento
- **`public/`:** reúne los archivos del front-end que el servidor entrega al navegador.
- **`public/index.html`:** define la estructura de la interfaz, los formularios, los indicadores y la lista de citas.
- **`public/styles.css`:** establece colores, tipografías, distribución de los elementos y adaptación a pantallas pequeñas. Mantener los estilos separados facilita modificar la apariencia.
- **`public/app.js`:** controla las acciones de la interfaz y se comunica con la API mediante `fetch` para crear, leer, actualizar y eliminar citas.
- **`src/`:** contiene el código del servidor y la lógica de la aplicación.
- **`src/server.js`:** configura Express, publica la carpeta `public`, registra las rutas y pone en marcha el servidor.
- **`src/db.js`:** configura la conexión o el grupo de conexiones con MySQL para que las rutas puedan consultar la base de datos.
- **`src/routes/citas.js`:** define las operaciones de la API para registrar, consultar, actualizar y eliminar citas, con validaciones básicas.
- **`database.sql`:** crea la base de datos y la tabla `citas`; también incluye registros de ejemplo para probar el sistema.
- **`package.json`:** identifica el proyecto, declara sus dependencias y contiene los comandos para iniciar el servidor.
- **`package-lock.json`:** registra las versiones concretas de las dependencias instaladas para favorecer instalaciones consistentes.
- **`.env.example`:** muestra las variables de configuración necesarias para conectarse a la base de datos sin incluir contraseñas reales.
- **`.gitignore`:** indica qué archivos locales no debe registrar Git, como `.env` y `node_modules/`.
- **`README.md`:** explica el propósito del proyecto, su instalación, sus funcionalidades y su organización.

### Importancia de organizar el proyecto
Separar la interfaz, la lógica del servidor y el acceso a la base de datos facilita encontrar los archivos, corregir errores y agregar nuevas funciones. HTML organiza el contenido, CSS controla la presentación, JavaScript añade interactividad y Express conecta la interfaz con MySQL mediante la API.

## Seguridad y alcance
Este es un proyecto académico. Usa datos ficticios durante las pruebas. Para un sistema real harían falta autenticación, control de permisos, validación más completa, protección de datos personales y medidas adicionales de seguridad.

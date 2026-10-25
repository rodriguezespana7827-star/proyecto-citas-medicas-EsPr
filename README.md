# Sistema de Citas Médicas

API REST escolar creada con Node.js, Express y MySQL. Permite registrar, consultar, actualizar y eliminar citas médicas (CRUD).

## Requisitos
- Node.js LTS y npm
- MySQL Server o XAMPP con MySQL/MariaDB
- Un cliente para probar solicitudes HTTP, como Postman

## Instalación
1. Abre MySQL o XAMPP y activa el servicio MySQL.
2. Importa `database.sql` desde phpMyAdmin o la consola de MySQL.
3. En una terminal, entra a la carpeta del proyecto y ejecuta:
   ```bash
   npm install
   ```
4. Copia `.env.example` como `.env` y configura usuario, contraseña y nombre de base de datos.
5. Inicia el servidor:
   ```bash
   npm run dev
   ```
6. Abre `http://localhost:3000`. Si aparece el mensaje JSON, el servidor está funcionando.

## Rutas
| Método | Ruta | Función |
|---|---|---|
| GET | `/api/citas` | Listar todas las citas |
| GET | `/api/citas/1` | Consultar una cita por ID |
| POST | `/api/citas` | Registrar una cita |
| PUT | `/api/citas/1` | Actualizar una cita |
| DELETE | `/api/citas/1` | Eliminar una cita |

### Ejemplo para POST /api/citas
Selecciona `Body > raw > JSON` en Postman:
```json
{
  "paciente": "Pedro Sánchez",
  "medico": "Dra. Elena Ruiz",
  "fecha": "2026-11-05",
  "hora": "10:30:00",
  "motivo": "Consulta general",
  "estado": "pendiente"
}
```

Para PUT se envía el mismo formato a `/api/citas/ID`. Los campos paciente, medico, fecha, hora y motivo son obligatorios. Los estados permitidos son `pendiente`, `confirmada` y `cancelada`.

## Estructura
```text
citas-medicas-node/
├── src/
│   ├── db.js
│   ├── server.js
│   └── routes/
│       └── citas.js
├── .env.example
├── .gitignore
├── database.sql
├── package.json
└── README.md
```

## Subir a GitHub
1. Crea un repositorio vacío llamado `citas-medicas-node` en GitHub.
2. Abre una terminal en esta carpeta y ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Crear API de citas médicas con Express y MySQL"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/citas-medicas-node.git
   git push -u origin main
   ```
3. Sustituye `TU-USUARIO` por tu usuario real de GitHub. No subas el archivo `.env` ni contraseñas.

## Nota
Este proyecto es una base educativa. Para uso real se necesitarían autenticación, autorización, validaciones de fechas, protección de datos personales, registros de auditoría y configuración segura del servidor. No uses datos médicos reales en pruebas escolares.
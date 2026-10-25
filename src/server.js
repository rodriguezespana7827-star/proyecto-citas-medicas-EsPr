require('dotenv').config();
const express = require('express');
const path = require('path');
const citasRouter = require('./routes/citas');

const app = express();
app.use(express.json());

// Publica la interfaz gráfica desde la carpeta public.
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api', (_req, res) => {
  res.json({
    mensaje: 'API de Citas Médicas funcionando',
    rutas: {
      listar: 'GET /api/citas',
      consultarUna: 'GET /api/citas/:id',
      registrar: 'POST /api/citas',
      actualizar: 'PUT /api/citas/:id',
      eliminar: 'DELETE /api/citas/:id'
    }
  });
});

app.use('/api/citas', citasRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Servidor listo en http://localhost:${PORT}`));

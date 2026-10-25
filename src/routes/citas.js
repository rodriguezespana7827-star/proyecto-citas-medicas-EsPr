const express = require('express');
const pool = require('../db');

const router = express.Router();
const estadosPermitidos = ['pendiente', 'confirmada', 'cancelada'];

function validarCita(datos) {
  const campos = ['paciente', 'medico', 'fecha', 'hora', 'motivo'];
  for (const campo of campos) {
    if (typeof datos[campo] !== 'string' || !datos[campo].trim()) {
      return `El campo "${campo}" es obligatorio.`;
    }
  }
  if (datos.estado && !estadosPermitidos.includes(datos.estado)) {
    return 'El estado debe ser pendiente, confirmada o cancelada.';
  }
  return null;
}

// Consultar todas las citas
router.get('/', async (_req, res, next) => {
  try {
    const [filas] = await pool.query('SELECT * FROM citas ORDER BY fecha, hora');
    res.json(filas);
  } catch (error) { next(error); }
});

// Consultar una cita por ID
router.get('/:id', async (req, res, next) => {
  try {
    const [filas] = await pool.execute('SELECT * FROM citas WHERE id = ?', [req.params.id]);
    if (!filas.length) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json(filas[0]);
  } catch (error) { next(error); }
});

// Registrar una cita
router.post('/', async (req, res, next) => {
  const errorValidacion = validarCita(req.body);
  if (errorValidacion) return res.status(400).json({ error: errorValidacion });

  try {
    const { paciente, medico, fecha, hora, motivo } = req.body;
    const estado = req.body.estado || 'pendiente';
    const [resultado] = await pool.execute(
      'INSERT INTO citas (paciente, medico, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?)',
      [paciente.trim(), medico.trim(), fecha, hora, motivo.trim(), estado]
    );
    const [nuevaCita] = await pool.execute('SELECT * FROM citas WHERE id = ?', [resultado.insertId]);
    res.status(201).json(nuevaCita[0]);
  } catch (error) { next(error); }
});

// Actualizar una cita
router.put('/:id', async (req, res, next) => {
  const errorValidacion = validarCita(req.body);
  if (errorValidacion) return res.status(400).json({ error: errorValidacion });

  try {
    const { paciente, medico, fecha, hora, motivo } = req.body;
    const estado = req.body.estado || 'pendiente';
    const [resultado] = await pool.execute(
      'UPDATE citas SET paciente=?, medico=?, fecha=?, hora=?, motivo=?, estado=? WHERE id=?',
      [paciente.trim(), medico.trim(), fecha, hora, motivo.trim(), estado, req.params.id]
    );
    if (!resultado.affectedRows) return res.status(404).json({ error: 'Cita no encontrada' });
    const [filas] = await pool.execute('SELECT * FROM citas WHERE id = ?', [req.params.id]);
    res.json(filas[0]);
  } catch (error) { next(error); }
});

// Eliminar una cita
router.delete('/:id', async (req, res, next) => {
  try {
    const [resultado] = await pool.execute('DELETE FROM citas WHERE id = ?', [req.params.id]);
    if (!resultado.affectedRows) return res.status(404).json({ error: 'Cita no encontrada' });
    res.json({ mensaje: 'Cita eliminada correctamente' });
  } catch (error) { next(error); }
});

module.exports = router;
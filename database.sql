CREATE DATABASE IF NOT EXISTS citas_medicas
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE citas_medicas;

CREATE TABLE IF NOT EXISTS citas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  paciente VARCHAR(100) NOT NULL,
  medico VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  hora TIME NOT NULL,
  motivo VARCHAR(255) NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL DEFAULT 'pendiente',
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO citas (paciente, medico, fecha, hora, motivo, estado)
VALUES
('María López', 'Dr. Carlos Pérez', '2026-11-02', '09:30:00', 'Consulta general', 'confirmada'),
('Juan García', 'Dra. Ana Torres', '2026-11-03', '11:00:00', 'Control médico', 'pendiente');
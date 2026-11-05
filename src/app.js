const path = require('path');
const express = require('express');
const cors = require('cors');

const productosRoutes = require('./routes/productosRoutes');
const serviciosRoutes = require('./routes/serviciosRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/api/salud', (req, res) => {
  res.status(200).json({ estado: 'activo', proyecto: 'HuancaRepair' });
});

app.use('/api/productos', productosRoutes);
app.use('/api/servicios', serviciosRoutes);

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la peticion no es un JSON valido' });
  }
  console.error(err.message);
  res.status(500).json({ error: 'Error interno del servidor' });
});

module.exports = app;
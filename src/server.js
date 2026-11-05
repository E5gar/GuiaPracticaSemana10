require('dotenv').config();
const app = require('./app');
const pool = require('./config/db');

const PUERTO = process.env.PUERTO || 3000;

const iniciar = async () => {
  try {
    const conexion = await pool.getConnection();
    await conexion.ping();
    conexion.release();
    console.log('Conexion realizada con base de datos');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error.message);
  }

  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
};

iniciar();
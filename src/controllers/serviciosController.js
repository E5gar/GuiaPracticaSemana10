const pool = require('../config/db');

const CAMPOS = 'id, nombre, descripcion, tipo_equipo, precio_desde, tiempo_estimado, imagen_url, activo, creado_en, actualizado_en';

const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

const normalizar = (datos) => ({
  nombre: typeof datos.nombre === 'string' ? datos.nombre.trim() : datos.nombre,
  descripcion: datos.descripcion ?? null,
  tipo_equipo: typeof datos.tipo_equipo === 'string' ? datos.tipo_equipo.trim() : datos.tipo_equipo,
  precio_desde: datos.precio_desde,
  tiempo_estimado: datos.tiempo_estimado ?? null,
  imagen_url: datos.imagen_url ?? null,
  activo: datos.activo === undefined ? 1 : Number(Boolean(datos.activo))
});

const validar = (datos) => {
  const errores = [];
  if (typeof datos.nombre !== 'string' || datos.nombre.length < 2 || datos.nombre.length > 120) {
    errores.push('nombre debe tener entre 2 y 120 caracteres');
  }
  if (typeof datos.tipo_equipo !== 'string' || datos.tipo_equipo.length === 0) {
    errores.push('tipo_equipo es obligatorio');
  }
  const precio = Number(datos.precio_desde);
  if (datos.precio_desde === undefined || datos.precio_desde === null || datos.precio_desde === '' || Number.isNaN(precio) || precio < 0) {
    errores.push('precio_desde debe ser un numero mayor o igual a 0');
  }
  return errores;
};

const errorInterno = (res, error) => {
  console.error(error.message);
  res.status(500).json({ error: 'Error interno del servidor' });
};

const listar = async (req, res) => {
  try {
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM servicios WHERE activo = 1 ORDER BY id ASC`);
    res.status(200).json(filas);
  } catch (error) {
    errorInterno(res, error);
  }
};

const obtenerPorId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ error: 'El id debe ser un entero positivo' });
    }
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM servicios WHERE id = ? AND activo = 1`, [id]);
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(200).json(filas[0]);
  } catch (error) {
    errorInterno(res, error);
  }
};

const crear = async (req, res) => {
  try {
    const datos = normalizar(req.body || {});
    const errores = validar(datos);
    if (errores.length > 0) {
      return res.status(400).json({ error: errores.join('; ') });
    }
    const [resultado] = await pool.execute(
      'INSERT INTO servicios (nombre, descripcion, tipo_equipo, precio_desde, tiempo_estimado, imagen_url, activo) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [datos.nombre, datos.descripcion, datos.tipo_equipo, datos.precio_desde, datos.tiempo_estimado, datos.imagen_url, datos.activo]
    );
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM servicios WHERE id = ?`, [resultado.insertId]);
    res.status(201).json(filas[0]);
  } catch (error) {
    errorInterno(res, error);
  }
};

const actualizar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ error: 'El id debe ser un entero positivo' });
    }
    const [existentes] = await pool.execute(`SELECT ${CAMPOS} FROM servicios WHERE id = ? AND activo = 1`, [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    const combinado = normalizar({ ...existentes[0], ...(req.body || {}) });
    const errores = validar(combinado);
    if (errores.length > 0) {
      return res.status(400).json({ error: errores.join('; ') });
    }
    await pool.execute(
      'UPDATE servicios SET nombre = ?, descripcion = ?, tipo_equipo = ?, precio_desde = ?, tiempo_estimado = ?, imagen_url = ?, activo = ? WHERE id = ?',
      [combinado.nombre, combinado.descripcion, combinado.tipo_equipo, combinado.precio_desde, combinado.tiempo_estimado, combinado.imagen_url, combinado.activo, id]
    );
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM servicios WHERE id = ?`, [id]);
    res.status(200).json(filas[0]);
  } catch (error) {
    errorInterno(res, error);
  }
};

const eliminar = async (req, res) => {
  try {
    const { id } = req.params;
    if (!idValido(id)) {
      return res.status(400).json({ error: 'El id debe ser un entero positivo' });
    }
    const [resultado] = await pool.execute('UPDATE servicios SET activo = 0 WHERE id = ? AND activo = 1', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Servicio no encontrado' });
    }
    res.status(200).json({ mensaje: 'Servicio desactivado correctamente' });
  } catch (error) {
    errorInterno(res, error);
  }
};

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
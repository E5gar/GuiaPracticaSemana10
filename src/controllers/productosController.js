const pool = require('../config/db');

const CAMPOS = 'id, nombre, descripcion, categoria, precio, stock, imagen_url, creado_en, actualizado_en';

const idValido = (valor) => Number.isInteger(Number(valor)) && Number(valor) > 0;

const normalizar = (datos) => ({
  nombre: typeof datos.nombre === 'string' ? datos.nombre.trim() : datos.nombre,
  descripcion: datos.descripcion ?? null,
  categoria: typeof datos.categoria === 'string' ? datos.categoria.trim() : datos.categoria,
  precio: datos.precio,
  stock: datos.stock ?? 0,
  imagen_url: datos.imagen_url ?? null
});

const validar = (datos) => {
  const errores = [];
  if (typeof datos.nombre !== 'string' || datos.nombre.length < 2 || datos.nombre.length > 120) {
    errores.push('nombre debe tener entre 2 y 120 caracteres');
  }
  if (typeof datos.categoria !== 'string' || datos.categoria.length === 0) {
    errores.push('categoria es obligatoria');
  }
  const precio = Number(datos.precio);
  if (datos.precio === undefined || datos.precio === null || datos.precio === '' || Number.isNaN(precio) || precio < 0) {
    errores.push('precio debe ser un numero mayor o igual a 0');
  }
  const stock = Number(datos.stock);
  if (!Number.isInteger(stock) || stock < 0) {
    errores.push('stock debe ser un entero mayor o igual a 0');
  }
  return errores;
};

const errorInterno = (res, error) => {
  console.error(error.message);
  res.status(500).json({ error: 'Error interno del servidor' });
};

const listar = async (req, res) => {
  try {
    const { categoria } = req.query;
    const parametros = [];
    let sql = `SELECT ${CAMPOS} FROM productos`;
    if (categoria) {
      sql += ' WHERE categoria = ?';
      parametros.push(categoria);
    }
    sql += ' ORDER BY id DESC';
    const [filas] = await pool.execute(sql, parametros);
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
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM productos WHERE id = ?`, [id]);
    if (filas.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
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
      'INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen_url) VALUES (?, ?, ?, ?, ?, ?)',
      [datos.nombre, datos.descripcion, datos.categoria, datos.precio, datos.stock, datos.imagen_url]
    );
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM productos WHERE id = ?`, [resultado.insertId]);
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
    const [existentes] = await pool.execute(`SELECT ${CAMPOS} FROM productos WHERE id = ?`, [id]);
    if (existentes.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    const combinado = normalizar({ ...existentes[0], ...(req.body || {}) });
    const errores = validar(combinado);
    if (errores.length > 0) {
      return res.status(400).json({ error: errores.join('; ') });
    }
    await pool.execute(
      'UPDATE productos SET nombre = ?, descripcion = ?, categoria = ?, precio = ?, stock = ?, imagen_url = ? WHERE id = ?',
      [combinado.nombre, combinado.descripcion, combinado.categoria, combinado.precio, combinado.stock, combinado.imagen_url, id]
    );
    const [filas] = await pool.execute(`SELECT ${CAMPOS} FROM productos WHERE id = ?`, [id]);
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
    const [resultado] = await pool.execute('DELETE FROM productos WHERE id = ?', [id]);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.status(200).json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    errorInterno(res, error);
  }
};

module.exports = { listar, obtenerPorId, crear, actualizar, eliminar };
const API_PRODUCTOS = '/api/productos';

const listaProductos = document.getElementById('productos-lista');
const formulario = document.getElementById('formulario-producto');
const campoId = document.getElementById('producto-id');
const campoNombre = document.getElementById('producto-nombre');
const campoCategoria = document.getElementById('producto-categoria');
const campoPrecio = document.getElementById('producto-precio');
const campoStock = document.getElementById('producto-stock');
const campoImagen = document.getElementById('producto-imagen');
const campoDescripcion = document.getElementById('producto-descripcion');
const tituloFormulario = document.getElementById('formulario-titulo');
const modoFormulario = document.getElementById('formulario-modo');
const botonCancelar = document.getElementById('boton-cancelar');
const filtroCategoria = document.getElementById('filtro-categoria');
const contador = document.getElementById('contador-productos');
const mensaje = document.getElementById('mensaje');

let productos = [];

const textoSeguro = (texto) => {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
};

const moneda = (valor) => `S/ ${Number(valor).toFixed(2)}`;

const pintarIconos = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const mostrarMensaje = (texto, esError = false) => {
  mensaje.textContent = texto;
  mensaje.classList.toggle('error', esError);
};

const tarjetaProducto = (producto) => `
  <article class="tarjeta-producto">
    ${
      producto.imagen_url
        ? `<img src="${textoSeguro(producto.imagen_url)}" alt="Lorem ipsum dolor sit amet" loading="lazy">`
        : '<div class="imagen-vacia"><i data-lucide="cpu"></i></div>'
    }
    <div class="tarjeta-cuerpo">
      <span class="etiqueta">${textoSeguro(producto.categoria)}</span>
      <h3>${textoSeguro(producto.nombre)}</h3>
      <p>${textoSeguro(producto.descripcion)}</p>
      <div class="tarjeta-pie">
        <strong>${moneda(producto.precio)}</strong>
        <span class="dato-mono ${producto.stock <= 5 ? 'stock-bajo' : ''}"><i data-lucide="boxes"></i>Stock ${producto.stock}</span>
      </div>
      <div class="acciones">
        <button type="button" class="boton-icono" data-accion="editar" data-id="${producto.id}"><i data-lucide="pencil"></i>Editar</button>
        <button type="button" class="boton-icono boton-peligro" data-accion="eliminar" data-id="${producto.id}"><i data-lucide="trash-2"></i>Eliminar</button>
      </div>
    </div>
  </article>
`;

const actualizarFiltro = () => {
  const seleccionada = filtroCategoria.value;
  const categorias = [...new Set(productos.map((producto) => producto.categoria))].sort();
  filtroCategoria.innerHTML = '<option value="">Todas</option>' +
    categorias.map((categoria) => `<option value="${textoSeguro(categoria)}">${textoSeguro(categoria)}</option>`).join('');
  filtroCategoria.value = categorias.includes(seleccionada) ? seleccionada : '';
};

const pintarProductos = () => {
  const categoria = filtroCategoria.value;
  const visibles = categoria ? productos.filter((producto) => producto.categoria === categoria) : productos;
  contador.textContent = `${visibles.length} ${visibles.length === 1 ? 'producto' : 'productos'}`;

  if (visibles.length === 0) {
    listaProductos.innerHTML = '<p class="estado-vacio">No hay productos para mostrar.</p>';
    return;
  }

  listaProductos.innerHTML = visibles.map(tarjetaProducto).join('');
  pintarIconos();
};

const cargarProductos = async () => {
  try {
    const respuesta = await fetch(API_PRODUCTOS);
    if (!respuesta.ok) throw new Error('Respuesta no valida');
    productos = await respuesta.json();
    actualizarFiltro();
    pintarProductos();
  } catch (error) {
    listaProductos.innerHTML = '<p class="estado-vacio">No se pudieron cargar los productos.</p>';
  }
};

const reiniciarFormulario = () => {
  formulario.reset();
  campoId.value = '';
  tituloFormulario.textContent = 'Nuevo producto';
  modoFormulario.textContent = 'Crear';
};

const cargarEnFormulario = (producto) => {
  campoId.value = producto.id;
  campoNombre.value = producto.nombre;
  campoCategoria.value = producto.categoria;
  campoPrecio.value = producto.precio;
  campoStock.value = producto.stock;
  campoImagen.value = producto.imagen_url || '';
  campoDescripcion.value = producto.descripcion || '';
  tituloFormulario.textContent = 'Editar producto';
  modoFormulario.textContent = `ID ${producto.id}`;
  formulario.scrollIntoView({ behavior: 'auto', block: 'nearest' });
  campoNombre.focus();
};

const guardarProducto = async (evento) => {
  evento.preventDefault();
  mostrarMensaje('');

  const datos = {
    nombre: campoNombre.value.trim(),
    categoria: campoCategoria.value.trim(),
    precio: campoPrecio.value,
    stock: campoStock.value === '' ? 0 : Number(campoStock.value),
    imagen_url: campoImagen.value.trim() || null,
    descripcion: campoDescripcion.value.trim() || null
  };

  const id = campoId.value;
  const url = id ? `${API_PRODUCTOS}/${id}` : API_PRODUCTOS;
  const metodo = id ? 'PUT' : 'POST';

  try {
    const respuesta = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    const cuerpo = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(cuerpo.error || 'No se pudo guardar el producto', true);
      return;
    }

    mostrarMensaje(id ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
    reiniciarFormulario();
    await cargarProductos();
  } catch (error) {
    mostrarMensaje('No se pudo conectar con el servidor', true);
  }
};

const eliminarProducto = async (id) => {
  const producto = productos.find((item) => item.id === Number(id));
  const nombre = producto ? producto.nombre : 'este producto';
  if (!window.confirm(`Se eliminara ${nombre}. Deseas continuar?`)) return;

  try {
    const respuesta = await fetch(`${API_PRODUCTOS}/${id}`, { method: 'DELETE' });
    const cuerpo = await respuesta.json();

    if (!respuesta.ok) {
      mostrarMensaje(cuerpo.error || 'No se pudo eliminar el producto', true);
      return;
    }

    mostrarMensaje(cuerpo.mensaje);
    if (campoId.value === String(id)) reiniciarFormulario();
    await cargarProductos();
  } catch (error) {
    mostrarMensaje('No se pudo conectar con el servidor', true);
  }
};

listaProductos.addEventListener('click', (evento) => {
  const boton = evento.target.closest('button[data-accion]');
  if (!boton) return;

  const { accion, id } = boton.dataset;
  if (accion === 'editar') {
    const producto = productos.find((item) => item.id === Number(id));
    if (producto) cargarEnFormulario(producto);
  }
  if (accion === 'eliminar') {
    eliminarProducto(id);
  }
});

formulario.addEventListener('submit', guardarProducto);

botonCancelar.addEventListener('click', () => {
  reiniciarFormulario();
  mostrarMensaje('');
});

filtroCategoria.addEventListener('change', pintarProductos);

document.addEventListener('DOMContentLoaded', cargarProductos);
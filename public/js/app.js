const API_SERVICIOS = '/api/servicios';

const escapar = (texto) => {
  const div = document.createElement('div');
  div.textContent = texto ?? '';
  return div.innerHTML;
};

const formatearPrecio = (valor) => `S/ ${Number(valor).toFixed(2)}`;

const iniciarIconos = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const iniciarMenu = () => {
  const boton = document.getElementById('nav-menu');
  const enlaces = document.getElementById('nav-enlaces');
  if (!boton || !enlaces) return;

  boton.addEventListener('click', () => {
    const abierto = enlaces.classList.toggle('abierto');
    boton.setAttribute('aria-expanded', String(abierto));
  });

  enlaces.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      enlaces.classList.remove('abierto');
      boton.setAttribute('aria-expanded', 'false');
    });
  });
};

const tarjetaServicio = (servicio) => `
  <article class="tarjeta-servicio">
    ${servicio.imagen_url ? `<img src="${escapar(servicio.imagen_url)}" alt="Lorem ipsum dolor sit amet" loading="lazy">` : ''}
    <div class="tarjeta-cuerpo">
      <span class="etiqueta">${escapar(servicio.tipo_equipo)}</span>
      <h3>${escapar(servicio.nombre)}</h3>
      <p>${escapar(servicio.descripcion)}</p>
      <div class="tarjeta-pie">
        <strong>Desde ${formatearPrecio(servicio.precio_desde)}</strong>
        <span class="dato-mono"><i data-lucide="timer"></i>${escapar(servicio.tiempo_estimado || 'A consultar')}</span>
      </div>
    </div>
  </article>
`;

const cargarServicios = async () => {
  const contenedor = document.getElementById('servicios-lista');
  if (!contenedor) return;

  try {
    const respuesta = await fetch(API_SERVICIOS);
    if (!respuesta.ok) throw new Error('Respuesta no valida');
    const servicios = await respuesta.json();

    if (servicios.length === 0) {
      contenedor.innerHTML = '<p class="estado-vacio">No hay servicios disponibles.</p>';
      return;
    }

    contenedor.innerHTML = servicios.map(tarjetaServicio).join('');
    iniciarIconos();
  } catch (error) {
    contenedor.innerHTML = '<p class="estado-vacio">No se pudieron cargar los servicios.</p>';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  iniciarIconos();
  iniciarMenu();
  cargarServicios();
});
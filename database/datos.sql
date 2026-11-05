USE db_lab10;

INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen_url) VALUES
('Pantalla OLED para celular', 'Repuesto de pantalla con garantia de 3 meses, instalacion incluida.', 'Repuestos', 189.00, 12, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'),
('Bateria para laptop 14 pulgadas', 'Bateria de litio compatible con las marcas mas usadas.', 'Repuestos', 135.00, 8, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80'),
('Teclado mecanico compacto', 'Teclado de 75 por ciento con conexion USB y cable desmontable.', 'Accesorios', 119.90, 15, 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'),
('Placa base reacondicionada', 'Placa probada en banco de pruebas, lista para instalar.', 'Componentes', 260.00, 4, 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'),
('Kit de herramientas de precision', 'Juego de 60 puntas, ventosas y palancas para abrir equipos.', 'Herramientas', 59.50, 25, 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=800&q=80'),
('Laptop reacondicionada 15 pulgadas', 'Equipo revisado, con SSD de 256 GB y garantia de 6 meses.', 'Equipos', 1290.00, 3, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80');

INSERT INTO servicios (nombre, descripcion, tipo_equipo, precio_desde, tiempo_estimado, imagen_url, activo) VALUES
('Cambio de pantalla', 'Reemplazo de pantallas rotas o con manchas en celulares y tablets.', 'Celulares', 80.00, '1 a 3 horas', 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80', 1),
('Mantenimiento de laptops', 'Limpieza interna, cambio de pasta termica y optimizacion del sistema.', 'Laptops', 60.00, '24 horas', 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80', 1),
('Reparacion de placa base', 'Diagnostico y reparacion a nivel de componentes electronicos.', 'Computadoras', 150.00, '2 a 5 dias', 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', 1),
('Recuperacion de datos', 'Rescate de informacion de discos y memorias danadas.', 'Almacenamiento', 120.00, '2 a 4 dias', 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80', 1);
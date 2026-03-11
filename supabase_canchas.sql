CREATE TABLE canchas (
  id text PRIMARY KEY,
  nombre text NOT NULL,
  descripcion text,
  direccion text NOT NULL,
  ciudad text NOT NULL,
  coordenadas_lat float,
  coordenadas_lng float,
  tamano text,
  cesped text,
  techo boolean DEFAULT false,
  vestuarios boolean DEFAULT false,
  estacionamiento boolean DEFAULT false,
  iluminacion boolean DEFAULT false,
  bar boolean DEFAULT false,
  servicios_extra jsonb,
  precio_min integer,
  precio_max integer,
  contacto_telefono text,
  contacto_whatsapp text,
  contacto_instagram text,
  imagen text,
  rating float DEFAULT 0,
  total_reviews integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Habilitar permisos de solo lectura pública
ALTER TABLE canchas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Lectura pública de canchas" ON canchas FOR SELECT USING (true);

-- Insertar los datos de prueba
INSERT INTO canchas (
  id, nombre, descripcion, direccion, ciudad, coordenadas_lat, coordenadas_lng, 
  tamano, cesped, techo, vestuarios, estacionamiento, iluminacion, bar, 
  servicios_extra, precio_min, precio_max, contacto_telefono, contacto_whatsapp, contacto_instagram, 
  imagen, rating, total_reviews
) VALUES 
('crc-001', 'Complejo Deportivo El Faro', 'Moderno complejo con 4 canchas techadas de fútbol 5 con césped sintético de última generación. Ideal para grupos y torneos.', 'Av. Circunvalación 2500, Rosario', 'rosario', -32.9217, -60.6762, 'F5', 'sintetico', true, true, true, true, true, '["WiFi", "Palcos VIP", "Alquiler de botines"]', 35000, 50000, '+5493413001234', '+5493413001234', '@elfaro.rosario', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', 4.7, 128),
('crc-002', 'Cancha Los Cedros F7', 'Amplia cancha de fútbol 7 al aire libre con césped natural. Perfecta para partidos entre amigos en un ambiente tranquilo.', 'Bv. Rondeau 880, Rosario', 'rosario', -32.9482, -60.6391, 'F7', 'natural', false, true, false, true, false, '["Tribuna", "Botiquín de primeros auxilios"]', 25000, 38000, '+5493414441122', '+5493414441122', null, 'https://images.unsplash.com/photo-1431324155629-1a6eda1dec2d?auto=format&fit=crop&q=80&w=800', 4.2, 75),
('crc-003', 'SportCenter Ludueña', 'Centro deportivo multijugador con canchas de F5 y F7 techadas. Ambiente familiar y profesional.', 'Av. del Rosario 1400, Ludueña, Rosario', 'rosario', -32.9070, -60.7020, 'F5', 'sintetico', true, true, true, true, true, '["Cancha de pádel", "Tienda de ropa deportiva", "Torneos mensuales"]', 30000, 45000, null, '+5493413557788', '@sportcenter.luduena', 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=800', 4.5, 214),
('crc-004', 'Arena Fútbol Parque Independencia', 'Cancha de fútbol 11 con césped natural a metros del Parque Independencia. Ideal para partidos formales y entrenamientos de clubes.', 'Bv. Oroño 2400, Rosario', 'rosario', -32.9384, -60.6631, 'F11', 'natural', false, true, true, true, false, '["Arcos reglamentarios", "Camerinos con ducha caliente"]', 60000, 90000, '+5493412223344', '+5493412223344', null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800', 4.3, 52),
('crc-005', 'La Redonda Complejo Deportivo', 'Complejo con 6 canchas de fútbol 5 techadas. Una de las mejores instalaciones del norte de Rosario.', 'Av. Alberdi 3200, Rosario', 'rosario', -32.8941, -60.6875, 'F5', 'sintetico', true, true, true, true, true, '["Paddle", "Canillos incluidos", "Transmisión de partidos en pantalla"]', 32000, 48000, null, '+5493416667788', '@laredondacomplex', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', 4.8, 341),
('crc-006', 'Estadio Barrio Belgrano F9', 'Cancha de fútbol 9 al aire libre con iluminación nocturna. Entorno barrial tranquilo y accesible.', 'Cafferata 900, Barrio Belgrano, Rosario', 'rosario', -32.9578, -60.6502, 'F9', 'sintetico', false, false, false, true, false, '["Pelotas incluidas", "Cancha de reserva libre"]', 20000, 30000, '+5493418889900', '+5493418889900', null, 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?auto=format&fit=crop&q=80&w=800', 3.9, 43),
('crc-007', 'Fusion Fútbol & Bar Pichincha', 'Una cancha techada de fútbol 5 con un bar temático de fútbol. Perfecta para jugar y luego distenderse con el equipo.', 'Mendoza 2800, Barrio Pichincha, Rosario', 'rosario', -32.9338, -60.6480, 'F5', 'sintetico', true, true, false, true, true, '["Pantalla gigante", "Menú especial post-partido", "Música en vivo los sábados"]', 38000, 55000, null, '+5493411122334', '@fusionfutbol.ros', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800', 4.6, 187),
('crc-008', 'Green Field Rosario Sur', 'Complejo de canchas de fútbol 7 en el sur de Rosario. Césped sintético premium con gránulos de caucho reciclado.', 'Av. Uriburu 3700, Rosario', 'rosario', -32.9721, -60.6398, 'F7', 'sintetico', false, true, true, true, false, '["Cronómetro digital", "Alquiler de pecheras", "Árbitro disponible"]', 28000, 42000, '+5493415544332', '+5493415544332', '@greenfield.sur', 'https://images.unsplash.com/photo-1518604666860-9ed391f76460?auto=format&fit=crop&q=80&w=800', 4.4, 96),
('crc-009', 'Canchas del Parque Alem', 'Canchas de fútbol 7 y 9 en un entorno natural junto al Parque Regional Sur. Césped natural cuidado.', 'Parque Regional Sur, Av. Circunvalación Sur, Rosario', 'rosario', -33.0020, -60.6600, 'F7', 'natural', false, false, true, false, false, '["Acceso a parque recreativo", "Mesas de picnic", "Solo disponible de día"]', 18000, 28000, '+5493417778899', null, null, 'https://images.unsplash.com/photo-1431324155629-1a6eda1dec2d?auto=format&fit=crop&q=80&w=800', 4.0, 31),
('crc-010', 'Pro Sport Complejo Alberdi', 'Complejo premium con canchas de fútbol 5, 7 y 9. Infraestructura de primer nivel con tribuna y transmisión.', 'Av. Francia 3500, Barrio Alberdi, Rosario', 'rosario', -32.9147, -60.6734, 'F9', 'sintetico', true, true, true, true, true, '["Transmisión de partidos", "Tribuna con capacidad para 80 personas", "Staff de árbitros", "Kiosco"]', 42000, 65000, null, '+5493419900112', '@prosport.alberdi', 'https://images.unsplash.com/photo-1529900948632-58cf748d5b51?auto=format&fit=crop&q=80&w=800', 4.9, 408),
('crc-011', 'Club Social El Gaucho', 'Club barrial con cancha de fútbol 11 de césped natural. Historia y tradición rosarina.', 'Pueyrredón 1700, Rosario', 'rosario', -32.9290, -60.6820, 'F11', 'natural', false, true, false, false, true, '["Cancha habilitada AFA", "Salón de fiestas", "Solo alquileres diurnos"]', 50000, 75000, '+5493413344556', '+5493413344556', null, 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=800', 4.1, 67),
('crc-012', 'Flash Fútbol 5 - Zona Centro', 'La única cancha techada en pleno centro de Rosario. Acceso rápido en transporte público.', 'Córdoba 1200, Centro, Rosario', 'rosario', -32.9469, -60.6387, 'F5', 'sintetico', true, true, false, true, false, '["A 2 cuadras de estación de colectivos", "Convenios para abonos mensuales"]', 40000, 58000, null, '+5493416655443', '@flashf5.rosario', 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800', 4.3, 152);

-- 1. Crear el bucket llamado 'canchas_images' si no existe, y hacerlo público
INSERT INTO storage.buckets (id, name, public)
VALUES ('canchas_images', 'canchas_images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Permitir que cualquier persona pueda ver/descargar las imágenes (Público)
CREATE POLICY "Lectura pública de imagenes" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'canchas_images' );

-- 3. Permitir que usuarios autenticados (Idealmente solo admins, pero la lógica de la app ya los filtra) publiquen
CREATE POLICY "Autenticados pueden subir imagenes" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'canchas_images' );

-- 4. Permitir actualizar y borrar
CREATE POLICY "Autenticados pueden actualizar imagenes" 
ON storage.objects FOR UPDATE 
TO authenticated
USING ( bucket_id = 'canchas_images' );

CREATE POLICY "Autenticados pueden borrar imagenes" 
ON storage.objects FOR DELETE 
TO authenticated
USING ( bucket_id = 'canchas_images' );

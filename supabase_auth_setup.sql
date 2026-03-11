-- Tabla de perfiles asociada a los usuarios registrados
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  nombre text,
  apellido text,
  telefono text,
  is_admin boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Habilitar RLS para profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de la tabla perfiles
CREATE POLICY "Public perfiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Función para copiar automáticamente a profiles cuando alguien se registra en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, apellido, telefono)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'nombre',
    new.raw_user_meta_data->>'apellido',
    new.raw_user_meta_data->>'telefono'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cada vez que se registra un nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Actualizar políticas de la tabla Canchas para restringir creación/edición a los administradores
DROP POLICY IF EXISTS "Escritura pública de canchas" ON public.canchas;

CREATE POLICY "Solo administradores pueden insertar canchas" 
ON public.canchas FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Solo administradores pueden actualizar canchas" 
ON public.canchas FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "Solo administradores pueden borrar canchas" 
ON public.canchas FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND is_admin = true));

-- Tip: 
-- Para hacerte administrador de tu propia app:
-- Registrate primero en la app. Luego en la base de datos corre esto con tu mail:
-- UPDATE public.profiles SET is_admin = true WHERE id = (SELECT id FROM auth.users WHERE email = 'tu_correo@gmail.com');

-- Creamos la tabla de reviews conectada a la cancha y al usuario
CREATE TABLE public.reviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    cancha_id text REFERENCES public.canchas(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    rating numeric(3, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comentario text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(cancha_id, user_id) -- Un usuario solo puede dejar una reseña por cancha (opcional, pero buena práctica)
);

-- Habilitar RLS
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Políticas de lectura (todos pueden ver las reviews)
CREATE POLICY "Public reviews are viewable by everyone" 
ON public.reviews FOR SELECT USING (true);

-- Políticas de escritura (los usuarios autenticados pueden crear sus propias reviews)
CREATE POLICY "Users can create their own reviews" 
ON public.reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Opcional: Update/delete de tu propia review
CREATE POLICY "Users can update their own reviews" 
ON public.reviews FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews FOR DELETE 
USING (auth.uid() = user_id);


-- Funcion y Trigger para actualizar automáticamente el puntaje de la cancha al agregar/borrar reviews
CREATE OR REPLACE FUNCTION update_cancha_rating()
RETURNS trigger AS $$
BEGIN
    if tg_op = 'INSERT' or tg_op = 'UPDATE' THEN
        UPDATE public.canchas
        SET 
            rating = (SELECT coalesce(avg(rating), 0) FROM public.reviews WHERE cancha_id = NEW.cancha_id),
            total_reviews = (SELECT count(*) FROM public.reviews WHERE cancha_id = NEW.cancha_id)
        WHERE id = NEW.cancha_id;
        RETURN NEW;
    ELSIF tg_op = 'DELETE' THEN
        UPDATE public.canchas
        SET 
            rating = (SELECT coalesce(avg(rating), 0) FROM public.reviews WHERE cancha_id = OLD.cancha_id),
            total_reviews = (SELECT count(*) FROM public.reviews WHERE cancha_id = OLD.cancha_id)
        WHERE id = OLD.cancha_id;
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cancha_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE PROCEDURE update_cancha_rating();

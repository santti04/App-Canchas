import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Cancha } from '../types';

interface CanchaContextData {
  canchas: Cancha[];
  loading: boolean;
  refreshCanchas: () => Promise<void>;
}

const CanchaContext = createContext<CanchaContextData>({
  canchas: [],
  loading: true,
  refreshCanchas: async () => {},
});

export const CanchaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [canchas, setCanchas] = useState<Cancha[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCanchas = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('canchas').select('*');
    
    if (error) {
      console.error('Error fetching canchas:', error);
    } else if (data) {
      const formattedCanchas: Cancha[] = data.map((item: any) => ({
        id: item.id,
        nombre: item.nombre,
        descripcion: item.descripcion,
        direccion: item.direccion,
        ciudad: item.ciudad,
        coordenadas: { lat: item.coordenadas_lat, lng: item.coordenadas_lng },
        tamano: item.tamano,
        cesped: item.cesped,
        techo: item.techo,
        vestuarios: item.vestuarios,
        estacionamiento: item.estacionamiento,
        iluminacion: item.iluminacion,
        bar: item.bar,
        serviciosExtra: typeof item.servicios_extra === 'string' ? JSON.parse(item.servicios_extra) : item.servicios_extra,
        precioEstimado: { min: item.precio_min, max: item.precio_max, moneda: 'ARS', periodo: 'hora' },
        contacto: {
          telefono: item.contacto_telefono,
          whatsapp: item.contacto_whatsapp,
          instagram: item.contacto_instagram,
        },
        imagen: item.imagen,
        rating: item.rating,
        totalReviews: item.total_reviews,
      }));
      setCanchas(formattedCanchas);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCanchas();
  }, []);

  return (
    <CanchaContext.Provider value={{ canchas, loading, refreshCanchas: fetchCanchas }}>
      {children}
    </CanchaContext.Provider>
  );
};

export const useCanchas = () => useContext(CanchaContext);

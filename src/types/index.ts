// ─── Cancha Types ───────────────────────────────────────────────────────────

export type TamañoCancha = 'F5' | 'F7' | 'F9' | 'F11';
export type TipoCesped = 'natural' | 'sintetico';

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface PrecioEstimado {
  min: number;
  max: number;
  moneda: 'ARS';
  periodo: 'hora';
}

export interface ContactoCancha {
  telefono?: string;
  whatsapp?: string;
  instagram?: string;
}

export interface Cancha {
  id: string;
  nombre: string;
  descripcion: string;
  direccion: string;
  ciudad: string;
  coordenadas: Coordenadas;
  tamano: TamañoCancha;
  cesped: TipoCesped;
  techo: boolean;
  vestuarios: boolean;
  estacionamiento: boolean;
  iluminacion: boolean;
  bar: boolean;
  serviciosExtra: string[];
  precioEstimado: PrecioEstimado;
  contacto: ContactoCancha;
  imagen: string;
  rating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  cancha_id: string;
  user_id: string;
  rating: number;
  comentario: string;
  created_at: string;
  profiles?: {
    nombre: string;
    apellido: string;
  };
}

// ─── Filter Types ────────────────────────────────────────────────────────────

export type FiltroDistancia = 5 | 10 | 20 | null;

export interface FiltrosActivos {
  tamanos: TamañoCancha[];
  cesped: TipoCesped | null;
  distanciaMaxKm: FiltroDistancia;
  searchQuery: string;
  soloTechada: boolean;
  ordenPor: 'precio' | 'rating' | 'distancia' | null;
  ordenDireccion: 'asc' | 'desc';
}

// ─── Navigation Types ────────────────────────────────────────────────────────

export type RootStackParamList = {
  MainTabs: undefined;
  CanchaDetail: { canchaId: string };
  Auth: undefined;
  AddCancha: { editCanchaId?: string } | undefined;
  ReviewsList: { canchaId: string };
};

export type MainTabsParamList = {
  HomeTab: undefined;
  BuscarTab: undefined;
  FavoritosTab: undefined;
  PerfilTab: undefined;
};

// ─── Location Types ──────────────────────────────────────────────────────────

export interface UbicacionUsuario {
  lat: number;
  lng: number;
}

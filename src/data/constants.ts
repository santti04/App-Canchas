import { TamañoCancha, TipoCesped, FiltroDistancia } from '../types';

// ─── Ciudades disponibles ─────────────────────────────────────────────────────

export const CIUDADES_DISPONIBLES = [
    { id: 'rosario', nombre: 'Rosario', provincia: 'Santa Fe', pais: 'Argentina' },
    // Futuras ciudades:
    // { id: 'buenosaires', nombre: 'Buenos Aires', provincia: 'Buenos Aires', pais: 'Argentina' },
    // { id: 'cordoba', nombre: 'Córdoba', provincia: 'Córdoba', pais: 'Argentina' },
];

export const CIUDAD_DEFAULT = CIUDADES_DISPONIBLES[0];

// ─── Opciones de filtrado ─────────────────────────────────────────────────────

export const TAMANOS_CANCHA: { valor: TamañoCancha; label: string; jugadores: string }[] = [
    { valor: 'F5', label: 'Fútbol 5', jugadores: '5 vs 5' },
    { valor: 'F7', label: 'Fútbol 7', jugadores: '7 vs 7' },
    { valor: 'F9', label: 'Fútbol 9', jugadores: '9 vs 9' },
    { valor: 'F11', label: 'Fútbol 11', jugadores: '11 vs 11' },
];

export const TIPOS_CESPED: { valor: TipoCesped; label: string; icon: string }[] = [
    { valor: 'sintetico', label: 'Sintético', icon: '🟢' },
    { valor: 'natural', label: 'Natural', icon: '🌿' },
];

export const OPCIONES_DISTANCIA: { valor: FiltroDistancia; label: string }[] = [
    { valor: 5, label: '< 5 km' },
    { valor: 10, label: '< 10 km' },
    { valor: 20, label: '< 20 km' },
    { valor: null, label: 'Cualquier distancia' },
];

// ─── Filtros por defecto ──────────────────────────────────────────────────────

export const FILTROS_DEFAULT = {
    tamanos: [] as TamañoCancha[],
    cesped: null as TipoCesped | null,
    distanciaMaxKm: null as FiltroDistancia,
    searchQuery: '',
    soloTechada: false,
    ordenPor: 'distancia' as 'precio' | 'rating' | 'distancia' | null,
    ordenDireccion: 'asc' as 'asc' | 'desc',
};

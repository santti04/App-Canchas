import { Cancha, FiltrosActivos, UbicacionUsuario } from '../types';
import { calcularDistanciaKm } from './locationService';

// ─── Cancha Service ───────────────────────────────────────────────────────────

export function filtrarCanchas(
    canchas: Cancha[],
    filtros: FiltrosActivos,
    ubicacionUsuario: UbicacionUsuario | null
): Cancha[] {
    let resultado = [...canchas];

    // Filtro por texto de búsqueda
    if (filtros.searchQuery.trim()) {
        const query = filtros.searchQuery.toLowerCase();
        resultado = resultado.filter(
            (c) =>
                c.nombre.toLowerCase().includes(query) ||
                c.direccion.toLowerCase().includes(query) ||
                c.descripcion.toLowerCase().includes(query)
        );
    }

    // Filtro por tamaño
    if (filtros.tamanos.length > 0) {
        resultado = resultado.filter((c) => filtros.tamanos.includes(c.tamano));
    }

    // Filtro por tipo de césped
    if (filtros.cesped !== null) {
        resultado = resultado.filter((c) => c.cesped === filtros.cesped);
    }

    // Filtro por techo
    if (filtros.soloTechada) {
        resultado = resultado.filter((c) => c.techo);
    }

    // Filtro por distancia (requiere ubicación del usuario)
    if (filtros.distanciaMaxKm !== null && ubicacionUsuario !== null) {
        resultado = resultado.filter((c) => {
            const distancia = calcularDistanciaKm(
                { lat: ubicacionUsuario.lat, lng: ubicacionUsuario.lng },
                c.coordenadas
            );
            return distancia <= filtros.distanciaMaxKm!;
        });
    }

    // Ordenar resultados
    if (filtros.ordenPor) {
        resultado.sort((a, b) => {
            let valA: number = 0;
            let valB: number = 0;

            if (filtros.ordenPor === 'precio') {
                valA = a.precioEstimado.min;
                valB = b.precioEstimado.min;
            } else if (filtros.ordenPor === 'rating') {
                valA = a.rating;
                valB = b.rating;
            } else if (filtros.ordenPor === 'distancia' && ubicacionUsuario) {
                valA = calcularDistanciaKm(ubicacionUsuario, a.coordenadas);
                valB = calcularDistanciaKm(ubicacionUsuario, b.coordenadas);
            }

            if (filtros.ordenDireccion === 'asc') {
                return valA - valB;
            } else {
                return valB - valA;
            }
        });
    } else if (ubicacionUsuario) {
        // Orden por defecto si hay ubicación: distancia ascendente
        resultado.sort((a, b) => {
            const distA = calcularDistanciaKm(ubicacionUsuario, a.coordenadas);
            const distB = calcularDistanciaKm(ubicacionUsuario, b.coordenadas);
            return distA - distB;
        });
    } else {
        // Orden por defecto sin ubicación: rating descendente
        resultado.sort((a, b) => b.rating - a.rating);
    }

    return resultado;
}

export function getCanchaById(canchas: Cancha[], id: string): Cancha | undefined {
    return canchas.find((c) => c.id === id);
}

export function getCanchasDestacadas(canchas: Cancha[], limit = 4): Cancha[] {
    return [...canchas].sort((a, b) => b.rating - a.rating).slice(0, limit);
}

export function formatPrecio(cancha: Cancha): string {
    const { min, max, moneda } = cancha.precioEstimado;
    const fmt = (n: number) =>
        n.toLocaleString('es-AR', { style: 'currency', currency: moneda, maximumFractionDigits: 0 });
    return `${fmt(min)} – ${fmt(max)} / hora`;
}

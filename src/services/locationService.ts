import { Coordenadas } from '../types';

// ─── Haversine Distance Formula ───────────────────────────────────────────────
// Calculates the straight-line distance in km between two lat/lng coordinates.

const EARTH_RADIUS_KM = 6371;

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

export function calcularDistanciaKm(
    punto1: Coordenadas,
    punto2: Coordenadas
): number {
    const dLat = toRad(punto2.lat - punto1.lat);
    const dLng = toRad(punto2.lng - punto1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(punto1.lat)) *
        Math.cos(toRad(punto2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return EARTH_RADIUS_KM * c;
}

export function formatDistancia(km: number): string {
    if (km < 1) {
        return `${Math.round(km * 1000)} m`;
    }
    return `${km.toFixed(1)} km`;
}

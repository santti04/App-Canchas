import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { UbicacionUsuario } from '../types';

interface UseLocationResult {
    ubicacion: UbicacionUsuario | null;
    permisoConcedido: boolean | null;
    cargando: boolean;
    error: string | null;
    solicitarPermiso: () => Promise<void>;
}

export function useLocation(): UseLocationResult {
    const [ubicacion, setUbicacion] = useState<UbicacionUsuario | null>(null);
    const [permisoConcedido, setPermisoConcedido] = useState<boolean | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const solicitarPermiso = async () => {
        setCargando(true);
        setError(null);

        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            const concedido = status === 'granted';
            setPermisoConcedido(concedido);

            if (concedido) {
                const loc = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced,
                });
                setUbicacion({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude,
                });
            } else {
                setError('Se requieren permisos de ubicación para filtrar por distancia.');
            }
        } catch (e) {
            setError('No se pudo obtener tu ubicación. Verificá que el GPS esté activado.');
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        // Check if permission was already granted on mount
        (async () => {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status === 'granted') {
                setPermisoConcedido(true);
                setCargando(true);
                try {
                    const loc = await Location.getCurrentPositionAsync({
                        accuracy: Location.Accuracy.Balanced,
                    });
                    setUbicacion({
                        lat: loc.coords.latitude,
                        lng: loc.coords.longitude,
                    });
                } catch {
                    // Permission granted but location unavailable (e.g. emulator)
                } finally {
                    setCargando(false);
                }
            } else {
                setPermisoConcedido(false);
            }
        })();
    }, []);

    return { ubicacion, permisoConcedido, cargando, error, solicitarPermiso };
}

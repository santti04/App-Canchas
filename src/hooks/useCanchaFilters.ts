import { useState, useMemo } from 'react';
import { FiltrosActivos, TamañoCancha, TipoCesped, FiltroDistancia, Cancha, UbicacionUsuario } from '../types';
import { FILTROS_DEFAULT } from '../data/constants';
import { filtrarCanchas } from '../services/canchaService';

interface UseCanchaFiltersResult {
    filtros: FiltrosActivos;
    canchasFiltradas: Cancha[];
    totalActivo: number;
    toggleTamano: (tamano: TamañoCancha) => void;
    setCesped: (tipo: TipoCesped | null) => void;
    setDistancia: (dist: FiltroDistancia) => void;
    setSearchQuery: (q: string) => void;
    toggleTecho: () => void;
    setOrden: (por: 'precio' | 'rating' | 'distancia' | null, dir?: 'asc' | 'desc') => void;
    limpiarFiltros: () => void;
}

export function useCanchaFilters(
    todasLasCanchas: Cancha[],
    ubicacion: UbicacionUsuario | null
): UseCanchaFiltersResult {
    const [filtros, setFiltros] = useState<FiltrosActivos>(FILTROS_DEFAULT);

    const canchasFiltradas = useMemo(
        () => filtrarCanchas(todasLasCanchas, filtros, ubicacion),
        [todasLasCanchas, filtros, ubicacion]
    );

    // Count how many filters are active (for badge indicator)
    const totalActivo = useMemo(() => {
        let count = 0;
        if (filtros.tamanos.length > 0) count += filtros.tamanos.length;
        if (filtros.cesped !== null) count++;
        if (filtros.distanciaMaxKm !== null) count++;
        if (filtros.soloTechada) count++;
        return count;
    }, [filtros]);

    const toggleTamano = (tamano: TamañoCancha) => {
        setFiltros((prev) => ({
            ...prev,
            tamanos: prev.tamanos.includes(tamano)
                ? prev.tamanos.filter((t) => t !== tamano)
                : [...prev.tamanos, tamano],
        }));
    };

    const setCesped = (tipo: TipoCesped | null) => {
        setFiltros((prev) => ({ ...prev, cesped: tipo }));
    };

    const setDistancia = (dist: FiltroDistancia) => {
        setFiltros((prev) => ({ ...prev, distanciaMaxKm: dist }));
    };

    const setSearchQuery = (q: string) => {
        setFiltros((prev) => ({ ...prev, searchQuery: q }));
    };

    const toggleTecho = () => {
        setFiltros((prev) => ({ ...prev, soloTechada: !prev.soloTechada }));
    };

    const setOrden = (por: 'precio' | 'rating' | 'distancia' | null, dir?: 'asc' | 'desc') => {
        setFiltros((prev) => ({
            ...prev,
            ordenPor: por,
            ordenDireccion: dir || prev.ordenDireccion,
        }));
    };

    const limpiarFiltros = () => {
        setFiltros(FILTROS_DEFAULT);
    };

    return {
        filtros,
        canchasFiltradas,
        totalActivo,
        toggleTamano,
        setCesped,
        setDistancia,
        setSearchQuery,
        toggleTecho,
        setOrden,
        limpiarFiltros,
    };
}

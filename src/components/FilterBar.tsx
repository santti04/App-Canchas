import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FiltrosActivos, TamañoCancha, TipoCesped, FiltroDistancia } from '../types';
import { TAMANOS_CANCHA, TIPOS_CESPED, OPCIONES_DISTANCIA } from '../data/constants';
import { colors, spacing, radius, fontSize, fontWeight } from '../theme';

interface Props {
    filtros: FiltrosActivos;
    totalActivo: number;
    onOpenModal: () => void;
    onToggleTamano: (tamano: TamañoCancha) => void;
    onToggleTecho: () => void;
    onSetCesped: (tipo: TipoCesped | null) => void;
}

export default function FilterBar({ filtros, totalActivo, onOpenModal, onToggleTamano, onToggleTecho, onSetCesped }: Props) {
    const hasFilterActive = totalActivo > 0;

    const activeTamanoLabels = TAMANOS_CANCHA
        .filter((t) => filtros.tamanos.includes(t.valor))
        .map((t) => t.valor);

    const activeCespedLabel = TIPOS_CESPED.find((c) => c.valor === filtros.cesped)?.label;

    const activeDistLabel = OPCIONES_DISTANCIA.find(
        (o) => o.valor === filtros.distanciaMaxKm
    )?.label;

    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {/* Filter button */}
                <TouchableOpacity
                    style={[styles.filterBtn, hasFilterActive && styles.filterBtnActive]}
                    onPress={onOpenModal}
                    activeOpacity={0.8}
                >
                    <Ionicons
                        name="options-outline"
                        size={16}
                        color={hasFilterActive ? colors.primary : colors.textSecondary}
                    />
                    {hasFilterActive && (
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>{totalActivo}</Text>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Roof toggle chip (Quick) */}
                <TouchableOpacity 
                    style={[styles.chip, filtros.soloTechada && styles.chipActive]} 
                    onPress={onToggleTecho}
                    activeOpacity={0.8}
                >
                    <Ionicons 
                        name={filtros.soloTechada ? "home" : "home-outline"} 
                        size={14} 
                        color={filtros.soloTechada ? colors.primary : colors.textSecondary} 
                        style={{ marginRight: 4 }}
                    />
                    <Text style={filtros.soloTechada ? styles.chipActiveText : styles.chipText}>Techada</Text>
                </TouchableOpacity>

                {/* Active/Quick filter chips */}
                {TAMANOS_CANCHA.map((t) => {
                    const isActive = filtros.tamanos.includes(t.valor);
                    return (
                        <TouchableOpacity 
                            key={t.valor} 
                            style={[styles.chip, isActive && styles.chipActive]}
                            onPress={() => onToggleTamano(t.valor)}
                            activeOpacity={0.8}
                        >
                            <Text style={isActive ? styles.chipActiveText : styles.chipText}>{t.valor}</Text>
                        </TouchableOpacity>
                    );
                })}

                {filtros.cesped && (
                    <TouchableOpacity 
                        style={[styles.chip, styles.chipActive]}
                        onPress={() => onSetCesped(null)}
                    >
                        <Text style={styles.chipActiveText}>{activeCespedLabel}</Text>
                        <Ionicons name="close-circle" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
                    </TouchableOpacity>
                )}

                {activeDistLabel && filtros.distanciaMaxKm !== null && (
                    <View style={[styles.chip, styles.chipActive]}>
                        <Ionicons name="navigate-outline" size={12} color={colors.primary} style={{ marginRight: 3 }} />
                        <Text style={styles.chipActiveText}>{activeDistLabel}</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingBottom: spacing.sm,
    },
    container: {
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        gap: spacing.xs,
        paddingVertical: spacing.xs,
    },
    filterBtn: {
        width: 38,
        height: 38,
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.xs,
    },
    filterBtnActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '22',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: colors.primary,
        borderRadius: radius.full,
        width: 16,
        height: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeText: {
        color: colors.white,
        fontSize: 9,
        fontWeight: fontWeight.bold,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs + 2,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chipActive: {
        backgroundColor: colors.primary + '22',
        borderColor: colors.primary,
    },
    chipText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    chipActiveText: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
});

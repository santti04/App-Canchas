import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
    ScrollView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FiltrosActivos, TamañoCancha, TipoCesped, FiltroDistancia } from '../types';
import { TAMANOS_CANCHA, TIPOS_CESPED, OPCIONES_DISTANCIA } from '../data/constants';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';

interface Props {
    visible: boolean;
    filtros: FiltrosActivos;
    ubicacionDisponible: boolean;
    onClose: () => void;
    onToggleTamano: (t: TamañoCancha) => void;
    onSetCesped: (c: TipoCesped | null) => void;
    onSetDistancia: (d: FiltroDistancia) => void;
    onToggleTecho: () => void;
    onLimpiar: () => void;
}

export default function FilterModal({
    visible,
    filtros,
    ubicacionDisponible,
    onClose,
    onToggleTamano,
    onToggleTecho,
    onSetCesped,
    onSetDistancia,
    onLimpiar,
}: Props) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>

            <View style={[styles.sheet, shadow.lg]}>
                {/* Handle */}
                <View style={styles.handle} />

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Filtros</Text>
                    <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close" size={24} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>⚽ Tamaño de cancha</Text>
                        <View style={styles.optionsGrid}>
                            {TAMANOS_CANCHA.map((t) => {
                                const active = filtros.tamanos.includes(t.valor);
                                return (
                                    <TouchableOpacity
                                        key={t.valor}
                                        style={[styles.optionCard, active && styles.optionCardActive]}
                                        onPress={() => onToggleTamano(t.valor)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.optionCardTitle, active && styles.optionCardTitleActive]}>
                                            {t.valor}
                                        </Text>
                                        <Text style={[styles.optionCardSub, active && styles.optionCardSubActive]}>
                                            {t.label}
                                        </Text>
                                        <Text style={[styles.optionCardSub, active && styles.optionCardSubActive]}>
                                            {t.jugadores}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* ── Infraestructura (Techada) ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🏠 Infraestructura</Text>
                        <View style={styles.optionsRow}>
                            <TouchableOpacity
                                style={[styles.rowOption, filtros.soloTechada && styles.rowOptionActive]}
                                onPress={onToggleTecho}
                                activeOpacity={0.8}
                            >
                                <Ionicons 
                                    name={filtros.soloTechada ? "home" : "home-outline"} 
                                    size={16} 
                                    color={filtros.soloTechada ? colors.primary : colors.textSecondary} 
                                />
                                <Text style={[styles.rowOptionText, filtros.soloTechada && styles.rowOptionTextActive]}>
                                    Solo techadas
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── Césped ── */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>🌿 Tipo de césped</Text>
                        <View style={styles.optionsRow}>
                            {/* "Todos" option */}
                            <TouchableOpacity
                                style={[styles.rowOption, filtros.cesped === null && styles.rowOptionActive]}
                                onPress={() => onSetCesped(null)}
                                activeOpacity={0.8}
                            >
                                <Text style={[styles.rowOptionText, filtros.cesped === null && styles.rowOptionTextActive]}>
                                    Todos
                                </Text>
                            </TouchableOpacity>

                            {TIPOS_CESPED.map((c) => {
                                const active = filtros.cesped === c.valor;
                                return (
                                    <TouchableOpacity
                                        key={c.valor}
                                        style={[styles.rowOption, active && styles.rowOptionActive]}
                                        onPress={() => onSetCesped(active ? null : c.valor)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={styles.optionEmoji}>{c.icon}</Text>
                                        <Text style={[styles.rowOptionText, active && styles.rowOptionTextActive]}>
                                            {c.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* ── Distancia ── */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>📍 Distancia máxima</Text>
                            {!ubicacionDisponible && (
                                <View style={styles.gpsBadge}>
                                    <Ionicons name="navigate-outline" size={11} color={colors.warning} />
                                    <Text style={styles.gpsBadgeText}>Requiere GPS</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.optionsRow}>
                            {OPCIONES_DISTANCIA.map((o) => {
                                const active = filtros.distanciaMaxKm === o.valor;
                                return (
                                    <TouchableOpacity
                                        key={String(o.valor)}
                                        style={[styles.rowOption, active && styles.rowOptionActive]}
                                        onPress={() => onSetDistancia(o.valor)}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.rowOptionText, active && styles.rowOptionTextActive]}>
                                            {o.label}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                {/* Footer buttons */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.clearBtn} onPress={onLimpiar} activeOpacity={0.8}>
                        <Text style={styles.clearBtnText}>Limpiar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.applyBtn} onPress={onClose} activeOpacity={0.85}>
                        <Text style={styles.applyBtnText}>Aplicar filtros</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: radius.xl,
        borderTopRightRadius: radius.xl,
        paddingBottom: Platform.OS === 'ios' ? 40 : spacing.xl,
        maxHeight: '80%',
        borderTopWidth: 1,
        borderColor: colors.border,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: colors.border,
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    section: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.lg,
        paddingBottom: spacing.sm,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    optionCard: {
        width: '47%',
        backgroundColor: colors.surfaceElevated,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1.5,
        borderColor: colors.border,
        alignItems: 'center',
    },
    optionCardActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '22',
    },
    optionCardTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.textPrimary,
    },
    optionCardTitleActive: {
        color: colors.primary,
    },
    optionCardSub: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginTop: 2,
        textAlign: 'center',
    },
    optionCardSubActive: {
        color: colors.primaryLight,
    },
    optionsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    rowOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1.5,
        borderColor: colors.border,
    },
    rowOptionActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '22',
    },
    rowOptionText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    rowOptionTextActive: {
        color: colors.primary,
        fontWeight: fontWeight.bold,
    },
    optionEmoji: {
        fontSize: 14,
    },
    gpsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backgroundColor: colors.warning + '22',
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.full,
    },
    gpsBadgeText: {
        fontSize: fontSize.xs,
        color: colors.warning,
    },
    footer: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    clearBtn: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    clearBtnText: {
        color: colors.textSecondary,
        fontWeight: fontWeight.semibold,
        fontSize: fontSize.md,
    },
    applyBtn: {
        flex: 2,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    applyBtnText: {
        color: colors.black,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
    },
});

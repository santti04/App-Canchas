import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Cancha, UbicacionUsuario } from '../types';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';
import { calcularDistanciaKm, formatDistancia } from '../services/locationService';
import { formatPrecio } from '../services/canchaService';

interface Props {
    cancha: Cancha;
    onPress: () => void;
    ubicacionUsuario?: UbicacionUsuario | null;
}

const TAMANO_COLORS: Record<string, string> = {
    F5: colors.tagF5,
    F7: colors.tagF7,
    F9: colors.tagF9,
    F11: colors.tagF11,
};

export default function CanchaCard({ cancha, onPress, ubicacionUsuario }: Props) {
    const distancia =
        ubicacionUsuario
            ? calcularDistanciaKm(
                { lat: ubicacionUsuario.lat, lng: ubicacionUsuario.lng },
                cancha.coordenadas
            )
            : null;

    return (
        <TouchableOpacity style={[styles.container, shadow.md]} onPress={onPress} activeOpacity={0.85}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image 
                    source={{ uri: cancha.imagen || 'https://via.placeholder.com/400x200?text=Cancha' }} 
                    style={styles.image} 
                    resizeMode="cover"
                />
                <View style={[styles.tamanoBadge, { backgroundColor: TAMANO_COLORS[cancha.tamano] }]}>
                    <Text style={styles.tamanoBadgeText}>{cancha.tamano}</Text>
                </View>
                {cancha.techo && (
                    <View style={styles.techoBadge}>
                        <Ionicons name="home" size={12} color={colors.white} />
                    </View>
                )}
            </View>

            <View style={styles.content}>
                {/* Header row */}
                <View style={styles.headerRow}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.nombre} numberOfLines={1}>{cancha.nombre}</Text>
                        <Text style={styles.direccion} numberOfLines={1}>
                            <Ionicons name="location-outline" size={11} color={colors.textSecondary} /> {cancha.direccion}
                        </Text>
                    </View>
                    <View style={styles.ratingBadge}>
                        <Ionicons name="star" size={12} color="#FFD700" />
                        <Text style={styles.ratingText}>{cancha.rating.toFixed(1)}</Text>
                    </View>
                </View>

                {/* Footer row */}
                <View style={styles.footerRow}>
                    <Text style={styles.precio}>{formatPrecio(cancha)}</Text>
                    <View style={styles.footerRight}>
                        {distancia !== null && (
                            <View style={styles.distanciaContainer}>
                                <Ionicons name="navigate-outline" size={12} color={colors.primary} />
                                <Text style={styles.distanciaText}>{formatDistancia(distancia)}</Text>
                            </View>
                        )}
                        <View style={styles.services}>
                            {cancha.vestuarios && (
                                <Ionicons name="shirt-outline" size={15} color={colors.textSecondary} style={styles.serviceIcon} />
                            )}
                            {cancha.bar && (
                                <Ionicons name="beer-outline" size={15} color={colors.textSecondary} style={styles.serviceIcon} />
                            )}
                            {cancha.estacionamiento && (
                                <Ionicons name="car-outline" size={15} color={colors.textSecondary} style={styles.serviceIcon} />
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    imageContainer: {
        width: '100%',
        height: 140,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    tamanoBadge: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        paddingHorizontal: spacing.sm,
        paddingVertical: 2,
        borderRadius: radius.sm,
    },
    tamanoBadgeText: {
        color: colors.white,
        fontSize: 10,
        fontWeight: fontWeight.bold,
    },
    techoBadge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        padding: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    titleContainer: {
        flex: 1,
        marginRight: spacing.sm,
    },
    nombre: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    direccion: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD70022',
        paddingHorizontal: spacing.sm,
        paddingVertical: 3,
        borderRadius: radius.full,
        gap: 3,
    },
    ratingText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: '#FFD700',
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    precio: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.primary,
        flex: 1,
    },
    footerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    distanciaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
    },
    distanciaText: {
        fontSize: fontSize.xs,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    services: {
        flexDirection: 'row',
        gap: 4,
    },
    serviceIcon: {
        marginHorizontal: 1,
    },
});

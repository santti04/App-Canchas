import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Alert,
    Platform,
    SafeAreaView,
    Image,
} from 'react-native';
import ExpoMapView, { Marker, PROVIDER_DEFAULT } from '../components/ExpoMapView';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { CANCHAS } from '../data/canchas';
import { getCanchaById, formatPrecio } from '../services/canchaService';
import ServiceTag from '../components/ServiceTag';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'CanchaDetail'>;
    route: RouteProp<RootStackParamList, 'CanchaDetail'>;
};

const TAMANO_COLORS: Record<string, string> = {
    F5: colors.tagF5,
    F7: colors.tagF7,
    F9: colors.tagF9,
    F11: colors.tagF11,
};

export default function CanchaDetailScreen({ navigation, route }: Props) {
    const { canchaId } = route.params;
    const cancha = getCanchaById(CANCHAS, canchaId);

    if (!cancha) {
        return (
            <SafeAreaView style={styles.safe}>
                <View style={styles.notFound}>
                    <Ionicons name="alert-circle-outline" size={64} color={colors.error} />
                    <Text style={styles.notFoundText}>Cancha no encontrada</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.backLink}>← Volver</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    const handleWhatsApp = async () => {
        const number = cancha.contacto.whatsapp?.replace(/\D/g, '') ?? '';
        const url = `https://wa.me/${number}?text=Hola%2C%20me%20interesa%20alquilar%20la%20cancha%20${encodeURIComponent(cancha.nombre)}`;
        const supported = await Linking.canOpenURL(url);
        if (supported) {
            Linking.openURL(url);
        } else {
            Alert.alert('WhatsApp no disponible', 'No se pudo abrir WhatsApp en este dispositivo.');
        }
    };

    const handleTelefono = () => {
        const tel = cancha.contacto.telefono;
        if (tel) {
            Linking.openURL(`tel:${tel}`);
        }
    };

    const handleInstagram = () => {
        const ig = cancha.contacto.instagram?.replace('@', '');
        if (ig) {
            Linking.openURL(`https://instagram.com/${ig}`);
        }
    };

    const openGoogleMaps = () => {
        const { lat, lng } = cancha.coordenadas;
        const label = encodeURIComponent(cancha.nombre);
        const url = Platform.OS === 'ios'
            ? `maps:${lat},${lng}?q=${label}`
            : `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
        Linking.openURL(url).catch(() => {
            Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
        });
    };

    return (
        <SafeAreaView style={styles.safe}>
            {/* Custom back header */}
            <View style={styles.navBar}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.navTitle} numberOfLines={1}>{cancha.nombre}</Text>
                <View style={{ width: 38 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ─── Hero / Image Banner ──────────────────────────────────────── */}
                <View style={[styles.heroBanner, { backgroundColor: TAMANO_COLORS[cancha.tamano] }]}>
                    <Image 
                        source={{ uri: cancha.imagen || 'https://via.placeholder.com/600x400?text=Cancha' }} 
                        style={styles.heroImage}
                        resizeMode="cover"
                    />
                    <View style={styles.heroOverlay} />
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTamano}>{cancha.tamano}</Text>
                        <Text style={styles.heroNombre}>{cancha.nombre}</Text>
                        <View style={styles.heroRating}>
                            <Ionicons name="star" size={16} color="#FFD700" />
                            <Text style={styles.heroRatingText}>
                                {cancha.rating.toFixed(1)} ({cancha.totalReviews} reseñas)
                            </Text>
                        </View>
                    </View>
                </View>

                {/* ─── Main Info ───────────────────────────────────────────────── */}
                <View style={styles.content}>

                    {/* Description */}
                    <Text style={styles.descripcion}>{cancha.descripcion}</Text>

                    {/* Address */}
                    <TouchableOpacity style={styles.addressRow} onPress={openGoogleMaps}>
                        <Ionicons name="location" size={18} color={colors.primary} />
                        <Text style={styles.addressText}>{cancha.direccion}</Text>
                        <Ionicons name="open-outline" size={14} color={colors.textSecondary} />
                    </TouchableOpacity>

                    {/* Price */}
                    <View style={[styles.priceCard, shadow.sm]}>
                        <View>
                            <Text style={styles.priceLabel}>Precio estimado</Text>
                            <Text style={styles.priceValue}>{formatPrecio(cancha)}</Text>
                            <Text style={styles.priceNote}>* Precio referencial. Confirmar con el complejo.</Text>
                        </View>
                        <Ionicons name="cash-outline" size={32} color={colors.primary} />
                    </View>

                    {/* ─── Key Features ─────────────────────────────────────────── */}
                    <Text style={styles.sectionTitle}>Características</Text>
                    <View style={styles.featuresGrid}>
                        <FeatureItem
                            icon="football-outline"
                            label="Tamaño"
                            value={`${cancha.tamano} (${getTamanoLabel(cancha.tamano)})`}
                            color={TAMANO_COLORS[cancha.tamano]}
                        />
                        <FeatureItem
                            icon="leaf-outline"
                            label="Césped"
                            value={cancha.cesped === 'sintetico' ? 'Sintético' : 'Natural'}
                            color={cancha.cesped === 'sintetico' ? colors.tagSintetico : colors.tagNatural}
                        />
                        <FeatureItem
                            icon={cancha.techo ? 'home-outline' : 'sunny-outline'}
                            label="Cubierta"
                            value={cancha.techo ? 'Techada' : 'Aire libre'}
                            color={cancha.techo ? colors.info : colors.warning}
                        />
                        <FeatureItem
                            icon="shirt-outline"
                            label="Vestuarios"
                            value={cancha.vestuarios ? 'Disponibles' : 'No tiene'}
                            color={cancha.vestuarios ? colors.primary : colors.textMuted}
                        />
                        <FeatureItem
                            icon="car-outline"
                            label="Estacionamiento"
                            value={cancha.estacionamiento ? 'Disponible' : 'No tiene'}
                            color={cancha.estacionamiento ? colors.primary : colors.textMuted}
                        />
                        <FeatureItem
                            icon="bulb-outline"
                            label="Iluminación"
                            value={cancha.iluminacion ? 'Sí (noche)' : 'Sin iluminación'}
                            color={cancha.iluminacion ? colors.warning : colors.textMuted}
                        />
                    </View>

                    {/* ─── Additional Services ──────────────────────────────────── */}
                    {(cancha.bar || cancha.serviciosExtra.length > 0) && (
                        <>
                            <Text style={styles.sectionTitle}>Servicios adicionales</Text>
                            <View style={styles.tagsWrap}>
                                {cancha.bar && (
                                    <ServiceTag label="Bar / Cantina" iconName="beer-outline" color={colors.warning} />
                                )}
                                {cancha.serviciosExtra.map((s, i) => (
                                    <ServiceTag key={i} label={s} iconName="checkmark-circle-outline" color={colors.primary} />
                                ))}
                            </View>
                        </>
                    )}

                    {/* ─── Map ─────────────────────────────────────────────────── */}
                    <Text style={styles.sectionTitle}>Ubicación</Text>
                    <TouchableOpacity onPress={openGoogleMaps} activeOpacity={0.9}>
                        <ExpoMapView
                            style={styles.map}
                            provider={PROVIDER_DEFAULT}
                            initialRegion={{
                                latitude: cancha.coordenadas.lat,
                                longitude: cancha.coordenadas.lng,
                                latitudeDelta: 0.008,
                                longitudeDelta: 0.008,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                            pitchEnabled={false}
                            rotateEnabled={false}
                        >
                            <Marker
                                coordinate={{
                                    latitude: cancha.coordenadas.lat,
                                    longitude: cancha.coordenadas.lng,
                                }}
                                title={cancha.nombre}
                                description={cancha.direccion}
                            />
                        </ExpoMapView>
                        <View style={styles.mapOverlayBtn}>
                            <Ionicons name="map-outline" size={14} color={colors.white} />
                            <Text style={styles.mapOverlayText}>Ver en Google Maps</Text>
                        </View>
                    </TouchableOpacity>

                    {/* ─── Contact Buttons ──────────────────────────────────────── */}
                    <Text style={styles.sectionTitle}>Contactar</Text>
                    <Text style={styles.contactDesc}>
                        Contactá directamente al complejo para consultar disponibilidad y reservar tu turno.
                    </Text>

                    <View style={styles.contactButtons}>
                        {cancha.contacto.whatsapp && (
                            <TouchableOpacity
                                style={[styles.contactBtn, styles.whatsappBtn]}
                                onPress={handleWhatsApp}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="logo-whatsapp" size={22} color={colors.white} />
                                <Text style={styles.contactBtnText}>WhatsApp</Text>
                            </TouchableOpacity>
                        )}

                        {cancha.contacto.telefono && (
                            <TouchableOpacity
                                style={[styles.contactBtn, styles.telefonoBtn]}
                                onPress={handleTelefono}
                                activeOpacity={0.85}
                            >
                                <Ionicons name="call-outline" size={22} color={colors.white} />
                                <Text style={styles.contactBtnText}>Llamar</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {cancha.contacto.instagram && (
                        <TouchableOpacity
                            style={[styles.contactBtn, styles.igBtn, { marginTop: spacing.sm }]}
                            onPress={handleInstagram}
                            activeOpacity={0.85}
                        >
                            <Ionicons name="logo-instagram" size={20} color={colors.white} />
                            <Text style={styles.contactBtnText}>{cancha.contacto.instagram}</Text>
                        </TouchableOpacity>
                    )}

                    <View style={{ height: spacing.xxl }} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ─── Helper Components ────────────────────────────────────────────────────────

function FeatureItem({
    icon,
    label,
    value,
    color,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <View style={[featureStyles.card, shadow.sm]}>
            <View style={[featureStyles.iconBg, { backgroundColor: color + '22' }]}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text style={featureStyles.label}>{label}</Text>
            <Text style={[featureStyles.value, { color }]}>{value}</Text>
        </View>
    );
}

const featureStyles = StyleSheet.create({
    card: {
        width: '47%',
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
        gap: spacing.xs,
    },
    iconBg: {
        width: 40,
        height: 40,
        borderRadius: radius.full,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    value: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        textAlign: 'center',
    },
});

function getTamanoLabel(tamano: string): string {
    const map: Record<string, string> = {
        F5: 'Fútbol 5',
        F7: 'Fútbol 7',
        F9: 'Fútbol 9',
        F11: 'Fútbol 11',
    };
    return map[tamano] ?? tamano;
}

// ─── Main Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: {
        width: 38,
        height: 38,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: radius.md,
        backgroundColor: colors.surfaceElevated,
    },
    navTitle: {
        flex: 1,
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginHorizontal: spacing.sm,
    },
    scroll: {
        flex: 1,
    },
    heroBanner: {
        height: 240,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    heroImage: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
    },
    heroContent: {
        padding: spacing.lg,
    },
    heroTamano: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: 'rgba(255,255,255,0.8)',
        letterSpacing: 2,
        textTransform: 'uppercase',
    },
    heroNombre: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
        marginVertical: 4,
    },
    heroRating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    heroRatingText: {
        fontSize: fontSize.sm,
        color: 'rgba(255,255,255,0.85)',
    },
    content: {
        padding: spacing.md,
    },
    descripcion: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        lineHeight: 22,
        marginBottom: spacing.md,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.surfaceElevated,
        padding: spacing.md,
        borderRadius: radius.lg,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    addressText: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.textPrimary,
    },
    priceCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.primary + '22',
        borderWidth: 1,
        borderColor: colors.primary + '66',
        borderRadius: radius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },
    priceLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    priceValue: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.extrabold,
        color: colors.primary,
    },
    priceNote: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: 4,
        fontStyle: 'italic',
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        marginTop: spacing.sm,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    tagsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: spacing.lg,
    },
    map: {
        height: 200,
        borderRadius: radius.lg,
        overflow: 'hidden',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    mapOverlayBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        position: 'absolute',
        bottom: spacing.lg + spacing.sm,
        right: spacing.md,
        backgroundColor: 'rgba(0,0,0,0.65)',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.full,
    },
    mapOverlayText: {
        fontSize: fontSize.xs,
        color: colors.white,
    },
    contactDesc: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: spacing.md,
    },
    contactButtons: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    contactBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
        paddingVertical: spacing.md,
        borderRadius: radius.full,
    },
    whatsappBtn: {
        backgroundColor: '#25D366',
    },
    telefonoBtn: {
        backgroundColor: colors.info,
    },
    igBtn: {
        backgroundColor: '#E1306C',
        paddingVertical: spacing.sm + 2,
    },
    contactBtnText: {
        color: colors.white,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
    },
    notFound: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.md,
    },
    notFoundText: {
        fontSize: fontSize.xl,
        color: colors.textPrimary,
        fontWeight: fontWeight.bold,
    },
    backLink: {
        color: colors.primary,
        fontSize: fontSize.md,
    },
});

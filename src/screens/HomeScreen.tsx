import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    TouchableOpacity,
    StatusBar,
    SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { useCanchas } from '../context/CanchaContext';
import { CIUDAD_DEFAULT } from '../data/constants';
import { getCanchasDestacadas } from '../services/canchaService';
import CanchaCard from '../components/CanchaCard';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

const getStats = (totalCanchas: number) => [
    { label: 'Canchas', value: `${totalCanchas}`, icon: 'football-outline' },
    { label: 'F5/F7/F9/F11', value: '4 tipos', icon: 'resize-outline' },
    { label: 'Césped', value: 'Natural y Sint.', icon: 'leaf-outline' },
];

export default function HomeScreen({ navigation }: Props) {
    const { ubicacion } = useLocation();
    const { canchas, loading } = useCanchas();
    const { profile } = useAuth();
    const destacadas = getCanchasDestacadas(canchas, 5);

    const goToSearch = () => navigation.navigate('MainTabs', { screen: 'Buscar' } as any);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

                {/* ─── Header ──────────────────────────────────────────────────── */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.headerSubtitle}>
                                {profile ? `¡Hola, ${profile.nombre}!` : 'Bienvenido a'}
                            </Text>
                            <Text style={styles.headerTitle}>⚽ AppCanchas</Text>
                        </View>
                        <View style={styles.headerActions}>
                            <View style={styles.ciudadBadge}>
                                <Ionicons name="location" size={12} color={colors.primary} />
                                <Text style={styles.ciudadText}>{CIUDAD_DEFAULT.nombre}</Text>
                            </View>
                            <TouchableOpacity onPress={() => supabase.auth.signOut()} style={{ marginLeft: spacing.sm }}>
                                <Ionicons name="log-out-outline" size={24} color={colors.textSecondary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Hero card */}
                    <View style={[styles.heroCard, shadow.lg]}>
                        <View style={styles.heroGradient} />
                        <Text style={styles.heroTitle}>Encontrá tu cancha</Text>
                        <Text style={styles.heroSubtitle}>
                            Buscá y contactá canchas de fútbol en {CIUDAD_DEFAULT.nombre}
                        </Text>
                        <TouchableOpacity style={styles.heroCTA} onPress={goToSearch} activeOpacity={0.85}>
                            <Ionicons name="search" size={16} color={colors.black} />
                            <Text style={styles.heroCTAText}>Buscar canchas</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ─── Stats ───────────────────────────────────────────────────── */}
                <View style={styles.statsRow}>
                    {getStats(canchas.length).map((s, i) => (
                        <View key={i} style={[styles.statCard, shadow.sm]}>
                            <Ionicons name={s.icon as any} size={22} color={colors.primary} />
                            <Text style={styles.statValue}>{s.value}</Text>
                            <Text style={styles.statLabel}>{s.label}</Text>
                        </View>
                    ))}
                </View>

                {/* ─── Destacadas ──────────────────────────────────────────────── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>⭐ Mejor valoradas</Text>
                    <TouchableOpacity onPress={goToSearch}>
                        <Text style={styles.seeAll}>Ver todas</Text>
                    </TouchableOpacity>
                </View>

                {destacadas.map((cancha) => (
                    <CanchaCard
                        key={cancha.id}
                        cancha={cancha}
                        ubicacionUsuario={ubicacion}
                        onPress={() => navigation.navigate('CanchaDetail', { canchaId: cancha.id })}
                    />
                ))}

                {/* ─── Coming soon banner ───────────────────────────────────────── */}
                <View style={[styles.comingSoon, shadow.sm]}>
                    <Ionicons name="calendar-outline" size={28} color={colors.accent} />
                    <View style={styles.comingSoonText}>
                        <Text style={styles.comingSoonTitle}>Reservas online próximamente</Text>
                        <Text style={styles.comingSoonDesc}>
                            Pronto podrás reservar turnos directamente desde la app y ver disponibilidad en tiempo real.
                        </Text>
                    </View>
                </View>

                <View style={{ height: spacing.xl }} />
            </ScrollView>

            {/* Solo los administradores pueden ver el botón de agregar canchas */}
            {profile?.is_admin === true && (
                <TouchableOpacity 
                    style={styles.fabBtn} 
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('AddCancha')}
                >
                    <Ionicons name="add" size={28} color={colors.black} />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scroll: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    headerSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
    },
    headerTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.extrabold,
        color: colors.textPrimary,
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ciudadBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: colors.primary + '22',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.full,
        borderWidth: 1,
        borderColor: colors.primary + '66',
    },
    ciudadText: {
        fontSize: fontSize.xs,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    heroCard: {
        backgroundColor: colors.accentLight,
        borderRadius: radius.xl,
        padding: spacing.lg,
        overflow: 'hidden',
    },
    heroGradient: {
        position: 'absolute',
        top: -30,
        right: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.primary + '44',
    },
    heroTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.white,
        marginBottom: spacing.xs,
    },
    heroSubtitle: {
        fontSize: fontSize.sm,
        color: colors.white + 'CC',
        marginBottom: spacing.md,
    },
    heroCTA: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm + 2,
        borderRadius: radius.full,
        alignSelf: 'flex-start',
    },
    heroCTAText: {
        color: colors.black,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
        gap: spacing.sm,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.card,
        borderRadius: radius.lg,
        padding: spacing.md,
        alignItems: 'center',
        gap: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statValue: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    seeAll: {
        fontSize: fontSize.sm,
        color: colors.primary,
        fontWeight: fontWeight.semibold,
    },
    comingSoon: {
        flexDirection: 'row',
        gap: spacing.md,
        alignItems: 'flex-start',
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        backgroundColor: colors.accent + '33',
        borderWidth: 1,
        borderColor: colors.accent + '66',
        borderRadius: radius.lg,
        padding: spacing.md,
    },
    comingSoonText: {
        flex: 1,
    },
    comingSoonTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.bold,
        color: colors.primaryLight,
        marginBottom: 4,
    },
    comingSoonDesc: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },
    fabBtn: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadow.lg,
    },
});

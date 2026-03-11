import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList, Review } from '../types';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';
import RatingStars from '../components/RatingStars';
import { getCanchaById } from '../services/canchaService';
import { useCanchas } from '../context/CanchaContext';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'ReviewsList'>;
    route: RouteProp<RootStackParamList, 'ReviewsList'>;
};

const FILTER_OPTIONS = [
    { label: 'Todas', value: null },
    { label: '5 Estrellas', value: 5 },
    { label: '4 Estrellas', value: 4 },
    { label: '3 Estrellas', value: 3 },
    { label: '2 Estrellas', value: 2 },
    { label: '1 Estrella', value: 1 },
];

export default function ReviewsListScreen({ navigation, route }: Props) {
    const { canchaId } = route.params;
    const { canchas } = useCanchas();
    const cancha = getCanchaById(canchas, canchaId);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState<number | null>(null);

    useEffect(() => {
        fetchReviews();
    }, [activeFilter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            let query = supabase
                .from('reviews')
                .select('*, profiles(nombre, apellido)')
                .eq('cancha_id', canchaId)
                .order('created_at', { ascending: false });

            if (activeFilter !== null) {
                // Considerar una reseña de 'N' estrellas si el rating está entre N y N+0.9
                // Ejemplo: 4 estrellas filtraría de 4.0 a 4.9.
                // Sin embargo, permitimos medias estrellas, asi que 4 a 4.9 aplica.
                query = query.gte('rating', activeFilter).lt('rating', activeFilter + 1);
            }

            const { data, error } = await query;

            if (error) {
                throw error;
            }
            if (data) {
                setReviews(data as any);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderHeader = () => (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <View style={styles.headerTitleWrap}>
                <Text style={styles.headerTitle}>Reseñas</Text>
                {cancha && <Text style={styles.headerSubtitle}>{cancha.nombre}</Text>}
            </View>
            <View style={{ width: 40 }} />
        </View>
    );

    const renderFilters = () => (
        <View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={FILTER_OPTIONS}
                keyExtractor={(item) => item.label}
                contentContainerStyle={styles.filtersContainer}
                renderItem={({ item }) => {
                    const isActive = activeFilter === item.value;
                    return (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                isActive && styles.filterChipActive
                            ]}
                            onPress={() => setActiveFilter(item.value)}
                            activeOpacity={0.8}
                        >
                            {item.value !== null && (
                                <Ionicons 
                                    name="star" 
                                    size={14} 
                                    color={isActive ? colors.primary : colors.textSecondary} 
                                    style={{ marginRight: 4 }}
                                />
                            )}
                            <Text style={[
                                styles.filterText,
                                isActive && styles.filterTextActive
                            ]}>
                                {item.label}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );

    const renderReviewItem = ({ item }: { item: Review }) => {
        const dateStr = new Date(item.created_at).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return (
            <View style={[styles.reviewCard, shadow.sm]}>
                <View style={styles.reviewHeader}>
                    <View style={styles.userInfo}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarText}>
                                {item.profiles?.nombre?.charAt(0) || 'U'}
                            </Text>
                        </View>
                        <View>
                            <Text style={styles.userName}>
                                {item.profiles?.nombre} {item.profiles?.apellido}
                            </Text>
                            <Text style={styles.reviewDate}>{dateStr}</Text>
                        </View>
                    </View>
                    <RatingStars rating={item.rating} size={14} />
                </View>
                
                {item.comentario ? (
                    <Text style={styles.reviewText}>{item.comentario}</Text>
                ) : null}
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safe}>
            {renderHeader()}
            {renderFilters()}
            
            {loading ? (
                <View style={styles.centerBox}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : reviews.length === 0 ? (
                <View style={styles.centerBox}>
                    <Ionicons name="chatbubbles-outline" size={48} color={colors.border} />
                    <Text style={styles.emptyText}>
                        No se encontraron reseñas con este filtro.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={reviews}
                    keyExtractor={item => item.id}
                    renderItem={renderReviewItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backBtn: {
        padding: spacing.xs,
    },
    headerTitleWrap: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    headerSubtitle: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
    },
    filtersContainer: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.full,
        backgroundColor: colors.surfaceElevated,
    },
    filterChipActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '11',
    },
    filterText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        fontWeight: fontWeight.semibold,
    },
    filterTextActive: {
        color: colors.primary,
    },
    centerBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: spacing.sm,
    },
    emptyText: {
        color: colors.textSecondary,
        fontSize: fontSize.md,
    },
    listContent: {
        padding: spacing.md,
        gap: spacing.md,
    },
    reviewCard: {
        backgroundColor: colors.card,
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        flex: 1,
    },
    avatarPlaceholder: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.primary + '33',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: colors.primary,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
    },
    userName: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },
    reviewDate: {
        fontSize: fontSize.xs,
        color: colors.textMuted,
        marginTop: 2,
    },
    reviewText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    }
});

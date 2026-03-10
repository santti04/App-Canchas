import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { CANCHAS } from '../data/canchas';
import { useLocation } from '../hooks/useLocation';
import { useCanchaFilters } from '../hooks/useCanchaFilters';
import CanchaCard from '../components/CanchaCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import FilterModal from './FilterModal';
import { colors, spacing, radius, fontSize, fontWeight } from '../theme';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
};

function SortChip({ 
    label, 
    active, 
    direction, 
    onPress 
}: { 
    label: string, 
    active: boolean, 
    direction: 'asc' | 'desc', 
    onPress: () => void 
}) {
    return (
        <TouchableOpacity 
            style={[styles.sortChip, active && styles.sortChipActive]} 
            onPress={onPress}
            activeOpacity={0.8}
        >
            <Text style={[styles.sortChipText, active && styles.sortChipActiveText]}>{label}</Text>
            {active && (
                <Ionicons 
                    name={direction === 'asc' ? "chevron-up" : "chevron-down"} 
                    size={14} 
                    color={colors.primary} 
                    style={{ marginLeft: 4 }}
                />
            )}
        </TouchableOpacity>
    );
}

export default function SearchScreen({ navigation }: Props) {
    const [modalVisible, setModalVisible] = useState(false);
    const { ubicacion, permisoConcedido, solicitarPermiso } = useLocation();
    const {
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
    } = useCanchaFilters(CANCHAS, ubicacion);

    const handleDistanciaSelect = async (dist: any) => {
        if (dist !== null && !permisoConcedido) {
            await solicitarPermiso();
        }
        setDistancia(dist);
    };

    const handleToggleSort = (por: 'precio' | 'rating' | 'distancia') => {
        if (filtros.ordenPor === por) {
            // Toggle direction if same column
            setOrden(por, filtros.ordenDireccion === 'asc' ? 'desc' : 'asc');
        } else {
            // New column, default to asc (or desc for rating)
            const defaultDir = por === 'rating' ? 'desc' : 'asc';
            setOrden(por, defaultDir);
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="light-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Buscar Canchas</Text>
                <Text style={styles.subtitle}>
                    {canchasFiltradas.length} resultado{canchasFiltradas.length !== 1 ? 's' : ''}
                </Text>
            </View>

            {/* Search bar */}
            <View style={styles.searchContainer}>
                <SearchBar
                    value={filtros.searchQuery}
                    onChangeText={setSearchQuery}
                    onClear={() => setSearchQuery('')}
                    placeholder="Buscar por nombre o dirección..."
                />
            </View>

            {/* Filter bar */}
            <FilterBar
                filtros={filtros}
                totalActivo={totalActivo}
                onOpenModal={() => setModalVisible(true)}
                onToggleTamano={toggleTamano}
                onToggleTecho={toggleTecho}
                onSetCesped={setCesped}
            />

            {/* Sorting Bar */}
            <View style={styles.sortWrapper}>
                <Text style={styles.sortLabel}>Ordenar:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortScroll}>
                    <SortChip 
                        label="Precio" 
                        active={filtros.ordenPor === 'precio'} 
                        direction={filtros.ordenDireccion}
                        onPress={() => handleToggleSort('precio')} 
                    />
                    <SortChip 
                        label="Rating" 
                        active={filtros.ordenPor === 'rating'} 
                        direction={filtros.ordenDireccion}
                        onPress={() => handleToggleSort('rating')} 
                    />
                    <SortChip 
                        label="Distancia" 
                        active={filtros.ordenPor === 'distancia'} 
                        direction={filtros.ordenDireccion}
                        onPress={() => handleToggleSort('distancia')} 
                    />
                </ScrollView>
            </View>

            {/* Location nudge if distance filter active without permission */}
            {filtros.distanciaMaxKm !== null && !ubicacion && (
                <TouchableOpacity
                    style={styles.locationNudge}
                    onPress={solicitarPermiso}
                    activeOpacity={0.85}
                >
                    <Ionicons name="navigate-circle-outline" size={18} color={colors.warning} />
                    <Text style={styles.locationNudgeText}>
                        Activá la ubicación para filtrar por distancia. Toca aquí.
                    </Text>
                </TouchableOpacity>
            )}

            {/* Results */}
            <FlatList
                data={canchasFiltradas}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <CanchaCard
                        cancha={item}
                        ubicacionUsuario={ubicacion}
                        onPress={() => navigation.navigate('CanchaDetail', { canchaId: item.id })}
                    />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Ionicons name="football-outline" size={64} color={colors.textMuted} />
                        <Text style={styles.emptyTitle}>Sin resultados</Text>
                        <Text style={styles.emptyDesc}>
                            No se encontraron canchas con los filtros actuales.
                        </Text>
                        <TouchableOpacity style={styles.emptyBtn} onPress={limpiarFiltros}>
                            <Text style={styles.emptyBtnText}>Limpiar filtros</Text>
                        </TouchableOpacity>
                    </View>
                }
            />

            {/* Filter Modal */}
            <FilterModal
                visible={modalVisible}
                filtros={filtros}
                ubicacionDisponible={!!ubicacion || permisoConcedido === null}
                onClose={() => setModalVisible(false)}
                onToggleTamano={toggleTamano}
                onToggleTecho={toggleTecho}
                onSetCesped={setCesped}
                onSetDistancia={handleDistanciaSelect}
                onLimpiar={limpiarFiltros}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.extrabold,
        color: colors.textPrimary,
    },
    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: 2,
    },
    searchContainer: {
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
    },
    sortWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    sortLabel: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.bold,
        color: colors.textMuted,
        marginRight: spacing.sm,
        textTransform: 'uppercase',
    },
    sortScroll: {
        gap: spacing.xs,
    },
    sortChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surfaceElevated,
    },
    sortChipActive: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '11',
    },
    sortChipText: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        fontWeight: fontWeight.medium,
    },
    sortChipActiveText: {
        color: colors.primary,
        fontWeight: fontWeight.bold,
    },
    locationNudge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.warning + '22',
        borderLeftWidth: 3,
        borderLeftColor: colors.warning,
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radius.md,
    },
    locationNudgeText: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.warning,
    },
    listContent: {
        paddingTop: spacing.md,
        paddingBottom: spacing.xl,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: spacing.xl,
        gap: spacing.sm,
    },
    emptyTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginTop: spacing.sm,
    },
    emptyDesc: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    emptyBtn: {
        marginTop: spacing.md,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.sm + 2,
        borderRadius: radius.full,
    },
    emptyBtnText: {
        color: colors.black,
        fontWeight: fontWeight.bold,
        fontSize: fontSize.md,
    },
});

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSize, fontWeight } from '../theme';

export default function FavoritosScreen() {
    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.header}>
                <Text style={styles.title}>Favoritos</Text>
            </View>
            <View style={styles.center}>
                <Ionicons name="heart-outline" size={72} color={colors.textMuted} />
                <Text style={styles.emptyTitle}>Próximamente</Text>
                <Text style={styles.emptyDesc}>
                    Podrás guardar tus canchas favoritas para acceder rápidamente a ellas.
                </Text>
            </View>
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
        fontSize: 22,
        fontWeight: fontWeight.extrabold,
        color: colors.textPrimary,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl * 2,
        gap: spacing.md,
    },
    emptyTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textSecondary,
        marginTop: spacing.sm,
    },
    emptyDesc: {
        fontSize: fontSize.md,
        color: colors.textMuted,
        textAlign: 'center',
        lineHeight: 22,
    },
});

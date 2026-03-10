import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius, fontSize, fontWeight } from '../theme';

interface Props {
    label: string;
    iconName?: keyof typeof Ionicons.glyphMap;
    color?: string;
}

export default function ServiceTag({ label, iconName, color = colors.textSecondary }: Props) {
    return (
        <View style={[styles.container, { borderColor: color + '55' }]}>
            {iconName && (
                <Ionicons name={iconName} size={13} color={color} style={styles.icon} />
            )}
            <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: radius.full,
        paddingHorizontal: spacing.sm,
        paddingVertical: 4,
        backgroundColor: colors.surfaceElevated,
        marginRight: spacing.xs,
        marginBottom: spacing.xs,
    },
    icon: {
        marginRight: 4,
    },
    label: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
    },
});

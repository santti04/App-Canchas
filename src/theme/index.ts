// ─── App Theme ───────────────────────────────────────────────────────────────

export const colors = {
    // Primary brand
    primary: '#00C851',
    primaryDark: '#007E33',
    primaryLight: '#69F0AE',

    // Secondary accent
    accent: '#1B5E20',
    accentLight: '#2E7D32',

    // Backgrounds
    background: '#0D1117',
    surface: '#161B22',
    surfaceElevated: '#21262D',
    card: '#1C2128',

    // Text
    textPrimary: '#E6EDF3',
    textSecondary: '#8B949E',
    textMuted: '#484F58',

    // Status
    success: '#00C851',
    warning: '#FFA500',
    error: '#FF4444',
    info: '#2196F3',

    // Misc
    border: '#30363D',
    divider: '#21262D',
    overlay: 'rgba(0, 0, 0, 0.6)',
    white: '#FFFFFF',
    black: '#000000',

    // Cancha type tags
    tagF5: '#1565C0',
    tagF7: '#6A1B9A',
    tagF9: '#E65100',
    tagF11: '#B71C1C',
    tagNatural: '#2E7D32',
    tagSintetico: '#0277BD',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const radius = {
    sm: 6,
    md: 12,
    lg: 18,
    xl: 24,
    full: 999,
};

export const fontSize = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 18,
    xl: 22,
    xxl: 28,
    xxxl: 34,
};

export const fontWeight = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
};

export const shadow = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
        elevation: 5,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
        elevation: 10,
    },
};

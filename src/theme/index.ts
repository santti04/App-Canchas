// ─── App Theme: Fútbol Pro ───────────────────────────────────────────────────────

export const colors = {
    // Fondos
    background: '#0A1F0A',      // Verde muy oscuro
    navigation: '#0D1A0D',       // Fondo de navegación
    surface: '#132414',         // Cards, headers
    surfaceElevated: '#1A3320', // Elementos destacados
    card: '#132414',            // Cards (same as surface)

    // Primario (campo de fútbol)
    primary: '#2ECC71',         // Verde brillante
    primaryDark: '#27AE60',     // Presionado
    primaryLight: '#58D68D',    // Claro

    // Acentos
    accent: '#1A3320',
    accentLight: '#2D5A3D',     // Acento claro
    gold: '#F1C40F',            // Estrellas rating
    orange: '#E67E22',          // CTAs secundarios

    // Texto
    textPrimary: '#FFFFFF',
    textSecondary: '#A8D5A2',
    textMuted: '#4A7A54',

    // Estados
    success: '#2ECC71',
    warning: '#F39C12',
    error: '#E74C3C',
    info: '#3498DB',

    // Bordes
    border: '#2D5A3D',
    divider: '#2D5A3D',

    // Misc
    overlay: 'rgba(0, 0, 0, 0.6)',
    white: '#FFFFFF',
    black: '#000000',

    // Tags de tipo de cancha
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
    lg: 16,
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 10,
    },
};
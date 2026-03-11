import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { colors, spacing, radius, fontSize, fontWeight } from '../theme';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Habilita el manejo de los redirects de WebBrowser en Expo
WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register only fields
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');

  const signInWithEmail = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa email y contraseña');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) Alert.alert('Error al iniciar sesión', error.message);
    setLoading(false);
  };

  const signUpWithEmail = async () => {
    if (!email || !password || !nombre || !apellido || !telefono) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }
    setLoading(true);
    // El trigger en SQL moverá estos meta_data a la tabla "profiles"
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nombre,
          apellido,
          telefono,
        },
      },
    });

    if (error) {
      Alert.alert('Error al registrarse', error.message);
    } else if (data.session == null) {
      Alert.alert('¡Casi listo!', 'Por favor verifica tu bandeja de entrada para confirmar tu correo.');
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    const redirectUrl = Linking.createURL('/');
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      Alert.alert('Error de OAuth', error.message);
    } else if (data?.url) {
      try {
        const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
        if (result.type === 'success') {
          // Supabase detecta esto automáticamente cuando se abre la app
        }
      } catch (e: any) {
        Alert.alert('Error', e.message);
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>⚽ AppCanchas</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Iniciá sesión para continuar' : 'Creá tu cuenta para reservar canchas'}
          </Text>
        </View>

        <View style={styles.form}>
          {!isLogin && (
            <>
              <View style={styles.inputGroup}>
                <Ionicons name="person-outline" size={20} color={colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  placeholderTextColor={colors.textMuted}
                  value={nombre}
                  onChangeText={setNombre}
                />
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="people-outline" size={20} color={colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Apellido"
                  placeholderTextColor={colors.textMuted}
                  value={apellido}
                  onChangeText={setApellido}
                />
              </View>

              <View style={styles.inputGroup}>
                <Ionicons name="call-outline" size={20} color={colors.textSecondary} style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Teléfono"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="phone-pad"
                  value={telefono}
                  onChangeText={setTelefono}
                />
              </View>
            </>
          )}

          <View style={styles.inputGroup}>
            <Ionicons name="mail-outline" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.textSecondary} style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity 
            style={styles.mainBtn} 
            onPress={isLogin ? signInWithEmail : signUpWithEmail}
            disabled={loading}
          >
            {loading ? <ActivityIndicator color={colors.black} /> : <Text style={styles.mainBtnText}>{isLogin ? 'Ingresar' : 'Registrarme'}</Text>}
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>o</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity style={styles.googleBtn} onPress={signInWithGoogle} disabled={loading}>
            <Ionicons name="logo-google" size={20} color={colors.textPrimary} />
            <Text style={styles.googleBtnText}>Continuar con Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleBtn} onPress={() => setIsLogin(!isLogin)} disabled={loading}>
            <Text style={styles.toggleText}>
              {isLogin ? '¿No tenés cuenta? Regístrate' : '¿Ya tenés cuenta? Ingresá'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: 32,
    fontWeight: fontWeight.extrabold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  icon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  mainBtn: {
    backgroundColor: colors.primary,
    height: 52,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  mainBtnText: {
    color: colors.black,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.sm,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    height: 52,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: '#4285F4',
  },
  googleBtnText: {
    color: colors.textPrimary,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.md,
  },
  toggleBtn: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  toggleText: {
    color: colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});

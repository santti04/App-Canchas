import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  Keyboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TamañoCancha, TipoCesped } from '../types';
import { colors, spacing, radius, fontSize, fontWeight, shadow } from '../theme';
import { supabase } from '../lib/supabase';
import { useCanchas } from '../context/CanchaContext';
import { getCanchaById } from '../services/canchaService';
import { RouteProp } from '@react-navigation/native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AddCancha'>;
  route: RouteProp<RootStackParamList, 'AddCancha'>;
};

type AddressResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export default function AddCanchaScreen({ navigation, route }: Props) {
  const { canchas, refreshCanchas } = useCanchas();
  const [loading, setLoading] = useState(false);
  
  const editCanchaId = route.params?.editCanchaId;
  const isEditing = !!editCanchaId;

  // Form state
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [direccion, setDireccion] = useState('');
  
  // Location autocomplete states
  const [coordenadas, setCoordenadas] = useState<{lat: number, lng: number} | null>(null);
  const [addressResults, setAddressResults] = useState<AddressResult[]>([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);

  const [tamano, setTamano] = useState<TamañoCancha>('F5');
  const [cesped, setCesped] = useState<TipoCesped>('sintetico');
  const [techo, setTecho] = useState(false);
  const [iluminacion, setIluminacion] = useState(true);
  const [vestuarios, setVestuarios] = useState(true);
  const [estacionamiento, setEstacionamiento] = useState(false);
  const [bar, setBar] = useState(false);
  const [precioMin, setPrecioMin] = useState('');
  const [imagenUri, setImagenUri] = useState('');

  // Contact States
  const [whatsapp, setWhatsapp] = useState('');
  const [telefono, setTelefono] = useState('');
  const [instagram, setInstagram] = useState('');

  // Prefill details if editing
  useEffect(() => {
    if (isEditing && editCanchaId) {
      const canchaToEdit = getCanchaById(canchas, editCanchaId);
      if (canchaToEdit) {
        setNombre(canchaToEdit.nombre);
        setDescripcion(canchaToEdit.descripcion);
        setDireccion(canchaToEdit.direccion);
        setCoordenadas(canchaToEdit.coordenadas);
        setTamano(canchaToEdit.tamano);
        setCesped(canchaToEdit.cesped);
        setTecho(canchaToEdit.techo);
        setIluminacion(canchaToEdit.iluminacion);
        setVestuarios(canchaToEdit.vestuarios);
        setEstacionamiento(canchaToEdit.estacionamiento);
        setBar(canchaToEdit.bar);
        setPrecioMin(canchaToEdit.precioEstimado.min.toString());
        setImagenUri(canchaToEdit.imagen);
        setWhatsapp(canchaToEdit.contacto.whatsapp || '');
        setTelefono(canchaToEdit.contacto.telefono || '');
        setInstagram(canchaToEdit.contacto.instagram || '');
      }
    }
  }, [editCanchaId, canchas, isEditing]);

  // Debounce para la busqueda de direcciones con Nominatim (OpenStreetMap)
  useEffect(() => {
    if (!direccion || direccion.length < 5 || coordenadas) {
      setAddressResults([]);
      setShowAddressDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingAddress(true);
      try {
        // Asegurarse de que esté buscando explícitamente dentro de Rosario y la provincia para mejores resultados.
        const stringBusqueda = direccion.toLowerCase().includes('rosario') 
            ? direccion 
            : `${direccion}, Rosario, Santa Fe`;
            
        const query = encodeURIComponent(stringBusqueda);
        
        // Usamos Nominatim con un Viewbox estricto que limita la busqueda a la zona metropolitana de Rosario
        const viewbox = '-60.85,-32.85,-60.55,-33.06'; // minLon, minLat, maxLon, maxLat (aprox para Rosario)
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}&viewbox=${viewbox}&bounded=1&limit=5`;
        
        const res = await fetch(url, {
          headers: { 
              'User-Agent': 'AppCanchas/1.0',
              'Accept-Language': 'es'
          }
        });
        
        const data: AddressResult[] = await res.json();
        
        // Filtramos para asegurar que sean de Rosario
        const filteredData = data.filter(d => d.display_name.toLowerCase().includes('rosario'));
        
        setAddressResults(filteredData);
        setShowAddressDropdown(filteredData.length > 0);
      } catch (err) {
        console.error('Error fetching address:', err);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 1200); // 1.2 segundos para no hacer tantas llamadas a la API mientras se escribe rápdio

    return () => clearTimeout(timer);
  }, [direccion]);

  const selectAddress = (addr: AddressResult) => {
    // Tomamos la porción más corta y amigable de la dirección (suele estar despues de la 1er o 2da coma)
    const partes = addr.display_name.split(',');
    const nombreCorto = partes[0] + (partes[1] && !partes[1].toLowerCase().includes('rosario') ? ',' + partes[1] : '') + ', Rosario';
    
    setDireccion(nombreCorto.trim());
    setCoordenadas({ lat: parseFloat(addr.lat), lng: parseFloat(addr.lon) });
    setShowAddressDropdown(false);
    Keyboard.dismiss();
  };

  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.7,
      });

      if (!result.canceled) {
        setImagenUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error eligiendo imagen:", error);
      Alert.alert("Error", "No se pudo obtener la imagen del dispositivo.");
    }
  };

  const handleSave = async () => {
    if (!nombre || !direccion) {
      Alert.alert('Error', 'El nombre y la dirección son obligatorios.');
      return;
    }

    if (!coordenadas) {
      Alert.alert(
        'Ubicación no confirmada',
        'Por favor, selecciona una de las direcciones sugeridas de Rosario para obtener las coordenadas exactas de la cancha.'
      );
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = isEditing ? getCanchaById(canchas, editCanchaId!)?.imagen || '' : 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80';

      if (imagenUri && !imagenUri.startsWith('http')) {
        // Es un archivo local seleccionado desde el ImagePicker
        const fileExt = imagenUri.split('.').pop() || 'jpg';
        const fileName = `${Date.now()}_${uuidv4().substring(0, 6)}.${fileExt}`;
        
        try {
          const formData = new FormData();
          formData.append('file', {
            uri: imagenUri,
            name: fileName,
            type: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`
          } as any);

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('canchas_images')
            .upload(fileName, formData, {
              cacheControl: '3600',
              upsert: false,
            });

          if (uploadError) throw uploadError;

          const { data: publicData } = supabase.storage
            .from('canchas_images')
            .getPublicUrl(fileName);

          finalImageUrl = publicData.publicUrl;
        } catch (storageErr) {
          console.error('Storage Upload Error:', storageErr);
          Alert.alert('Aviso', 'No se pudo subir la imagen, se guardará sin foto nueva.');
        }
      } else if (imagenUri.startsWith('http')) {
        finalImageUrl = imagenUri;
      }

      const dataToSave = {
        nombre,
        descripcion,
        direccion,
        ciudad: 'rosario',
        coordenadas_lat: coordenadas.lat,
        coordenadas_lng: coordenadas.lng,
        tamano,
        cesped,
        techo,
        iluminacion,
        precio_min: parseInt(precioMin) || 20000,
        precio_max: (parseInt(precioMin) || 20000) + 10000,
        imagen: finalImageUrl,
        vestuarios,
        estacionamiento,
        bar,
        contacto_whatsapp: whatsapp || null,
        contacto_telefono: telefono || null,
        contacto_instagram: instagram || null,
      };

      if (isEditing) {
        const { error } = await supabase.from('canchas').update(dataToSave).eq('id', editCanchaId);
        if (error) throw error;
      } else {
        const newId = `crc-${uuidv4().substring(0, 6)}`;
        const { error } = await supabase.from('canchas').insert({
          id: newId,
          ...dataToSave,
          rating: 5.0,
          total_reviews: 0,
          servicios_extra: [],
        });
        if (error) throw error;
      }

      Alert.alert('¡Éxito!', isEditing ? 'Cancha actualizada correctamente.' : 'Cancha registrada correctamente.', [
        {
          text: 'OK',
          onPress: async () => {
            await refreshCanchas();
            navigation.goBack();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert('Error al guardar', err.message || 'Hubo un problema de conexión.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Editar Cancha' : 'Nueva Cancha'}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        
        {/* INFO BÁSICA */}
        <Text style={styles.sectionHeader}>Información Básica</Text>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nombre de la Cancha*</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: Complejo Los Cedros"
            placeholderTextColor={colors.textMuted}
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={[styles.formGroup, { zIndex: 10 }]}>
          <Text style={styles.label}>Dirección en Rosario*</Text>
          <View style={styles.addressInputWrapper}>
            <TextInput
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              placeholder="Ej: Bulevar Oroño 1234"
              placeholderTextColor={colors.textMuted}
              value={direccion}
              onChangeText={(text) => {
                setDireccion(text);
                if (coordenadas) setCoordenadas(null); // Resetea las coords si el usuario sigue tipeando
              }}
            />
            {isSearchingAddress && <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: spacing.sm }}/>}
            {coordenadas && <Ionicons name="checkmark-circle" size={20} color={colors.primary} style={{ marginRight: spacing.sm }} />}
          </View>

          {showAddressDropdown && (
            <View style={[styles.dropdown, shadow.lg]}>
              {addressResults.map((addr, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.dropdownItem}
                  onPress={() => selectAddress(addr)}
                >
                  <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.dropdownText} numberOfLines={2}>{addr.display_name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {!coordenadas && direccion.length > 5 && !showAddressDropdown && !isSearchingAddress && (
            <Text style={styles.helperText}>Buscando ubicación...</Text>
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Descripción</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Breve descripción de las instalaciones"
            placeholderTextColor={colors.textMuted}
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={4}
          />
        </View>

        {/* CONTACTO */}
        <Text style={styles.sectionHeader}>Contacto (Opcional)</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>WhatsApp</Text>
          <View style={styles.inputGroupWrapper}>
            <Ionicons name="logo-whatsapp" size={18} color="#25D366" style={styles.innerIcon} />
            <TextInput
              style={styles.iconInput}
              placeholder="+54 9 341 000 0000"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={whatsapp}
              onChangeText={setWhatsapp}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Teléfono Fijo / Celular</Text>
          <View style={styles.inputGroupWrapper}>
            <Ionicons name="call" size={18} color={colors.info} style={styles.innerIcon} />
            <TextInput
              style={styles.iconInput}
              placeholder="0341 455 5555"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Instagram</Text>
          <View style={styles.inputGroupWrapper}>
            <Ionicons name="logo-instagram" size={18} color="#E1306C" style={styles.innerIcon} />
            <TextInput
              style={styles.iconInput}
              placeholder="@complex"
              placeholderTextColor={colors.textMuted}
              value={instagram}
              onChangeText={setInstagram}
              autoCapitalize="none"
            />
          </View>
        </View>

        {/* CARACTERÍSTICAS */}
        <Text style={styles.sectionHeader}>Características</Text>
        
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Tamaño</Text>
            <View style={styles.buttonGroup}>
              {(['F5', 'F7', 'F9', 'F11'] as TamañoCancha[]).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.optionBtn, tamano === t && styles.optionBtnActive]}
                  onPress={() => setTamano(t)}
                >
                  <Text style={[styles.optionText, tamano === t && styles.optionTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Césped</Text>
            <View style={styles.buttonGroup}>
              {(['sintetico', 'natural'] as TipoCesped[]).map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.optionBtn, { flex: 1 }, cesped === c && styles.optionBtnActive]}
                  onPress={() => setCesped(c)}
                >
                  <Text style={[styles.optionText, cesped === c && styles.optionTextActive, { textTransform: 'capitalize' }]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Precio estimado por hora (ARS)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 35000"
            placeholderTextColor={colors.textMuted}
            value={precioMin}
            onChangeText={setPrecioMin}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Foto de la Cancha (Opcional)</Text>
          <TouchableOpacity style={styles.imagePickerBtn} onPress={selectImage}>
            <Ionicons name="image-outline" size={24} color={colors.primary} />
            <Text style={styles.imagePickerBtnText}>Seleccionar del dispositivo</Text>
          </TouchableOpacity>
          
          {imagenUri ? (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: imagenUri }} style={styles.imagePreview} resizeMode="cover" />
              <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImagenUri('')}>
                <Ionicons name="close-circle" size={24} color={colors.error} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>¿Es techada?</Text>
          <Switch
            value={techo}
            onValueChange={setTecho}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>¿Tiene iluminación?</Text>
          <Switch
            value={iluminacion}
            onValueChange={setIluminacion}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>¿Tiene vestuarios?</Text>
          <Switch
            value={vestuarios}
            onValueChange={setVestuarios}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>¿Tiene estacionamiento?</Text>
          <Switch
            value={estacionamiento}
            onValueChange={setEstacionamiento}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={styles.switchRow}>
          <Text style={styles.label}>¿Tiene bar/cantina?</Text>
          <Switch
            value={bar}
            onValueChange={setBar}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>

        <View style={{ height: spacing.lg }}/>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSave} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.black} />
          ) : (
            <Text style={styles.submitBtnText}>{isEditing ? 'Actualizar Cancha' : 'Guardar Cancha'}</Text>
          )}
        </TouchableOpacity>
        
        <View style={{height: 60}} />
      </ScrollView>
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
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
  },
  sectionHeader: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  formGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.bold,
  },
  input: {
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  addressInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  dropdown: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    maxHeight: 200,
    zIndex: 100,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  dropdownText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSize.sm,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  inputGroupWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
  },
  innerIcon: {
    marginRight: spacing.xs,
  },
  iconInput: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    color: colors.textPrimary,
    fontSize: fontSize.md,
  },
  row: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  col: {
    flex: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  optionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated,
  },
  optionBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '22',
  },
  optionText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  optionTextActive: {
    color: colors.primary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  submitBtnText: {
    color: colors.black,
    fontWeight: fontWeight.bold,
    fontSize: fontSize.md,
  },
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    marginTop: spacing.xs,
  },
  imagePickerBtnText: {
    color: colors.primary,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.md,
  },
  imagePreviewContainer: {
    marginTop: spacing.md,
    borderRadius: radius.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imagePreview: {
    width: '100%',
    height: 180,
  },
  removeImageBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    padding: 2,
  },
});

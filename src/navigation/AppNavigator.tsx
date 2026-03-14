import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RootStackParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import CanchaDetailScreen from '../screens/CanchaDetailScreen';
import AuthScreen from '../screens/AuthScreen';
import AddCanchaScreen from '../screens/AddCanchaScreen';
import ReviewsListScreen from '../screens/ReviewsListScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { useAuth } from '../context/AuthContext';
import { colors, fontSize, fontWeight } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { View, ActivityIndicator } from 'react-native';

// ─── Bottom Tab Navigator ───────────────────────────────────────────────────────────

const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

                    if (route.name === 'HomeTab') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'BuscarTab') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'FavoritosTab') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'PerfilTab') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.navigation,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: fontSize.xs,
                    fontWeight: fontWeight.medium,
                },
                headerShown: false,
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                options={{ tabBarLabel: 'Inicio' }}
            />
            <Tab.Screen
                name="BuscarTab"
                component={SearchScreen}
                options={{ tabBarLabel: 'Buscar' }}
            />
            <Tab.Screen
                name="FavoritosTab"
                component={FavoritosScreen}
                options={{ tabBarLabel: 'Favoritos' }}
            />
            <Tab.Screen
                name="PerfilTab"
                component={PerfilScreen}
                options={{ tabBarLabel: 'Perfil' }}
            />
        </Tab.Navigator>
    );
}

// ─── Root Stack Navigator ─────────────────────────────────────────────────────

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    const { session, loading } = useAuth();

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {session ? (
                    <>
                        <Stack.Screen name="MainTabs" component={MainTabs} />
                        <Stack.Screen
                            name="CanchaDetail"
                            component={CanchaDetailScreen}
                            options={{
                                animation: 'slide_from_right',
                            }}
                        />
                        <Stack.Screen
                            name="AddCancha"
                            component={AddCanchaScreen}
                            options={{
                                animation: 'fade_from_bottom',
                            }}
                        />
                        <Stack.Screen
                            name="ReviewsList"
                            component={ReviewsListScreen}
                            options={{
                                animation: 'slide_from_right',
                            }}
                        />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthScreen} options={{ animation: 'fade' }} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
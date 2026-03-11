import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, MainTabsParamList } from '../types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritosScreen from '../screens/FavoritosScreen';
import CanchaDetailScreen from '../screens/CanchaDetailScreen';
import AuthScreen from '../screens/AuthScreen';
import AddCanchaScreen from '../screens/AddCanchaScreen';
import ReviewsListScreen from '../screens/ReviewsListScreen';
import { useAuth } from '../context/AuthContext';
import { colors, fontSize, fontWeight } from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView, View, ActivityIndicator } from 'react-native';

// ─── Tab Navigator ────────────────────────────────────────────────────────────

const Tab = createMaterialTopTabNavigator<MainTabsParamList>();

function MainTabs() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
            <Tab.Navigator
                screenOptions={({ route }: { route: any }) => ({
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.textSecondary,
                    tabBarStyle: {
                        backgroundColor: '#050709',
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                        elevation: 0,
                        shadowOpacity: 0,
                    },
                    tabBarIndicatorStyle: {
                        backgroundColor: colors.primary,
                        height: 3,
                    },
                    tabBarLabelStyle: {
                        fontSize: fontSize.xs,
                        fontWeight: fontWeight.bold,
                        textTransform: 'uppercase',
                    },
                    tabBarShowIcon: true,
                    tabBarIcon: ({ focused, color }: { focused: boolean; color: string }) => {
                        let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

                        if (route.name === 'Home') {
                            iconName = focused ? 'home' : 'home-outline';
                        } else if (route.name === 'Buscar') {
                            iconName = focused ? 'search' : 'search-outline';
                        } else if (route.name === 'Favoritos') {
                            iconName = focused ? 'heart' : 'heart-outline';
                        }

                        return <Ionicons name={iconName} size={18} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Inicio' }} />
                <Tab.Screen name="Buscar" component={SearchScreen} options={{ tabBarLabel: 'Buscar' }} />
                <Tab.Screen name="Favoritos" component={FavoritosScreen} options={{ tabBarLabel: 'Favoritos' }} />
            </Tab.Navigator>
        </SafeAreaView>
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

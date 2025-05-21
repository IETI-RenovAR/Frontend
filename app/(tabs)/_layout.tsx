import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { NavigationParams } from '@/types/navigation';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { Tabs, useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { name, role } = useLocalSearchParams<NavigationParams>();
  console.log('Current role:', role); // Para debugging

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
      }}>
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
        initialParams={{ name, role }}
      />
      <Tabs.Screen
        name="SearchScreen"
        options={{
          title: 'Creations',
          tabBarIcon: ({ color }) => (
            <Octicons name="search" size={24} color={color} />
          ),
        }}
        initialParams={{ name, role }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
        }}
        initialParams={{ name, role }}
      />
      <Tabs.Screen
        name="AdminScreen"
        options={{
          title: 'Admin',
          tabBarIcon: ({ color }) => (
            <AntDesign name="tool" size={24} color={color} />
          ),
          href: role === 'ADMIN' ? undefined : null,
        }}
        initialParams={{ name, role }}
      />
      <Tabs.Screen
        name="CartScreen"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => (
            <Feather name="shopping-cart" size={24} color={color} />
          ),
          href: role !== 'ADMIN' ? undefined : null,
        }}
        initialParams={{ name, role }}
      />
    </Tabs>
  );
}

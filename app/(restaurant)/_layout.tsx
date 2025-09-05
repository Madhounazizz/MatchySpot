import React from "react";
import { Tabs } from "expo-router";
import { Calendar, Menu, Settings, BarChart3, Users } from "lucide-react-native";
import { colors } from "@/constants/colors";

export default function RestaurantTabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '500',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        headerShown: false,
        lazy: true,
      }}
    >
      <Tabs.Screen
        name="reservations"
        options={{
          title: "Reservations",
          tabBarIcon: ({ color, focused }) => (
            <Calendar 
              size={focused ? 24 : 22} 
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Menu Mgmt",
          tabBarIcon: ({ color, focused }) => (
            <Menu 
              size={focused ? 24 : 22} 
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          tabBarIcon: ({ color, focused }) => (
            <BarChart3 
              size={focused ? 24 : 22} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="staff"
        options={{
          title: "Staff",
          tabBarIcon: ({ color, focused }) => (
            <Users 
              size={focused ? 24 : 22} 
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ color, focused }) => (
            <Settings 
              size={focused ? 24 : 22} 
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
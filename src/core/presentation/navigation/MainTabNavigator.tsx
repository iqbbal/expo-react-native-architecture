import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";
import PostsScreen from "@/src/post/presentation/screens/PostsScreen";
import FavoritePostsScreen from "@/src/post/presentation/screens/FavoritePostsScreen";
import { TabParamList } from "./types";

const Tab = createBottomTabNavigator<TabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E5E5EA",
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="News"
        component={PostsScreen}
        options={{
          tabBarLabel: "News",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ fontSize: 24 }}>📰</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritePostsScreen}
        options={{
          tabBarLabel: "Favorites",
          tabBarIcon: ({ color }: { color: string }) => (
            <Text style={{ fontSize: 24 }}>⭐</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}


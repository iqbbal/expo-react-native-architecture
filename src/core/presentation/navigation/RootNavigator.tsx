import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types";
import PostScreen from "src/post/presentation/screens/PostScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import LoginScreen from "src/auth/presentation/screens/LoginScreen";
import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const initialRouteName: keyof RootStackParamList = "Login";

  return (
    <Stack.Navigator initialRouteName={initialRouteName}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />

      <Stack.Screen name="MainTabs" component={MainTabNavigator} options={{ headerShown: false }} />

      <Stack.Screen name="Post" component={PostScreen} />

      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  );
}

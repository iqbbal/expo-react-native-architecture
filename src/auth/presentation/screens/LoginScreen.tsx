import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { observer } from "mobx-react";
import { useNavigation } from "@react-navigation/native";
import { useLoginStore } from "../stores/LoginStore/useLoginStore";
import { withProviders } from "src/core/presentation/utils/withProviders";
import { LoginStoreProvider } from "../stores/LoginStore/LoginStoreProvider";
import { RootScreenNavigationProp } from "src/core/presentation/navigation/types";

const LoginScreen = observer(() => {
  const navigation = useNavigation<RootScreenNavigationProp<"Login">>();
  const loginStore = useLoginStore();
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");

  const handleLogin = async () => {
    try {
      await loginStore.login({ username, password });
      // Navigate to MainTabs screen after successful login
      navigation.replace("MainTabs");
    } catch (error) {
      // Error sudah di-handle di store, Alert akan muncul otomatis
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {loginStore.error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{loginStore.error}</Text>
        </View>
      )}

      {loginStore.isAuthenticated ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>✓ Logged in as:</Text>
          <Text style={styles.userName}>{loginStore.user?.name}</Text>
          <Text style={styles.userEmail}>{loginStore.user?.email}</Text>
          
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={loginStore.logout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loginStore.isLoading}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loginStore.isLoading}
          />

          <TouchableOpacity
            style={[styles.button, loginStore.isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loginStore.isLoading}
          >
            <Text style={styles.buttonText}>
              {loginStore.isLoading ? "Loading..." : "Login"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Hint: emilys / emilyspass (atau cek https://dummyjson.com/users)
          </Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#333",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  hint: {
    marginTop: 16,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  errorText: {
    color: "#c62828",
    fontSize: 14,
  },
  successContainer: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successText: {
    fontSize: 18,
    color: "#4CAF50",
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
  },
});

export default withProviders(LoginStoreProvider)(LoginScreen);

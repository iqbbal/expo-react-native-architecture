import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { observer } from "mobx-react";
import { useLoginStore } from "@/src/auth/presentation/stores/LoginStore/useLoginStore";

const CustomAppBar = observer(() => {
  const loginStore = useLoginStore();
  const { user } = loginStore;

  useEffect(() => {
    console.log("🔍 CustomAppBar - User data:", user);
  }, [user]);

  const handleNotificationPress = () => {
    console.log("Notification pressed");
    // TODO: Navigate to notification screen
  };

  // Show placeholder while user is loading
  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {/* Placeholder Profile Picture */}
          <View style={[styles.profileImage, styles.placeholderImage]}>
            <ActivityIndicator size="small" color="#999" />
          </View>
          
          {/* Placeholder User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.firstName}>Loading...</Text>
            <Text style={styles.gender}>Please wait</Text>
          </View>
        </View>

        {/* Notification Icon */}
        <TouchableOpacity 
          onPress={handleNotificationPress}
          style={styles.notificationButton}
        >
          <Text style={styles.notificationIcon}>🔔</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Left Section: Profile Picture + User Info */}
      <View style={styles.leftSection}>
        {/* Profile Picture */}
        <Image
          source={{ 
            uri: user.image || "https://via.placeholder.com/50" 
          }}
          style={styles.profileImage}
        />
        
        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.firstName}>
            {user.firstName || user.name || "User"}
          </Text>
          <Text style={styles.gender}>
            {user.gender || ""}
          </Text>
        </View>
      </View>

      {/* Right Section: Notification Icon */}
      <TouchableOpacity 
        onPress={handleNotificationPress}
        style={styles.notificationButton}
      >
        <Text style={styles.notificationIcon}>🔔</Text>
      </TouchableOpacity>
    </View>
  );
});

export default CustomAppBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e0e0e0",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 12,
    justifyContent: "center",
  },
  firstName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  gender: {
    fontSize: 14,
    color: "#666",
    textTransform: "capitalize",
  },
  notificationButton: {
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
});

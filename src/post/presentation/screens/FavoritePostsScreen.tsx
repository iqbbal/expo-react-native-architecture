import { useEffect } from "react";
import { Text, View, SafeAreaView, StyleSheet } from "react-native";

import { useI18n } from "src/core/presentation/hooks/useI18n";
import { observer } from "mobx-react";
import { useGetPostsStore } from "../stores/GetPostsStore/useGetPostsStore";
import { withProviders } from "src/core/presentation/utils/withProviders";
import { GetPostsStoreProvider } from "../stores/GetPostsStore/GetPostsStoreProvider";
import { LoginStoreProvider } from "@/src/auth/presentation/stores/LoginStore/LoginStoreProvider";

const FavoritePostsScreen = observer(() => {
  const i18n = useI18n();
  const getPostsStore = useGetPostsStore();
  const { isLoading, results } = getPostsStore;

  useEffect(() => {
    // TODO: Load favorite posts from local storage
    getPostsStore.getPosts();
  }, [getPostsStore]);

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⭐</Text>
            <Text style={styles.emptyText}>No Favorite Posts Yet</Text>
            <Text style={styles.emptySubtext}>
              Tap the star icon on posts to add them to favorites
            </Text>
          </View>
      </View>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default withProviders(GetPostsStoreProvider, LoginStoreProvider)(FavoritePostsScreen);

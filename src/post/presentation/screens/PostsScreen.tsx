import { useEffect } from "react";
import { FlatList, Text, View, SafeAreaView, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";

import { useI18n } from "src/core/presentation/hooks/useI18n";
import PostItem from "../components/PostItem";
import { observer } from "mobx-react";
import { useGetPostsStore } from "../stores/GetPostsStore/useGetPostsStore";
import { withProviders } from "src/core/presentation/utils/withProviders";
import { GetPostsStoreProvider } from "../stores/GetPostsStore/GetPostsStoreProvider";
import { LoginStoreProvider } from "@/src/auth/presentation/stores/LoginStore/LoginStoreProvider";
import CustomAppBar from "@/src/core/presentation/components/CustomAppBar";

const PostsScreen = observer(() => {
  const i18n = useI18n();
  const getPostsStore = useGetPostsStore();
  const { isLoading, isLoadingMore, isRefreshing, results, hasMore } = getPostsStore;

  useEffect(() => {
    console.log("📱 PostsScreen mounted - calling getPosts()");
    getPostsStore.getPosts()
      .then(() => {
        console.log("✅ getPosts() completed successfully");
      })
      .catch((error) => {
        console.error("❌ getPosts() error:", error);
      });
  }, []); // Empty dependency array - only run once on mount


  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
      getPostsStore.loadMore();
    }
  };

  const handleRefresh = () => {
    console.log("🔄 User pulled to refresh");
    getPostsStore.refresh();
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.footerText}>Loading more posts...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Custom App Bar */}
      <CustomAppBar />
      
      {/* Content */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>{i18n.t("post.screens.Posts.loading")}</Text>
          </View>
        ) : (
          <FlatList
            data={results}
            renderItem={({ item }) => <PostItem post={item} />}
            keyExtractor={(item) => item.id.toString()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={renderFooter}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={["#007AFF"]}
                tintColor="#007AFF"
                title="Pull to refresh"
                titleColor="#666"
              />
            }
          />
        )}
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
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  footerText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});

export default withProviders(GetPostsStoreProvider, LoginStoreProvider)(PostsScreen);

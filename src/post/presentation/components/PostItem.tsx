import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import PostEntity from "src/post/domain/entities/PostEntity";

interface PostItemProps {
  post: PostEntity;
}

const PostItem = ({ post }: PostItemProps) => {
  const { title, body, reactions } = post;
  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate("Post", { id: post.id });
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        {body && <Text style={styles.body}>{body}</Text>}
        {reactions && (
          <View style={styles.reactionsContainer}>
            <Text style={styles.reactions}>
              👍 {reactions.likes}  👎 {reactions.dislikes}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PostItem;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  reactionsContainer: {
    marginTop: 8,
  },
  reactions: {
    fontSize: 14,
    color: "#888",
  },
});

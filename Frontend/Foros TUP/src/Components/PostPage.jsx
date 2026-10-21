import { useParams } from "react-router-dom";
import Post from "../post/Post";

const PostPage = () => {
  const { postId } = useParams();

  return <Post postId={postId} />;
};

export default PostPage;
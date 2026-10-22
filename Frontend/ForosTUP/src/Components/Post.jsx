import { Alert, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useRequireAuth } from "../Services/Hooks/useRequireAuth.js";
import Redirecting from "./Redirecting";
import PostBody from "./PostBody";
import { usePost } from "../Services/Hooks/usePost.js";
import { createPermissions } from "../Services/UtilityServices/postPermissions.js";
import "./Post.css";

const Post = ({ postId }) => {
  const { token, user, isAdmin, isSysAdmin } = useAuth();
  const { requireAuth, redirecting } = useRequireAuth();
  const navigate = useNavigate();

  const post = usePost(postId, token);
  const permissions = createPermissions({ user, isAdmin, isSysAdmin });

  const handleDeleted = () => {
    const forumId = post.post?.Forum?.id || post.post?.forumId;
    navigate(forumId ? `/forum/${forumId}` : "/foros");
  };

  if (redirecting) return <Redirecting />;

  if (post.loading) {
    return (
      <main className="post-thread-page">
        <div className="post-thread-state">
          <Spinner animation="border" />
          <p>Cargando publicación...</p>
        </div>
      </main>
    );
  }

  if (post.error) {
    return (
      <main className="post-thread-page">
        <div className="post-thread-state">
          <Alert variant="danger" className="mb-0">{post.error}</Alert>
        </div>
      </main>
    );
  }

  if (!post.post) {
    return (
      <main className="post-thread-page">
        <div className="post-thread-state">
          <Alert variant="warning" className="mb-0">Publicación no encontrada.</Alert>
        </div>
      </main>
    );
  }

  return (
    <main className="post-thread-page">
      <section className="post-thread-container">
        <PostBody
          postState={post}
          permissions={permissions}
          requireAuth={requireAuth}
          navigate={navigate}
          onMakeAdminClick={() => {}}
          onDeleted={handleDeleted}
        />
      </section>
    </main>
  );
};

export default Post;

import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { createPost } from "../Services/postService.js";
import "./NewPost.css";

const NewPost = () => {
  const { forumId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    body: "",
  });

  const [errors, setErrors] = useState({
    body: "",
  });

  const [errorGeneral, setErrorGeneral] = useState("");
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {
      body: "",
    };

    if (!form.body.trim()) {
      newErrors.body = "El contenido de la publicación es obligatorio";
    } else if (form.body.trim().length < 10) {
      newErrors.body = "La publicación debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);

    return !newErrors.body;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm({
      ...form,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });

    setErrorGeneral("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorGeneral("");

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    if (!user?.id) {
      setErrorGeneral("No se pudo identificar al autor de la publicación.");
      return;
    }

    setLoading(true);

    try {
      const data = await createPost({
        body: form.body,
        forumId,
        userId: user.id,
      });
      toast.success("Publicación creada correctamente.", {
        className: "toast-success-custom",
        progressClassName: "toast-progress-custom",
    });

      navigate(`/post/${data.id}`);
    } catch (error) {
      setErrorGeneral(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="new-post-page">
      <Container>
        <Card className="new-post-card">
          <Card.Body>
            <div className="new-post-header">
              <div className="new-post-breadcrumb">
                <Link to="/foros">Foros</Link>
                <span>{">"}</span>
                <Link to={`/forum/${forumId}`}>Foro</Link>
                <span>{">"}</span>
                <span>Nueva publicación</span>
              </div>

              <span className="new-post-badge">Publicación</span>

              <h1>Crear nueva publicación</h1>

              <p>
                Escribí el contenido para iniciar una conversación dentro del
                foro.
              </p>
            </div>

            {errorGeneral && (
              <Alert variant="danger" className="new-post-alert">
                {errorGeneral}
              </Alert>
            )}

            <Form onSubmit={handleSubmit} noValidate>
              <Form.Group className="mb-4" controlId="body">
                <Form.Label className="new-post-label">Contenido</Form.Label>

                <Form.Control
                  className="new-post-textarea"
                  as="textarea"
                  rows={7}
                  name="body"
                  placeholder="Escribí el contenido de tu publicación..."
                  value={form.body}
                  onChange={handleChange}
                  isInvalid={!!errors.body}
                />

                <Form.Control.Feedback type="invalid" className="new-post-error">
                  {errors.body}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="new-post-actions">
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => navigate(`/forum/${forumId}`)}
                >
                  Cancelar
                </Button>

                <Button
                  variant="success"
                  type="submit"
                  disabled={loading}
                  className="new-post-submit"
                >
                  {loading ? "Publicando..." : "Crear publicación"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </main>
  );
};

export default NewPost;

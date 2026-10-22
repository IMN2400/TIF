import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  FormGroup,
  Row,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { getUser, updateUser } from "../Services/userService.js";
import "./UserEdit.css";

const UserEdit = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const dateOfBirthRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const originalProfile = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!user?.id) return;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const profile = await getUser(user.id);
        originalProfile.current = profile;
        setFormData({
          name: profile.name,
          dateOfBirth: profile.dateOfBirth,
          email: profile.email,
          password: "",
        });
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user?.id]);

  const validateForm = () => {
    const errors = {
      name: "",
      dateOfBirth: "",
      email: "",
      password: "",
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = "El nombre es obligatorio.";
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = "La fecha de nacimiento es obligatoria.";
    }
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es obligatorio.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Ingresá un correo electrónico válido.";
    }
    if (formData.password && formData.password.length < 6) {
      errors.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setFieldErrors(errors);

    if (errors.name) nameRef.current?.focus();
    else if (errors.dateOfBirth) dateOfBirthRef.current?.focus();
    else if (errors.email) emailRef.current?.focus();
    else if (errors.password) passwordRef.current?.focus();

    return !Object.values(errors).some(Boolean);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!user?.id) {
      setError("No se pudo identificar el usuario que se desea editar.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const original = originalProfile.current;
      const changes = {
        name: formData.name !== original?.name ? formData.name : undefined,
        dateOfBirth:
          formData.dateOfBirth !== original?.dateOfBirth
            ? formData.dateOfBirth
            : undefined,
        email: formData.email !== original?.email ? formData.email : undefined,
        password: formData.password || undefined,
      };
      await updateUser(user.id, changes);
      toast.success("Perfil actualizado correctamente.", {
        className: "toast-success-custom",
        progressClassName: "toast-progress-custom",
      });
      setTimeout(() => navigate(-1), 800);
    } catch (updateError) {
      setError(updateError.message || "Error conectando con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={5}>
          <Card className="p-4 shadow text-light user-edit-card">
            <Card.Body>
              <h2 className="text-center mb-4">Editar perfil</h2>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit} noValidate>
                <FormGroup className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    ref={nameRef}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.name}
                    required
                  />
                  <Form.Control.Feedback type="invalid" className="user-edit-error">
                    {fieldErrors.name}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="mb-3">
                  <Form.Label>Fecha de nacimiento</Form.Label>
                  <Form.Control
                    ref={dateOfBirthRef}
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.dateOfBirth}
                    required
                  />
                  <Form.Control.Feedback type="invalid" className="user-edit-error">
                    {fieldErrors.dateOfBirth}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="mb-3">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    ref={emailRef}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!fieldErrors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid" className="user-edit-error">
                    {fieldErrors.email}
                  </Form.Control.Feedback>
                </FormGroup>

                <FormGroup className="mb-4">
                  <Form.Label>Nueva contraseña</Form.Label>
                  <Form.Control
                    ref={passwordRef}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Dejar vacío para mantener la actual"
                    isInvalid={!!fieldErrors.password}
                  />
                  <Form.Control.Feedback type="invalid" className="user-edit-error">
                    {fieldErrors.password}
                  </Form.Control.Feedback>
                </FormGroup>

                <Row>
                  <Col md={6} className="mb-2 mb-md-0">
                    <Button variant="primary" type="submit" className="w-100" disabled={loading}>
                      {loading ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </Col>
                  <Col md={6}>
                    <Button
                      variant="secondary"
                      type="button"
                      className="w-100"
                      onClick={() => navigate("/")}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserEdit;

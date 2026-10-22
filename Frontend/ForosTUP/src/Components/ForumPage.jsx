import { useParams, Link, useNavigate } from "react-router-dom";
import { Form, Row, Col, Card, Spinner, Alert, Button } from "react-bootstrap";
import { useApiResource } from "../hooks/useApiResource.js";
import { getForum, updateForum } from "../Services/forumService.js";
import { getPostsByForum } from "../Services/postService.js";
import { useRequireAuth } from "../Services/Hooks/useRequireAuth.js";
import "./ForumPage.css";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { toast } from "react-toastify";
import Redirecting from "./Redirecting.jsx";

const ForumPage = () => {
  // obtiene el id del foro desde la url
  const { forumId } = useParams();


  const navigate = useNavigate();

  // activación de los campos de edición
  const {isAdmin, isSysAdmin} = useAuth()
  const [editForumName, setEditForumName] = useState(false);
  const [editForumDesc, setEditForumDesc] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDesc, setEditedDesc] = useState("");
  const [editNameError, setEditNameError] = useState("");
  const [editDescError, setEditDescError] = useState("");
  const [editLoading, setEditLoading] = useState(false)
  
  // verifica que el usuario este loggeado
  const { requireAuth, redirecting } = useRequireAuth();

  // trae los datos del foro desde el backend
  const {
    data: forum,
    loading: loadingForum,
    error: errorForum,
    refetch: fetchForums,
  } = useApiResource(getForum, forumId, null);

  // trae los posts del foro desde el backend
  const {
    data: posts,
    loading: loadingPosts,
    error: errorPosts,
  } = useApiResource(getPostsByForum, forumId, []);

  // asegura que sea un array
  const forumPosts = Array.isArray(posts) ? posts : [];
  // arma la lista de reglas, si no tiene reglas usa reglas por defecto
  const rules = [
    "Respeta a los demás usuarios",
    "No publicar spam",
    "No contenido ofensivo",
  ];

  // maneja el "crear publicacion", si esta loggeado lo lleva al form
  const handleNewPost = () => {
    requireAuth(() => navigate(`/forums/${forumId}/posts/new`));
  };

  // maneja el click sobre un post
  const handleGoToPost = (postId) => {
    navigate(`/post/${postId}`);
  };

  // un booleano que es True si el usuario puede editar el foro
  const canEditForum = isSysAdmin || isAdmin;
     // funciones que abren o cierran los editores.
    const toggleEditForumName = () => {
      setEditedName(forum?.name || "")
      setEditForumDesc(false);
      setEditForumName(!editForumName);}

    const toggleEditForumDesc = () => {
      setEditedDesc(forum?.desc || "");
      setEditForumName(false);
      setEditForumDesc(!editForumDesc);
    }

  // Envía únicamente los campos que acepta el DTO de foros de .NET.
  const handleUpdateForum = async () => {
    
    if (!canEditForum) {
      toast.error("No tenés permisos para editar este foro.");
      return;
    }

    setEditLoading(true)
    setEditNameError("")
    setEditDescError("")
   try {
     let newForum = {
      name: forum?.name,
      desc: forum?.desc
    }

    if (editedName !== "") newForum.name = editedName || "";
    if (editedDesc !== "") newForum.desc = editedDesc || ""
    await updateForum(forumId, newForum);
    setEditForumName(false)
    setEditForumDesc(false)
    setEditedName("");
    setEditLoading(false)
    fetchForums()
   } catch (error) {
    toast.error(error.message || error || "Hubo un error")
   } finally {
    setEditLoading(false);
   }

  }


  
  if (redirecting) {
    return <Redirecting />
  }

  if (loadingForum || loadingPosts) {
    return (
      <main className="forum-detail-page">
        <div className="forum-detail-loading">
          <Spinner animation="border" />
          <p>Cargando foro...</p>
        </div>
      </main>
    );
  }

  if (errorForum || errorPosts) {
    return (
      <main className="forum-detail-page">
        <Alert variant="danger">
          Error al cargar el foro: {errorForum || errorPosts}
        </Alert>
      </main>
    );
  }

  return (
    <main className="forum-detail-page">
      <section className="forum-detail-card">
        <div className="forum-detail-breadcrumb">
          <Link to="/foros">Foros</Link>
          <span>{">"}</span>
          <span>{forum?.name || "Foro"}</span>
        </div>

        <div className="forum-detail-header">
          <div className="forum-detail-header-content">
            {editForumName ?
                  <Form>
                    <h6>Editar el nombre del foro</h6>
                    <Form.Group>
                      <Form.Control
                        type="text"
                        value={editedName}
                        onChange={(event) => {
                          setEditedName(event.target.value);
                          setEditNameError("");
                        }}
                        isInvalid={!!editNameError}/>
                      </Form.Group>
                    <Button variant="secondary" disabled={editLoading} onClick={toggleEditForumName}>Cancelar</Button>&emsp;
                    <Button variant="success" disabled={editLoading} onClick={handleUpdateForum}>Guardar</Button>
                  </Form> : <h1>{forum?.name || "Foro"} &emsp;<Button
                    variant="outline-success"
                    size="sm"
                    className="edit-button"
                    hidden={!canEditForum || !!editForumName}
                    onClick={toggleEditForumName}
                    >Editar</Button></h1>
                    }            
            {editForumDesc ?
                  <Form>
                    <h6>Editar la descripción del foro</h6>
                    <Form.Group>
                      <Form.Control
                        as="textarea"
                        rows={4}
                        value={editedDesc}
                        onChange={(event) => {
                          setEditedDesc(event.target.value);
                          setEditDescError("");
                        }}
                        isInvalid={!!editDescError}/>
                      </Form.Group>
                    <Button variant="secondary" disabled={editLoading} onClick={toggleEditForumDesc}>Cancelar</Button>&emsp;
                    <Button variant="success" disabled={editLoading} onClick={handleUpdateForum}>Guardar</Button>
                  </Form> : <p> {forum?.desc || "Espacio general para debatir temas de la comunidad."} &emsp;<Button
                    variant="outline-success"
                    size="sm" className="edit-button"
                    hidden={!canEditForum || !!editForumDesc}
                    onClick={toggleEditForumDesc}
                    >Editar</Button> </p>}


            <div className="forum-detail-meta">
              <span>Fundador: {forum?.Person?.name || "Admin"}</span>
              <span>{forumPosts.length} Publicaciones</span>
            </div>
          </div>

          <Button
            variant="success"
            className="forum-detail-new-post"
            onClick={handleNewPost}
          >
            + Nueva publicación
          </Button>
        </div>

        <Row className="forum-detail-body">
          <Col lg={8}>
            <section className="forum-detail-posts">
              <h2>Publicaciones recientes</h2>

              {forumPosts.length === 0 ? (
                <Card className="forum-detail-empty-card">
                  <Card.Body>
                    <Card.Title>No hay publicaciones todavía</Card.Title>
                    <Card.Text>
                      Este foro todavía no tiene publicaciones cargadas.
                    </Card.Text>
                  </Card.Body>
                </Card>
              ) : (
                <div className="forum-detail-post-list">
                  {forumPosts.map((post) => (
                    <article
                      key={post.id}
                      className="forum-detail-post-card"
                      onClick={() => handleGoToPost(post.id)}
                    >
                      <div className="forum-detail-post-avatar">
                        {post.Person?.name?.charAt(0).toUpperCase() || "U"}
                      </div>

                      <div className="forum-detail-post-content">
                        <h3>{post.title || "Publicación"}</h3>

                        <p>{post.body}</p>

                        <div className="forum-detail-post-footer">
                          <span>
                            {post.Person?.name || "Usuario"} · Hace unas horas
                          </span>

                          <div className="forum-detail-post-stats">
                            <span>Sin estadísticas disponibles</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </Col>

          <Col lg={4}>
            <aside className="forum-detail-sidebar">
              <Card className="forum-detail-side-card">
                <Card.Body>
                  <Card.Title>Sobre este foro</Card.Title>
                  <div><h6>Reglas generales</h6>
                  <ul className="forum-detail-rules">
                    {rules.map((rule, index) => (
                      <li key={index}>{rule}.</li>
                    ))}
                  </ul></div>
                </Card.Body>
                
              </Card>

              <Card className="forum-detail-side-card">
                <Card.Body>
                  <Card.Title>Estadísticas</Card.Title>

                  <div className="forum-detail-stat">
                    <span>Publicaciones:</span>
                    <strong>{forumPosts.length}</strong>
                  </div>

                  <div className="forum-detail-stat">
                    <span>Comentarios:</span>
                    <strong>Pendiente</strong>
                  </div>

                  <div className="forum-detail-stat">
                    <span>Estado:</span>
                    <strong>Activo</strong>
                  </div>
                </Card.Body>
              </Card>
            </aside>
          </Col>
        </Row>
      </section>
    </main>
  );
};

export default ForumPage;

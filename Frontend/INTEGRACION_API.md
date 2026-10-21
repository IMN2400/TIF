# Contrato de integración entre React y .NET

Este documento define cómo debe comunicarse el frontend con la API .NET actual. Se elaboró leyendo el código de ambos lados en el commit `efe385e`. No modifica ni exige cambios inmediatos en el backend.

## Configuración de desarrollo

La API .NET se ejecuta por HTTP en `http://localhost:5073` y por HTTPS en `https://localhost:7250`.

El frontend no debe repetir una URL absoluta en cada componente. En el próximo paso se centralizará la configuración mediante `VITE_API_URL` y un cliente HTTP común. Para desarrollo local puede usarse un proxy de Vite hacia `http://localhost:5073`; de ese modo el navegador no necesita comunicarse directamente con otro origen.

## Endpoints disponibles actualmente

ASP.NET usa el nombre del controlador como ruta. Por eso las rutas vigentes son `/Forum`, `/Post` y `/User`.

### Foros

| Operación | API .NET | Datos |
| --- | --- | --- |
| Listar | `GET /Forum` | Devuelve `ForumDTO[]`. |
| Consultar | `GET /Forum/{id}` | Devuelve un `ForumDTO`. |
| Crear | `POST /Forum` | Recibe `{ title, description }`. |
| Editar | `PUT /Forum/{id}` | Recibe `{ title, description }`. |
| Eliminar | `DELETE /Forum/{id}` | Devuelve `204 No Content`. |

`ForumDTO`:

```json
{
  "id": "guid",
  "title": "string",
  "description": "string",
  "state": true
}
```

El frontend viejo usa `name`, `desc`, `status`, `rules`, `Founder` y `Posts`. Para evitar que todas las pantallas conozcan el DTO de .NET, el servicio de foros deberá normalizarlo:

```js
const mapForumFromApi = (forum) => ({
  id: forum.id,
  name: forum.title,
  desc: forum.description,
  status: forum.state,
});
```

`rules`, `Founder` y `Posts` no existen en `ForumDTO`; el frontend no debe inventarlos. Los posts se consultarán con su endpoint específico.

### Usuarios

| Operación | API .NET | Datos |
| --- | --- | --- |
| Listar | `GET /User` | Devuelve `UserDTO[]`. |
| Consultar | `GET /User/{id}` | Devuelve un `UserDTO`. |
| Registrar | `POST /User` | Recibe `CreateUserDTO`. |
| Editar | `PATCH /User` | Recibe `PatchUserDTO`. |
| Eliminar | `DELETE /User/{id}` | Devuelve `204 No Content`. |

Registro esperado por .NET:

```json
{
  "name": "string",
  "dateOfBirth": "2000-01-31",
  "email": "persona@example.com",
  "plainPassword": "string"
}
```

Usuario devuelto por .NET:

```json
{
  "name": "string",
  "dateOfBirth": "2000-01-31",
  "email": "persona@example.com",
  "userRole": "User",
  "dateCreated": "fecha ISO",
  "userId": "guid"
}
```

El formulario React actual envía `nick`, `nombre`, `correo`, `edad` y `password`. La adaptación requiere:

- usar `name`, `email` y `plainPassword`;
- reemplazar edad por fecha de nacimiento;
- decidir si `nick` desaparece de la interfaz, porque .NET no lo almacena;
- normalizar `userId` como `id` y `userRole` como `role` al leer la respuesta.

La edición actual usa `/persons/me`, pero .NET requiere un ID dentro de `PatchUserDTO`. Sin autenticación no existe todavía el concepto de “usuario actual”.

### Publicaciones

| Operación | API .NET | Estado |
| --- | --- | --- |
| Listar por foro | `GET /Post?forumId={guid}` | Disponible. |
| Consultar | `GET /Post/{id}` | Disponible. |
| Crear | `POST /Post` | Disponible, pero recibe el `PostDTO` completo. |
| Editar cuerpo | `PATCH /Post/{id}` | Disponible; recibe un string JSON. |
| Eliminar | Sin ruta HTTP publicada | No disponible desde React. |
| Ocultar/mostrar | Sin ruta HTTP publicada | No disponible desde React. |

`PostDTO`:

```json
{
  "id": "guid",
  "poster": "guid",
  "forum": "guid",
  "date": "fecha ISO",
  "edited": false,
  "hidden": false,
  "body": "string"
}
```

El frontend espera también `title`, `Person`, `Forum`, `Comments` y `likeCount`. Esos datos no están en el DTO. La vista actual de una publicación no puede reconstruirse fielmente con la respuesta de .NET. El ID del autor y el ID del foro sí pueden normalizarse como `userId` y `forumId`.

### Funcionalidades sin endpoint equivalente

Estas operaciones existen en el frontend heredado, pero no están expuestas por la API .NET:

| Funcionalidad React | Ruta heredada |
| --- | --- |
| Iniciar sesión | `POST /login` |
| Validar sesión | `GET /token` |
| Comentarios | `/posts/{id}/comments` y `/comments/{id}` |
| Likes | `/posts/{id}/like` y `/posts/{id}/my-like` |
| Baneos | `/bans` |
| Convertir usuario en admin | `PATCH /persons/{id}/make-admin` |
| Perfil del usuario actual | `/persons/me` |

El frontend puede conservar temporalmente esas pantallas, pero no debe considerarlas integradas con .NET.

## Diferencias transversales

- Los identificadores de .NET son GUID. El frontend no debe convertirlos con `Number(id)`.
- Las respuestas `204 No Content` no deben procesarse siempre con `response.json()`.
- Las propiedades JSON de ASP.NET se serializan normalmente en camelCase.
- El backend actual no configura CORS. Para desarrollo puede resolverse desde el frontend con un proxy de Vite; en producción será necesaria una política del servidor o servir ambos bajo el mismo origen.
- El frontend debe presentar los errores de red y los errores HTTP de manera separada.
- La autorización visual de React no sustituye la autorización de la API.

## Contrato recomendado para el frontend

La interfaz de componentes debe mantenerse estable mediante servicios y adaptadores:

```text
Componente → servicio del recurso → cliente HTTP → API .NET
                         ↓
                  adaptador de datos
```

Carpetas propuestas para el próximo paso:

```text
src/
  config/
    api.js
  services/
    httpClient.js
    forumService.js
    userService.js
    postService.js
  adapters/
    forumAdapter.js
    userAdapter.js
    postAdapter.js
```

No hace falta incorporar Redux, Axios ni una capa genérica compleja. `fetch`, funciones pequeñas y un cliente común son suficientes.

## Orden de integración solo desde el frontend

1. Centralizar URL, encabezados, lectura de JSON y respuestas `204`.
2. Integrar el ABM de foros, porque las cinco operaciones tienen equivalente en .NET.
3. Adaptar el registro de usuarios a `CreateUserDTO`.
4. Adaptar lectura y edición de usuarios cuando se defina cómo se selecciona el ID sin autenticación.
5. Adaptar lectura de posts con las limitaciones actuales del DTO.
6. Mantener deshabilitadas o señaladas como pendientes las funciones sin endpoint.

El primer módulo adecuado para una integración completa desde React es **Foros**.

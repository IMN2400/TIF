# Paso 1: recuperación del frontend original

Origen: https://github.com/IMN2400/tpi-prog3-2tup2-2026

Commit de origen: `1345d5f2a91c792e8f7a1ee9463ab15001adde63`.

Se recuperaron 33 archivos ausentes: pantallas, estilos, contexto de autenticación, hooks, servicios auxiliares e imágenes. Los archivos se copiaron sin modificar su contenido y se verificaron byte por byte. Los componentes se ubicaron en la carpeta `Components` existente y los hooks en `Services/Hooks`. No se sobrescribió ningún archivo existente ni se incorporó el backend Node o su base de datos.

## Pendientes para el paso 2

- Ajustar imports a las ubicaciones actuales, incluyendo mayúsculas y minúsculas.
- Revisar dependencias de frontend; no copiar las dependencias de servidor incluidas en el package.json original.
- Conectar rutas y AuthProvider al arranque y recuperar los estilos globales necesarios.
- Revisar las dos implementaciones de contexto de autenticación recuperadas y conservar una sola en la reorganización.
- Resolver la referencia a `usersList/UserList`: ese archivo tampoco está presente en el commit original examinado.
- Comprobar compilación y navegación una vez conectadas las pantallas. Un build de la plantilla Vite actual no valida estos archivos.

## Alcance

Esta recuperación no constituye una integración funcional. Los archivos conservan las rutas HTTP y contratos del backend Node original. La adaptación a .NET y la validación funcional se realizarán en los pasos siguientes.

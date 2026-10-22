const unavailable = () => {
  throw new Error("Los comentarios todavía no están disponibles en la API .NET.");
};

export const fetchComments = async () => unavailable();
export const createComment = async () => unavailable();
export const updateComment = async () => unavailable();
export const deleteComment = async () => unavailable();

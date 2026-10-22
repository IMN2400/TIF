export const createPermissions = ({ user, isAdmin, isSysAdmin }) => {
  const isBannedUser = (target) => target?.status === false;

  const canBanUser = (target) => {
    if (!isAdmin) return false;
    if (!target?.id) return false;
    if (target.status === false) return false;
    if (String(target.id) === String(user?.id)) return false;
    if (!isSysAdmin && target?.role === "SYSADMIN") return false;
    return true;
  };

  const canMakeAdmin = (target) => {
    if (!isSysAdmin) return false;
    if (!target?.id) return false;
    if (isBannedUser(target)) return false;
    if (String(target.id) === String(user?.id)) return false;
    if (target.role && target.role !== "USER") return false;
    return true;
  };

  const canEditPost = (post) => {
    const authorId = post?.userId || post?.Person?.id;
    return !!authorId && String(authorId) === String(user?.id);
  };

  const canDeletePost = () => false;

  const canEditComment = (comment) => {
    const authorId = comment?.userId || comment?.Person?.id;
    return !!authorId && String(authorId) === String(user?.id);
  };

  const canDeleteComments = () => isAdmin || isSysAdmin;

  return {
    isBannedUser,
    canBanUser,
    canMakeAdmin,
    canEditPost,
    canDeletePost,
    canEditComment,
    canDeleteComments,
  };
};

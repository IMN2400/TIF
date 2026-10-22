export const userFromApi = (user) => ({
  id: user.userId,
  name: user.name,
  dateOfBirth: user.dateOfBirth,
  email: user.email,
  role: user.userRole?.toUpperCase(),
  createdAt: user.dateCreated,
});

export const newUserToApi = (user) => ({
  name: user.name.trim(),
  dateOfBirth: user.dateOfBirth,
  email: user.email.trim(),
  plainPassword: user.password,
});

export const userChangesToApi = (id, changes) => ({
  id,
  name: changes.name?.trim() || null,
  dateOfBirth: changes.dateOfBirth || null,
  email: changes.email?.trim() || null,
  plainPassword: changes.password || null,
  role: changes.role ?? null,
});

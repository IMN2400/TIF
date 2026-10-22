export const forumFromApi = (forum) => ({
  id: forum.id,
  name: forum.title,
  desc: forum.description,
  status: forum.state,
});

export const forumToApi = (forum) => ({
  title: forum.name.trim(),
  description: forum.desc.trim(),
});

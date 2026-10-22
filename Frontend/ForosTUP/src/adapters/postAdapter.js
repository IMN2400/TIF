export const postFromApi = (post) => ({
  id: post.id,
  userId: post.poster,
  forumId: post.forum,
  postDate: post.date,
  edited: post.edited,
  hidden: post.hidden,
  body: post.body,
});

export const newPostToApi = ({ body, forumId, userId }) => ({
  id: "00000000-0000-0000-0000-000000000000",
  poster: userId,
  forum: forumId,
  date: new Date().toISOString(),
  edited: false,
  hidden: false,
  body: body.trim(),
});

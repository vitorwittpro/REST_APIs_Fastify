import Fastify from "fastify";

const fastify = Fastify({ logger: true });
const PORT = 5000;

// Defining types used a lot
const typeString = { type: "string" };
const typeNumber = { type: "number" };

const posts = [
  { id: 1, title: "Post One", body: "This is post one" },
  { id: 2, title: "Post Two", body: "This is post two" },
  { id: 3, title: "Post Three", body: "This is post three" },
];

//
// ############################# SCHEMA #####################################
// GET

const post = {
  type: "object",
  properties: {
    id: typeNumber,
    title: typeString,
    body: typeString,
  },
};

const getPostsSchemas = {
  schema: {
    response: {
      200: {
        type: "array",
        items: post,
      },
    },
  },
};

const getPostSchemas = {
  params: {
    id: { type: "number" },
  },
  response: {
    200: post,
  },
};

// POST

const addPostSchema = {
  body: {
    type: "object",
    required: ["title", "body"],
    properties: {
      title: typeString,
      body: typeString,
    },
  },
  response: {
    200: typeString,
  },
};

// PUT

const putPostSchema = {
  body: {
    type: "object",
    required: ["title", "body"],
    properties: {
      title: typeString,
      body: typeString,
    },
  },
  params: {
    id: typeNumber,
  },
  response: {
    200: typeString,
  },
};

// DELETE

const deletePostSchema = {
  params: {
    id: typeNumber,
  },
  response: {
    200: typeString,
  },
};

//
// ############################# HANDLER ####################################
// GET

const getPostsHandler = (req, reply) => {
  reply.send(posts);
};

const getPostHandler = (req, reply) => {
  const { id } = req.params;

  const post = posts.filter((post) => {
    return post.id === id;
  })[0];

  if (!post) {
    return reply.status(404).send(new Error("Post not found"));
  }
  return reply.send(post);
};

// POST

const addPostHandler = (req, reply) => {
  // get title and body value
  const { title, body } = req.body;

  // get id
  const id = posts.length + 1;

  // push object to array of posts
  posts.push({ id, title, body });

  // Sending a reply message
  reply.send("Post added");
};

// PUT

const putPostHandler = (req, reply) => {
  // get title, body and id
  const { title, body } = req.body;
  const { id } = req.params;

  // filter post
  const post = posts.filter((post) => {
    return post.id === id;
  })[0];

  // verify if post exist
  if (!post) {
    console.log(post);
    return reply.status(404).send(new Error("Post does not exist"));
  }

  // Update values
  post.title = title;
  post.body = body;

  return reply.send("Post updated");
};

// DELETE

const deletePostHandler = (req, reply) => {
  const { id } = req.params;

  const postIndex = posts.findIndex((post) => {
    return post.id === id;
  });

  if (postIndex === -1) {
    return reply.status(404).send(new Error("Post does not exist"));
  }

  posts.splice(postIndex, 1);

  return reply.send(`Post ${id}: DELETED`);
};

//
// ############################# OPTIONS ####################################
// GET

const getPostsOpts = {
  schema: getPostsSchemas,
  handler: getPostsHandler,
};

const getPostOpts = {
  schema: getPostSchemas,
  handler: getPostHandler,
};

// POST

const addPostOpts = {
  schema: addPostSchema,
  handler: addPostHandler,
};

// PUT

const putPostOpts = {
  schema: putPostSchema,
  handler: putPostHandler,
};

// DELETE

const deletePostOpts = {
  schema: deletePostSchema,
  handler: deletePostHandler,
};

//
// ############################# ROUTES #####################################
// Routes

const postRoutes = (fastify, options, done) => {
  // GET
  fastify.get("/api/posts", getPostsOpts);
  fastify.get("/api/posts/:id", getPostOpts);

  // POST
  fastify.post("/api/posts/new", addPostOpts);

  // UPDATE
  fastify.put("/api/posts/edit/:id", putPostOpts);

  // DELETE
  fastify.delete("/api/posts/:id", deletePostOpts);

  done();
};

//
// Registering Routes
fastify.register(postRoutes);

//
// Start Server

const startServer = () => {
  try {
    fastify.listen({ port: PORT });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

startServer();

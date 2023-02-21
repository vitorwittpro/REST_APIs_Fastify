import Fastify from "fastify";

const clients = [
  {
    id: 1,
    name: "Joao",
  },
  {
    id: 2,
    name: "Paulo",
  },
  {
    id: 3,
    name: "Carlos",
  },
  {
    id: 4,
    name: "Moacir",
  },
  {
    id: 5,
    name: "Marcia",
  },
];

const server = Fastify();
const PORT = 5000;

server.get("/", async (request, reply) => {
  return { hello: "world" };
});

server.get("/clients", () => clients);

const startServer = async () => {
  try {
    await server.listen({ port: PORT });
    console.log(`Server listening at ${PORT}`);
  } catch (err) {
    Fastify.log.error(err);
    process.exit(1);
  }
};

startServer();

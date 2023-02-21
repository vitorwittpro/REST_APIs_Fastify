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

server.post("/clients", (request, reply) => {
  try {
    clients.push({ request });
    console.log(request);
    return request;
  } catch (error) {
    return reply.statusCode.log(error);
  }
});

server.post("/clients", (request, reply) => {
  try {
    const client = clientSchema.parse(request.body);
    clients.push(client);
    return client;
  } catch (error) {
    const errorJson = JSON.stringify(error);
    if (error instanceof ZodError) {
      reply.status(400).send(errorJson);
    } else return reply.status(500).send(errorJson);
  }
});

const startServer = async () => {
  try {
    server.listen({ port: PORT }, (err, address) => {
      console.log(`Server listening at ${address}`);
    });
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

startServer();

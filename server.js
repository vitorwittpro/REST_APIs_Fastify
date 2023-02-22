import Fastify from "fastify";
import { fastifyCors } from "@fastify/cors";

// update
// delete

const fastify = Fastify({ logger: true });
const PORT = 3000;

//
// ROUTES
const purchaseRoutes = (fastify, options, done) => {
  // GET
  fastify.get("/api/purchases", getPurchasesOpts);
  fastify.get("/api/purchases/:id", getPurchaseOpts);

  // POST
  fastify.post("/api/purchases/new", addPurchaseOpts);

  // PUT
  fastify.put("/api/purchases/edit/:id", updatePurchaseOpts);

  // DELETE
  fastify.delete("/api/purchases/:id", deletePurchaseOpts);

  done();
};

//
// Registering routes
fastify.register(purchaseRoutes);

// Registering fastify/cors
fastify.register(fastifyCors, {
  origin: "*",
});

const purchases = [
  {
    id: 1,
    name: "Range Rover Sport",
    price: "84,777",
    url: "https://s2.glbimg.com/xPjwpspdsCGgcz3ppO4F1QRK9Cw=/0x0:1600x1067/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2022/7/o/sjO4SWQhCvZ5AiE6Atqg/land-rover-range-rover-sport-2023-1600-0d.jpg",
    seats: 5,
    miles: "14,666",
    features: [
      "No Accidents",
      "Low KM",
      "Vehicle Detailed",
      "Leather Interior",
      "4-Wheel-Drive",
    ],
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis odio et laboriosam!",
  },
  {
    id: 2,
    name: "Rolls Royce Ghost",
    price: "455,000",
    url: "https://robbreport.com/wp-content/uploads/2021/03/1-5.jpg?w=1000",
    seats: 5,
    miles: "53,666",
    features: [
      "No Accidents",
      "Low KM",
      "Vehicle Detailed",
      "Leather Interior",
    ],
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis odio et laboriosam! Numquam ut rem, blanditiis est rerum tenetur maxime delectus",
  },
  {
    id: 3,
    name: "Porsche Taycan",
    price: "180,434",
    url: "https://www.topgear.com/sites/default/files/cars-car/carousel/2021/02/pcgb20_1441_fine.jpg",
    seats: 5,
    miles: "0",
    features: [
      "No Accidents",
      "Low KM",
      "Vehicle Detailed",
      "Leather Interior",
    ],
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis odio et",
  },
];

//
// SCHEMA

const purchaseType = {
  type: "object",
  properties: {
    id: { type: "number" },
    prodName: { type: "string" },
    amount: { type: "string" },
  },
};

// GET
const getPurchasesSchema = {
  schema: {
    response: {
      200: {
        type: "array",
        items: purchaseType,
      },
    },
  },
};

const getPurchaseSchema = {
  params: {
    id: { type: "number" },
  },
  response: {
    200: purchaseType,
  },
};

// POST
const addPurchaseSchema = {
  body: {
    type: "object",
    required: ["prodName", "amount"],
    properties: {
      prodName: { type: "string" },
      amount: { type: "number" },
    },
  },
  response: {
    200: { type: "string" },
  },
};

// PUT
const updatePurchaseSchema = {
  body: {
    type: "object",
    required: ["prodName", "amount"],
    properties: {
      prodName: { type: "string" },
      amount: { type: "number" },
    },
  },
  params: {
    id: { type: "number" },
  },
  response: {
    200: { type: "string" },
  },
};

// DELETE
const deletePurchaseSchema = {
  params: {
    id: { type: "number" },
  },
  response: {
    200: { type: "string" },
  },
};

//
// HANDLER
// GET
const getPurchasesHandler = (req, reply) => {
  reply.send(purchases);
};

const getPurchaseHandler = (req, reply) => {
  const { id } = req.params;

  const purchase = purchases.filter((purchase) => {
    return purchase.id === id;
  })[0];

  if (!purchase)
    return reply.status(404).send(new Error(`Purchase doesn't exist`));

  return reply.send(purchase);
};

// POST
const addPurchaseHandler = (req, reply) => {
  const { prodName, amount } = req.body;

  const id = purchases.length + 1;

  purchases.push({ id, prodName, amount });

  reply.send("Purchase added");
};

// PUT
const updatePurchaseHandler = (req, reply) => {
  const { id } = req.params;
  const { prodName, amount } = req.body;

  const purchase = purchases.filter((purchase) => {
    return purchase.id === id;
  })[0];

  if (!purchase) {
    return reply.status(404).send(new Error(`Purchase doesn't exit`));
  }

  purchase.prodName = prodName;
  purchase.amount = amount;

  return reply.send("Purchase updated");
};

// DELETE
const deletePurchaseHandler = (req, reply) => {
  const { id } = req.params;

  const index = purchases.findIndex((p) => {
    return p.id === id;
  });

  if (index === -1) {
    return reply.status(404).send(new Error(`Purchase doesn't exist`));
  }

  purchases.splice(index, 1);

  return reply.send("Purchase deleted");
};

//
// OPTIONS
// GET
const getPurchasesOpts = {
  schema: getPurchasesSchema,
  handler: getPurchasesHandler,
};

const getPurchaseOpts = {
  schema: getPurchaseSchema,
  handler: getPurchaseHandler,
};

// POST
const addPurchaseOpts = {
  schema: addPurchaseSchema,
  handler: addPurchaseHandler,
};

// PUT
const updatePurchaseOpts = {
  schema: updatePurchaseSchema,
  handler: updatePurchaseHandler,
};

// DELETE
const deletePurchaseOpts = {
  schema: deletePurchaseSchema,
  handler: deletePurchaseHandler,
};

// Start Server
const start = () => {
  try {
    fastify.listen({ port: PORT });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

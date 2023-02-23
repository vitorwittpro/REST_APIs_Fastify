import fastifyCors from "@fastify/cors";
import Fastify from "fastify";

import pkg from "pg";
import { z } from "zod";

const PORT = 3000;
const fastify = Fastify({ logger: true });

const { Client } = pkg;
const client = new Client({
  host: "localhost",
  user: "postgres",
  port: 5432,
  password: "1234",
  database: "cars",
});

client.connect();

// Schema

const carType = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    price: { type: "number" },
    url: { type: "string" },
    seats: { type: "number" },
    miles: { type: "string" },
    features: { type: "array" },
    description: { type: "string" },
  },
};

const getCarsSchema = {
  schema: {
    response: {
      200: {
        type: "array",
        items: carType,
      },
    },
  },
};

const postCarSchema = {
  body: {
    type: "object",
    required: ["name", "price", "url", "seats", "miles", "features"],
    properties: {
      name: { type: "string" },
      price: { type: "string" },
      url: { type: "string" },
      seats: { type: "number" },
      miles: { type: "string" },
      features: { type: "array" },
      description: { type: "string" },
    },
  },
  response: {
    200: { type: "string" },
  },
};

// Handler

const getCarsHandler = (req, reply) => {
  client.query("SELECT * FROM tab_cars", (err, response) => {
    if (!err) {
      reply.send(response.rows);
    } else {
      console.log(err.message);
    }

    client.end;
  });
};

const postCarHandler = (req, reply) => {
  const { name, price, url, seats, miles, features, description } = req.body;

  client.query(
    `INSERT INTO tab_cars VALUES ${
      (name, price, url, seats, miles, features, description)
    }`,
    (err, response) => {
      if (!err) {
        console.log(response.rows);
      } else {
        console.log(err);
      }

      client.end;
    }
  );
};

// Options

const getCarsOpts = {
  schema: getCarsSchema,
  handler: getCarsHandler,
};

const postCarOpts = {
  schema: postCarSchema,
  handler: postCarHandler,
};

// routes
const carRoutes = (fastify, options, done) => {
  fastify.get("/api/cars", getCarsOpts);

  fastify.post("/api/cars/new", postCarOpts);

  done();
};

fastify.register(carRoutes);
fastify.register(fastifyCors);

// start server
const start = () => {
  try {
    fastify.listen({ port: PORT });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();

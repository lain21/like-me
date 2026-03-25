const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
  host: "localhost",
  user: "postgres",
  database: "likeme",
  password: "postgres",
  port: 5432,
  allowExitOnIdle: true,
});

app.use(express.json());
app.use(cors());

app.get("/posts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM posts");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

app.post("/posts", async (req, res) => {
  const { titulo, url, descripcion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *",
      [titulo, url, descripcion]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

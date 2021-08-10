const express = require("express");
const cors = require("cors");
const app = express();

const pool = require("./db.js");

// middleware
app.use(cors());
app.use(express.json());

// routes
// add a shoe
app.post("/shoes", async (req, res) => {
  try {
    const { name, description, price } = req.body;
    const newShoe = await pool.query(
      "INSERT INTO shoes (name, description, price) VALUES($1, $2, $3) RETURNING *",
      [name, description, price]
    );
    res.json(newShoe.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get all shoes
app.get("/shoes", async (req, res) => {
  try {
    const shoes = await pool.query("SELECT * FROM shoes ORDER BY price DESC");
    res.json(shoes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a shoe
app.get("/shoes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const shoe = await pool.query("SELECT * FROM shoes WHERE id = $1", [id]);
    res.json(shoe.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update a shoe
app.put("/shoes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price } = req.body;
    const shoe = await pool.query(
      "UPDATE shoes SET name = $1, description = $2, price = $3 WHERE id = $4",
      [name, description, price, id]
    );
    res.json("Shoe was updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a shoe
app.delete("/shoes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const shoe = await pool.query("DELETE FROM shoes WHERE id = $1", [id]);
    res.json("Shoe was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

// search shoe by name
app.get("/search", async (req, res) => {
  try {
    console.log(req.query);
    const { term } = req.query;
    const shoes = await pool.query(
      `SELECT * FROM shoes WHERE name LIKE '%' || $1 || '%'`,
      [term]
    );
    res.json(shoes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// order shoe by parameters
app.get("/order", async (req, res) => {
  try {
    let { term, type, order } = req.query;
    type = type.toLowerCase();
    order === "Ascending" ? (order = "ASC") : (order = "DESC");

    const query = `SELECT * FROM shoes WHERE name LIKE '${term}' ORDER BY ${type} ${order}`;

    const shoes = await pool.query(query);
    res.json(shoes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get shoes between price range
app.get("/range", async (req, res) => {
  try {
    let { min, max } = req.query;
    console.log(req.query);
    const shoes = await pool.query(
      `SELECT * FROM shoes WHERE price BETWEEN ${min} AND ${max}`
    );
    res.json(shoes.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});

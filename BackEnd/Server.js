require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
const port = 5000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, genre, publication_date, description } = req.body;

    const result = await pool.query(
      "INSERT INTO books (title, author, genre, publication_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, genre, publication_date, description]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

app.get("/books", async (req, res) => {
    try {
      const result = await pool.query("SELECT * FROM books WHERE is_deleted = FALSE");
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching books:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

app.put("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { title, author, genre, publication_date, description } = req.body;
  
      const result = await pool.query(
        "UPDATE books SET title = $1, author = $2, genre = $3, publication_date = $4, description = $5 WHERE id = $6 RETURNING *",
        [title, author, genre, publication_date, description, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

  app.delete("/books/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await pool.query(
        "UPDATE books SET is_deleted = TRUE WHERE id = $1 RETURNING *",
        [id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.json({ message: "Book soft deleted", book: result.rows[0] });
    } catch (error) {
      console.error("Error soft deleting book:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
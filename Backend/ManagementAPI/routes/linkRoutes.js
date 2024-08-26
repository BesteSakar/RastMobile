const express = require("express");
const router = express.Router();
const db = require("../config/database");
const sql = require("mssql");

// Tüm linkleri getirme
router.get("/links", async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Veritabanı bağlantısı sağlanamadı." });
    }

    const result = await pool.request().query("SELECT * FROM Links");

    res.status(200).json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Yeni bir link ekleme
router.post("/links", async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Veritabanı bağlantısı sağlanamadı." });
    }

    const { name, url, description } = req.body;

    if (!name || !url || !description) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır." });
    }
    if (name.length > 255 || url.length > 255 || description.length > 255) {
      return res
        .status(400)
        .json({ message: "Alan uzunluğu 255 karakteri geçmemelidir." });
    }

    // Aynı isimde bir link olup olmadığının kontrolü
    const existingLink = await pool
      .request()
      .input("name", sql.VarChar, name)
      .query("SELECT * FROM Links WHERE name = @name");

    if (existingLink.recordset.length > 0) {
      return res.status(400).json({ message: "Bu link mevcuttur." });
    }

    // Link ekleme işlemi
    await pool
      .request()
      .input("name", sql.VarChar, name)
      .input("url", sql.VarChar, url)
      .input("description", sql.VarChar, description)
      .query(
        "INSERT INTO Links (name, url, description) VALUES (@name, @url, @description)"
      );

    res.status(201).json({ message: "Link başarıyla eklendi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Belirli bir linki güncelleme
router.put("/links/:id", async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Veritabanı bağlantısı sağlanamadı." });
    }

    const { id } = req.params;
    const { name, url, description } = req.body;

    const existingLink = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Links WHERE id = @id");

    if (existingLink.recordset.length === 0) {
      return res.status(404).json({ message: "Link bulunamadı." });
    }

    if (!name || !url || !description) {
      return res.status(400).json({ message: "Tüm alanlar doldurulmalıdır." });
    }

    if (name.length > 255 || url.length > 255 || description.length > 255) {
      return res
        .status(400)
        .json({ message: "Alan uzunluğu 255 karakteri geçmemelidir." });
    }

    // Link güncelleme işlemi
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar, name)
      .input("url", sql.VarChar, url)
      .input("description", sql.VarChar, description)
      .query(
        "UPDATE Links SET name = @name, url = @url, description = @description WHERE id = @id"
      );

    res.status(200).json({ message: "Link başarıyla güncellendi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Belirli bir linki silme
router.delete("/links/:id", async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Veritabanı bağlantısı sağlanamadı." });
    }

    const { id } = req.params;

    const existingLink = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM Links WHERE id = @id");

    if (existingLink.recordset.length === 0) {
      return res.status(404).json({ message: "Link bulunamadı." });
    }

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Links WHERE id = @id");

    res.status(200).json({ message: "Link başarıyla silindi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

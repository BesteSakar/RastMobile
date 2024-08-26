const express = require("express");
const router = express.Router();
const db = require("../config/database");
const sql = require("mssql");

// Kullanıcı Giriş Endpoint'i
router.post("/login", async (req, res) => {
  try {
    const pool = await db.connectToDatabase();
    if (!pool) {
      return res
        .status(500)
        .json({ message: "Veritabanı bağlantısı sağlanamadı." });
    }

    const { username, password } = req.body;

    // Boş alan kontrolü
    if (!username || !password) {
      return res.status(400).json({ message: "Kullanıcı adı ve şifre gereklidir." });
    }

    // Kullanıcıyı veritabanında ara
    const result = await pool
      .request()
      .input("username", sql.VarChar, username)
      .query("SELECT * FROM Login WHERE Username = @username");

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    }

    const user = result.recordset[0];

    // Şifre kontrolü 
    if (user.Password !== password) {
      return res.status(401).json({ message: "Geçersiz şifre." });
    }

    res.status(200).json({ message: "Giriş başarılı", userId: user.Id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

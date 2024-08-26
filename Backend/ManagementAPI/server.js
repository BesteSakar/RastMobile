const express = require("express");
const cors = require("cors"); 
const app = express();

app.use(cors());
app.use(express.json());

const linkRoutes = require("./routes/linkRoutes");
app.use("/api", linkRoutes);

const loginRoutes = require("./routes/loginRoutes");
app.use("/api", loginRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor.`);
});

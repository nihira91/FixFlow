require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authroutes");
const employeeRoutes = require("./routes/employeeroutes");
const technicianRoutes = require("./routes/technicianroutes");
const adminRoutes = require("./routes/adminroutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.static("src/public"));


app.get("/", (req, res) => {
  res.send("IT-IMS Backend Running Successfully ✔");
});

app.use("/api/auth", authRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/technician", technicianRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

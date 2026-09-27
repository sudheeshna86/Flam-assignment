import "dotenv/config";
import express from "express";
import cors from "cors";
import generateRoutes from "./routes/generateRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Flam Study Assistant backend is running",
  });
});

app.use("/api", generateRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

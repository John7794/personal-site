import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "cms-data.json");

app.use(express.json());

// Load initial data if exists
app.get("/api/data", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.json({ error: "No data synced yet" });
  }
});

// Sync data from Google Sheets
app.post("/api/sync", async (req, res) => {
  const { token, spreadsheetId } = req.body;
  if (!token || !spreadsheetId) {
    return res.status(400).json({ error: "Token and spreadsheetId are required" });
  }

  try {
    // Fetch disciplines (assuming they are in a sheet named "Disciplines" or first sheet)
    // We'll fetch the first sheet's data
    const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1?access_token=${token}`;
    const response = await fetch(sheetUrl);
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    // Assuming first row is header: [id, title, type, uk_title, en_title, uk_type, en_type]
    const rows = data.values || [];
    
    // Write to local cache file
    await fs.writeFile(DATA_FILE, JSON.stringify({ sheet1: rows }, null, 2));

    res.json({ success: true, rows: rows.length });
  } catch (error: any) {
    console.error("Sync error:", error);
    res.status(500).json({ error: error.message || "Failed to sync" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

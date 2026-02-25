const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public")); // serve frontend

app.post("/generate-plan", (req, res) => {
    const { name, type, quality, area, duration, budget } = req.body;

    if (!name || !area || !duration || !budget) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    // Cost Logic
    let qualityFactor =
        quality === "Premium" ? 1.3 :
        quality === "Eco-Friendly" ? 1.15 : 1.0;

    let costEstimate = (area * 1600 * qualityFactor) + (duration * 150000);

    // Schedule
    const schedule = {
        foundation: Math.ceil(duration * 0.20),
        structure: Math.ceil(duration * 0.40),
        finishing: Math.ceil(duration * 0.30),
        handover: Math.ceil(duration * 0.10),
    };

    // Resources
    const workers = Math.ceil(area / 450);
    const machines = Math.ceil(area / 1200);

    // Risk
    const risk = {
        material: "Moderate",
        labour: "Low",
        climate: "High",
        overall: "Medium"
    };

    // Environmental
    const co2 = area * 12;

    // Summary
    const summary = `The ${name} (${type}) project using ${quality} materials is estimated to complete in ${duration} months with moderate risk levels.`;

    res.json({
        costEstimate,
        schedule,
        workers,
        machines,
        risk,
        co2,
        summary
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
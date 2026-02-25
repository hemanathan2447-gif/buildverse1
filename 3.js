const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const PDFDocument = require("pdfkit");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(bodyParser.json());

/* ==============================
   MAIN AI PLAN API
============================== */
app.post("/generate-plan", (req, res) => {
    const { name, type, quality, area, duration, budget } = req.body;

    if (!name || !area || !duration || !budget) {
        return res.status(400).json({ error: "Missing fields" });
    }

    /* COST LOGIC */
    let qualityFactor =
        quality === "Premium" ? 1.3 :
        quality === "Eco-Friendly" ? 1.15 : 1.0;

    let costEstimate = (area * 1600 * qualityFactor) + (duration * 150000);

    /* SCHEDULE */
    const schedule = {
        foundation: Math.ceil(duration * 0.20),
        structure: Math.ceil(duration * 0.40),
        finishing: Math.ceil(duration * 0.30),
        inspection: Math.ceil(duration * 0.10)
    };

    /* RESOURCES */
    const workers = Math.ceil(area / 450);
    const machines = Math.ceil(area / 1200);

    /* RISK */
    const risk = "Medium";

    /* ECO */
    const co2 = area * 12;

    /* SUMMARY */
    const summary = The ${name} (${type}) project using ${quality} materials is estimated to complete in ${duration} months with moderate risk.;

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


/* ==============================
   PDF DOWNLOAD API
============================== */
app.post("/download-report", (req, res) => {
    const data = req.body;

    const doc = new PDFDocument();
    const fileName = "report.pdf";

    doc.pipe(fs.createWriteStream(fileName));

    doc.fontSize(20).text("Victus AI Construction Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(Project: ${data.name});
    doc.text(Type: ${data.type});
    doc.text(Cost: ₹${data.costEstimate});
    doc.text(Workers: ${data.workers});
    doc.text(Machines: ${data.machines});
    doc.text(Risk: ${data.risk});
    doc.text(CO2: ${data.co2} kg);
    doc.moveDown();
    doc.text(data.summary);

    doc.end();

    doc.on("finish", () => {
        res.download(fileName);
    });
});


app.listen(5000, () => console.log("Server running on port 5000"));
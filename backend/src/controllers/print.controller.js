import { generateListPDF } from "../services/pdf.service.js";

export async function printList(req, res) {
  console.log("🔥 PRINT API HIT");
  console.log("BODY:", JSON.stringify(req.body, null, 2));

  try {
    const pdfBuffer = await generateListPDF(req.body);
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("❌ PDF ERROR:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
}
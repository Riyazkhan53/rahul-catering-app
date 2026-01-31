// backend/src/controllers/print.controller.js
import { generateListPDF } from "../services/pdf.service.js";

export function printList(req, res) {
  try {
    const list = req.body;

    const doc = generateListPDF(list);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${list.id}.pdf`
    );

    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
}
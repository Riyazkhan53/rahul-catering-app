// backend/src/controllers/print.controller.js
import { generateListPDF } from "../services/pdf.service.js";
import GeneratedItemList from "../models/GeneratedItemsList.js";

export function printList(req, res) {
  try {
    const list = req.body; // for POST preview / desktop

    const doc = generateListPDF(list);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${list.id}.pdf"`
    );

    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
}

export async function downloadListPDF(req, res) {
  try {
    const { id } = req.params;

    const list = await GeneratedItemList.findOne({ id });

    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const doc = generateListPDF(list);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${id}.pdf"`
    );

    doc.pipe(res);
    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "PDF generation failed" });
  }
}


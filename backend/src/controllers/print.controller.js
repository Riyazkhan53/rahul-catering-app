import { generateListPDF } from "../services/pdf.service.js";

export async function printList(req, res) {
  try {
    const pdfBuffer = await generateListPDF(req.body);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=list.pdf",
    });

    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "PDF generation failed" });
  }
}
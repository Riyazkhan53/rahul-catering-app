// backend/src/controllers/print.controller.js
import { generateListPDF } from "../services/pdf.service.js";
import { generateQuotationPDF } from "../services/quotationPdf.service.js";
import { generateMenuPlanPDF } from "../services/menuPlanPdf.service.js";
import GeneratedItemList from "../models/GeneratedItemsList.js";
import GeneratedQuotation from "../models/GeneratedQuotation.js";
import GeneratedMenuPlan from "../models/GeneratedMenuPlan.js";

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

export async function printQuotation(req, res) {
  try {
    const data = req.body;

    const pdfBytes = await generateQuotationPDF(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Quotation_${data.quotationNumber || "draft"}.pdf"`
    );

    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("QUOTATION PDF ERROR:", err);
    res.status(500).json({ message: "Quotation PDF generation failed" });
  }
}

export async function downloadQuotationPDF(req, res) {
  try {
    const { id } = req.params;
    const doc = await GeneratedQuotation.findOne({ id }).lean();

    if (!doc) {
      return res.status(404).json({ message: "Quotation not found" });
    }

    const pdfBytes = await generateQuotationPDF(doc);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="Quotation_${doc.quotationNumber || id}.pdf"`
    );

    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("QUOTATION DOWNLOAD PDF ERROR:", err);
    res.status(500).json({ message: "Quotation PDF generation failed" });
  }
}

export async function downloadMenuPlanPDF(req, res) {
  try {
    const { id } = req.params;
    const doc = await GeneratedMenuPlan.findOne({ id }).lean();

    if (!doc) {
      return res.status(404).json({ message: "Menu plan not found" });
    }

    const pdfBytes = await generateMenuPlanPDF(doc);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="MenuPlan_${doc.planNumber || id}.pdf"`
    );

    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("MENUPLAN DOWNLOAD PDF ERROR:", err);
    res.status(500).json({ message: "Menu Plan PDF generation failed" });
  }
}

export async function printMenuPlan(req, res) {
  try {
    const data = req.body;

    const pdfBytes = await generateMenuPlanPDF(data);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="MenuPlan_${data.planNumber || "draft"}.pdf"`
    );

    res.end(Buffer.from(pdfBytes));
  } catch (err) {
    console.error("MENUPLAN PDF ERROR:", err);
    res.status(500).json({ message: "Menu Plan PDF generation failed" });
  }
}

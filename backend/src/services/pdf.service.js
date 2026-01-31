import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";

export async function generateListPDF(list) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // Load HTML template
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/templates/list.html"),
    "utf8"
  );

  // Inject data
  const finalHTML = html.replace(
    "__DATA__",
    JSON.stringify(list)
  );

  await page.setContent(finalHTML, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
  });

  await browser.close();
  return pdfBuffer;
}
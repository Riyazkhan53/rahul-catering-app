import puppeteer from "puppeteer-core";
import path from "path";
import fs from "fs";

export async function generateListPDF(list) {
  console.log("Using Chrome at:", process.env.CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 
      "/opt/render/.cache/puppeteer/chrome/linux-144.0.7559.96/chrome-linux64/chrome",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: true,
  });

  const page = await browser.newPage();

  // Load HTML template
  const html = fs.readFileSync(
    path.join(process.cwd(), "src/templates/list.html"),
    "utf8"
  );

  const templatePath = path.join(process.cwd(), "src/templates/list.html");

  console.log("📄 TEMPLATE PATH:", templatePath);
console.log("📁 FILE EXISTS:", fs.existsSync(templatePath));

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
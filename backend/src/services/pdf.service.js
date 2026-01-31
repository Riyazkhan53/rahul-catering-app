import puppeteer from "puppeteer";
import puppeteerCore from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import fs from "fs";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

export async function generateListPDF(list) {
  console.log("🖨️ PDF generation started");

  const templatePath = path.join(
    process.cwd(),
    "src/templates/list.html"
  );

  if (!fs.existsSync(templatePath)) {
    throw new Error("Template not found");
  }

  const html = fs.readFileSync(templatePath, "utf8");

  const finalHTML = html.replace(
    "__DATA__",
    JSON.stringify(list)
  );

  const browser = isProd
    ? await puppeteerCore.launch({
        executablePath: process.env.CHROME_PATH,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: true,
      })
    : await puppeteer.launch({
        headless: true,
      });

  try {
    const page = await browser.newPage();

    await page.setContent(finalHTML, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    console.log("✅ PDF generated");
    return pdf;
  } finally {
    await browser.close();
  }
}
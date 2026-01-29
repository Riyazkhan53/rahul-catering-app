// utils/pdfActions.js
import { pdf } from "@react-pdf/renderer";
import ListPDF from "../pdf/listPDF";
import { isDesktop } from "./device";

export async function handleListPDF(list) {
  const blob = await pdf(<ListPDF items={list} />).toBlob();
  const url = URL.createObjectURL(blob);

  if (isDesktop()) {
    // ✅ Desktop → Print
    const win = window.open(url);
    win.onload = () => {
      win.focus();
      win.print();
    };
  } else {
    // ✅ Mobile → Download
    const link = document.createElement("a");
    link.href = url;
    link.download = `${list.name || "Item_List"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { saveAs } from "file-saver";

/**
 * Save/share a PDF that works on both Web and Android (Capacitor).
 * On web: uses file-saver's saveAs.
 * On Android: writes to cache dir then opens the native share sheet.
 */
export async function savePdfFile(pdfBytes, fileName) {
  if (Capacitor.isNativePlatform()) {
    // Convert Uint8Array to base64
    const base64 = uint8ToBase64(pdfBytes);

    // Write file to cache directory
    const result = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Cache,
    });

    // Share the file so user can open / save it
    await Share.share({
      title: fileName,
      url: result.uri,
      dialogTitle: "Save or share PDF",
    });
  } else {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, fileName);
  }
}

function uint8ToBase64(uint8Array) {
  let binary = "";
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
}

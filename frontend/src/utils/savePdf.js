import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Share } from "@capacitor/share";
import { saveAs } from "file-saver";

/**
 * Save/share a PDF that works on both Web and Native platforms (Android/iOS).
 * On web: uses file-saver's saveAs.
 * On Native: writes to Documents dir with proper permissions, then shares via native sheet.
 * Compatible with Capacitor 8.x
 */
export async function savePdfFile(pdfBytes, fileName) {
  try {
    if (Capacitor.isNativePlatform()) {
      // Ensure fileName is safe
      const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      
      // Convert Uint8Array to base64
      const base64 = uint8ToBase64(pdfBytes);

      // Write file to Documents directory (better for Android persistence)
      const result = await Filesystem.writeFile({
        path: safeFileName,
        data: base64,
        directory: Directory.Documents,
        recursive: true, // Create directories if needed
      });

      console.log('PDF saved to:', result.uri);

      // Share the file so user can save/open it
      await Share.share({
        title: 'Save PDF',
        text: `Download ${safeFileName}`,
        url: result.uri,
        dialogTitle: 'Save or Share PDF',
      });

      return { success: true, uri: result.uri };
    } else {
      // Web platform - use file-saver
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, fileName);
      return { success: true };
    }
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw new Error(`Failed to save PDF: ${error.message}`);
  }
}

/**
 * Convert Uint8Array to base64 string for Capacitor Filesystem
 * Optimized for large PDFs
 */
function uint8ToBase64(uint8Array) {
  // Use chunk processing for better performance with large files
  const CHUNK_SIZE = 0x8000; // 32KB chunks
  let binary = '';
  
  for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
    const chunk = uint8Array.subarray(i, Math.min(i + CHUNK_SIZE, uint8Array.length));
    binary += String.fromCharCode.apply(null, chunk);
  }
  
  return btoa(binary);
}

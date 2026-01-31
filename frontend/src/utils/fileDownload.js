export function openOrDownloadPDF(blob, filename = "document.pdf") {
  const url = URL.createObjectURL(blob);

  // Mobile devices → force download
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } 
  // Desktop → open in new tab (print available)
  else {
    window.open(url, "_blank");
  }

  setTimeout(() => URL.revokeObjectURL(url), 3000);
}
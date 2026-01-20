export default function PdfLayout({ children }) {
  return (
    <div className="pdf-page">
      {/* HEADER */}
      <header className="pdf-header">
        <img src="../Downloadables/roundlogo3.png" className="logo" />
        <div>
          <h2>Rahul Catering & Events</h2>
          <p>📞 9655264092 | WhatsApp 8248403710</p>
        </div>
      </header>

      {/* WATERMARK */}
      <img src="frontend/src/Downloadables/watermarkLogo.png" className="watermark" />

      {/* CONTENT */}
      <main className="pdf-content">
        {children}
      </main>

      {/* FOOTER */}
      <footer className="pdf-footer">
        <p>
          📍 Coonoor, The Nilgiris – 643105 | India
        </p>
        <p>Instagram: @rahul_catering_events</p>
      </footer>
    </div>
  );
}
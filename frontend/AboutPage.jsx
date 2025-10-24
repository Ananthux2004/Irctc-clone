// AboutPage.jsx - React component that reproduces backend/public/about.html
const { useState, useEffect } = React;

function AboutPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    // keep year current if the page persists
    setYear(new Date().getFullYear());
  }, []);

  return (
  <main className="container" role="main" aria-labelledby="aboutHeading" style={{fontFamily: 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial', lineHeight: 1.6, color: '#111', margin:0, padding:0, background:'#f7fafc'}}>
      <div style={{maxWidth:920, margin:'40px auto', background:'#fff', padding:32, borderRadius:12, boxShadow:'0 6px 30px rgba(10,10,10,0.06)'}}>
  <h1 id="aboutHeading" style={{marginTop:0, fontSize:28}}>About IRCTC</h1>
  <p><strong>IRCTC</strong> is an independent travel booking platform focused on making train travel simple, secure and transparent for travellers across India. We provide an easy-to-use interface for searching schedules, comparing fares, and purchasing train tickets — backed by secure payments and customer support.</p>

        <h2 style={{marginBottom:8, fontSize:18, color:'#0b63a3'}}>Our mission</h2>
        <p>To make rail travel frictionless by combining clear pricing, real-time availability, and helpful customer service — so travellers can plan journeys with confidence.</p>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:18, marginTop:18}} aria-label="Key highlights">
          <div style={{padding:16, borderRadius:8, background:'#e6f4ff', border:'1px solid #99ccff'}}>
            <h3>What we offer</h3>
            <ul>
              <li>Search and compare train schedules and fares</li>
              <li>Secure online ticket booking and e-tickets</li>
              <li>Booking assistance and 24/7 customer support</li>
              <li>Transparent fees — no hidden charges</li>
            </ul>
          </div>

          <div style={{padding:16, borderRadius:8, background:'#e6f4ff', border:'1px solid #99ccff'}}>
            <h3>Safety & compliance</h3>
            <p>Customer safety is our top priority. We use industry-standard encryption for payments, follow data-protection best practices, and comply with applicable laws and regulations. Our refund and cancellation policies are clearly available on every booking page.</p>
          </div>
        </div>

        <h2 style={{marginTop:18}}>How we're different</h2>
        <p>We focus on clarity and trust. Every fare and fee is shown up front, and our support team is available by phone, chat, or email to help with booking issues. We partner only with verified payment providers and travel service partners.</p>

        <h2>Transparency & partnerships</h2>
        <p>We work with certified payment processors and licensed travel partners. If you need an invoice, structured group bookings, or corporate travel solutions, our team can provide tailored support.</p>

        <h2>Contact & support</h2>
        <p>If you have questions, cancellations, or need help with a booking, contact us:</p>
        <ul>
          <li>Email: <a href="mailto:230269@tkmce.ac.in">230269@tkmce.ac.in</a></li>
          <li>Phone: +91 8547063259 (Mon–Sun, 7am–11pm IST)</li>
          <li>Support Center: <a href="/help">Help & FAQs</a></li>
        </ul>

        <div style={{marginTop:22, fontSize:13, color:'#555'}}>
          <p><strong>Important legal notice:</strong> This is an independent travel platform and is <strong>not affiliated with IRCTC</strong>. We are a separate company and operate under our own authorization and policies. Always verify ticket authenticity through official channels and your booking confirmation.</p>
        </div>

        <a href="/contact" style={{display:'inline-block', marginTop:12, padding:'10px 16px', borderRadius:8, textDecoration:'none', background:'#0b63a3', color:'#fff'}}>Contact our support team</a>

        <footer style={{marginTop:18}}>
          <small>© <span id="year">{year}</span> IRCTC</small>
        </footer>
      </div>
    </main>
  );
}

// Render the React component into the page root
const rootNode = document.getElementById('root');
if (rootNode) {
  ReactDOM.render(React.createElement(AboutPage), rootNode);
}

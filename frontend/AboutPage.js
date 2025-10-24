// AboutPage.js - same as AboutPage.jsx but using React.createElement (no JSX)
(function () {
  const e = React.createElement;

  // Reusable small components
  function Hero({ onCTAClick }) {
    return e('section', { className: 'hero fade-in show' },
      e('div', { className: 'left' },
  e('h1', null, 'About IRCTC'),
  e('p', null, 'We build fast, reliable and transparent train booking experiences for travellers.'),
        e('div', null,
          e('a', { className: 'cta', href: '/book-ticket.html', onClick: onCTAClick }, 'Book Tickets')
        )
      ),
      e('div', { className: 'right' },
        e('div', { className: 'stats' },
          e('div', { className: 'stat' }, e('div', { className: 'num' }, '120k+'), e('div', { className: 'label' }, 'Bookings')),
          e('div', { className: 'stat' }, e('div', { className: 'num' }, '2.4k'), e('div', { className: 'label' }, 'Active routes'))
        )
      )
    );
  }

  function Mission() {
    const [open, setOpen] = React.useState(true);
    return e('div', { className: 'card' },
      e('div', { className: 'collapsible', onClick: () => setOpen(s => !s) },
        e('h3', null, 'Our mission'),
        e('button', { className: 'btn-ghost' }, open ? 'Hide' : 'Show')
      ),
      e('div', { className: open ? '' : 'hidden' },
        e('p', null, 'To make rail travel frictionless by combining clear pricing, real-time availability, and helpful customer service.'),
        e('ul', null,
          e('li', null, 'Real-time seat availability'),
          e('li', null, 'Transparent pricing'),
          e('li', null, 'Fast checkout flow')
        )
      )
    );
  }

  function Team() {
    const members = [
      { name: 'Asha', role: 'Product' },
      { name: 'Ravi', role: 'Engineering' },
      { name: 'Meena', role: 'Design' }
    ];

    return e('div', { className: 'card' },
      e('h3', null, 'Team'),
      e('div', { className: 'team-list' },
        members.map(m => e('div', { className: 'team-item', key: m.name },
          e('div', { className: 'avatar' }, m.name[0]),
          e('div', null, e('strong', null, m.name), e('div', { style: { color: 'var(--muted)' } }, m.role))
        ))
      )
    );
  }

  function ContactCard() {
    const [copied, setCopied] = React.useState(false);
    function copyEmail() {
      try {
        navigator.clipboard.writeText('Patticheeeee...');
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch (e) {
        // ignore
      }
    }

    return e('div', { className: 'card' },
      e('h3', null, 'Contact & support'),
      e('div', { className: 'contact' },
        e('div', null, 'Email: ', e('a', { href: 'mailto:230269@tkmce.ac.in' }, '230269@tkmce.ac.in')), 
        e('div', null, 'Phone: +91 8547063259'),
        e('div', null, e('button', { onClick: copyEmail, className: 'btn-ghost' }, copied ? 'Copied' : 'Copy email'))
      )
    );
  }

  function AboutPage() {
    const [year] = React.useState(new Date().getFullYear());
    React.useEffect(() => {
      // simple entrance animation trigger
      document.querySelectorAll('.fade-in').forEach((el, i) => setTimeout(() => el.classList.add('show'), i * 60));
    }, []);

    return e('main', { className: 'about-wrap' },
      e(Hero, null),
      e('div', { className: 'grid' },
        e('div', null, e(Mission, null), e(Team, null)),
        e('div', null, e(ContactCard, null), e('div', { className: 'card' }, e('h3', null, 'Transparency & partnerships'), e('p', null, 'We work with certified payment processors and licensed travel partners.')))
      ),
  e('footer', { style: { textAlign: 'center', marginTop: 20, color: 'var(--muted)' } }, e('small', null, '\u00A9 ', year, ' IRCTC'))
    );
  }

  const rootNode = document.getElementById('root');
  if (rootNode) {
    ReactDOM.render(React.createElement(AboutPage), rootNode);
  }
})();

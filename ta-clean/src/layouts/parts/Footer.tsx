import { Link } from 'react-router-dom';
import { socialLinks } from './socialLinks';

const footerLinks = {
  Content: [
    { href: '/gaming', label: 'Gaming Hub' },
    { href: '/music', label: 'Music & Videos' },
    { href: '/blog', label: 'Blog' },
    { href: '/events', label: 'Events' },
  ],
  Community: [
    { href: '/og-clan', label: 'OG Clan' },
    { href: '/coaching', label: 'Coaching' },
    { href: '/merch', label: 'Merch Store' },
    { href: '/#join', label: 'Join Us' },
  ],
  Info: [
    { href: '/about', label: 'About' },
    { href: '/collabs', label: 'Collaborations' },
    { href: '/privacy', label: 'Privacy' },
    { href: '/terms', label: 'Terms' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-16">
        {/* Brand Mark */}
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-4">
            <svg viewBox="0 0 64 64" className="w-16 h-16" fill="none">
              <polygon points="32,4 60,56 4,56" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--primary)))' }} />
              <polygon points="32,60 4,8 60,8" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" opacity="0.4" />
              <circle cx="32" cy="32" r="6" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" opacity="0.7" />
              <circle cx="32" cy="32" r="2" fill="hsl(var(--primary))" />
              <line x1="32" y1="4" x2="32" y2="60" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" />
              <line x1="4" y1="32" x2="60" y2="32" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>
          <h3
            className="text-xl font-bold tracking-widest text-foreground mb-1"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            THE ALCHEMISM
          </h3>
          <p className="text-xs text-muted-foreground tracking-widest uppercase">
            Transform. Create. Transcend.
          </p>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-xs font-semibold tracking-widest uppercase text-primary mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {category}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.comingSoon ? undefined : social.href}
                target={social.comingSoon ? undefined : '_blank'}
                rel={social.comingSoon ? undefined : 'noopener noreferrer'}
                aria-label={social.comingSoon ? `${social.label} — Coming Soon` : social.label}
                title={social.comingSoon ? `${social.label} — Coming Soon` : social.label}
                onClick={social.comingSoon ? (e) => e.preventDefault() : undefined}
                className={`transition-colors duration-200 ${
                  social.comingSoon
                    ? 'text-muted-foreground/25 cursor-not-allowed'
                    : 'text-muted-foreground hover:text-primary hover:drop-shadow-[0_0_6px_hsl(var(--primary))]'
                }`}
              >
                {social.icon}
              </a>
            ))}
          </div>

          <p className="text-xs text-muted-foreground tracking-wide">
            © {currentYear} The Alchemism. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Helmet } from '@dr.pogodin/react-helmet';
import { type ReactElement } from 'react';
import { ScrollRestoration } from 'react-router-dom';

import Footer from '@/layouts/parts/Footer';
import Header from '@/layouts/parts/Header';
import Website from '@/layouts/Website';

/**
 * Root layout component that wraps all pages with consistent header and footer.
 *
 * To customize the header or footer, directly edit the Header.tsx and Footer.tsx
 * files in the layouts/parts directory.
 *
 * Site-wide <title> and <meta> live in the <Helmet> below. Individual pages can
 * override them by rendering their own <Helmet> — last-mounted wins.
 */
interface RootLayoutProps {
  children: ReactElement;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <Website>
      <Helmet>
        <title>The Alchemism — Transform. Create. Transcend.</title>
        <meta name="description" content="The Alchemism is a dark, multi-faceted creator community covering gaming, music, lifestyle coaching, streaming, and exclusive content. Join the inner circle." />
        <meta property="og:site_name" content="The Alchemism" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://ogthealchemist.com/api/og?title=The+Alchemism&description=Transform.+Create.+Transcend.+Gaming%2C+music%2C+coaching+%26+exclusive+content." />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/svg+xml" />
        {/* Twitter / X */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@TheAlchemi21261" />
        <meta name="twitter:image" content="https://ogthealchemist.com/api/og?title=The+Alchemism&description=Transform.+Create.+Transcend.+Gaming%2C+music%2C+coaching+%26+exclusive+content." />
        {/* TikTok link preview */}
        <meta property="og:video:type" content="text/html" />
        <meta name="tiktok:creator" content="@thealchemist1086" />
        {/* Kick */}
        <meta name="kick:channel" content="alchy-007" />
        {/* SoundCloud / music */}
        <meta name="music:musician" content="https://soundcloud.com/stuart-parker-179445015" />
      </Helmet>
      <ScrollRestoration />
      <Header />
      {children}
      <Footer />
    </Website>
  );
}

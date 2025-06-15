import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="description" content="Wally - AI-Powered Personalized Shopping Assistant" />
        <meta name="keywords" content="shopping, AI, assistant, personalized, recommendations, reviews" />
        <meta name="author" content="Wally Team" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Fira+Code:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/wally-logo.svg" as="image" type="image/svg+xml" />
        
        {/* OpenGraph Tags */}
        <meta property="og:title" content="Wally - AI Shopping Assistant" />
        <meta property="og:description" content="Your personal AI-powered shopping companion for smarter purchasing decisions" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:url" content="https://wally-shopping.vercel.app" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wally - AI Shopping Assistant" />
        <meta name="twitter:description" content="Your personal AI-powered shopping companion" />
        <meta name="twitter:image" content="/twitter-image.png" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Wally',
              description: 'AI-Powered Personalized Shopping Assistant',
              url: 'https://wally-shopping.vercel.app',
              applicationCategory: 'ShoppingApplication',
              operatingSystem: 'All',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </Html>
  )
}

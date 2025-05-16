'use client';

import '../../styles/tailwind-base.css';

export default function ForcedTailwindLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
} 
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout(props: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{props.children}</body>
    </html>
  );
}

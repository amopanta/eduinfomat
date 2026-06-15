import './globals.css';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{props.children}</body>
    </html>
  );
}

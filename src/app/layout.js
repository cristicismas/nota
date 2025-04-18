import "./globals.css";

export const metadata = {
  title: "Nota",
  description: "Note taking app with kanban support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ background: "var(--background)" }}>{children}</body>
    </html>
  );
}

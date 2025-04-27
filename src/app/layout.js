import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Head from "next/head";

export const metadata = {
  title: "Nota",
  description: "Note taking app with kanban support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="preconnect"
          href={`${process.env.SERVER_URL}`}
          crossOrigin="use-credentials"
        />
        <link
          rel="preload"
          href={`${process.env.SERVER_URL}/validate`}
          as="fetch"
          crossOrigin="use-credentials"
        />
      </Head>

      <body
        className={`${GeistSans.variable} ${GeistMono.variable}`}
        style={{ background: "var(--background)" }}
      >
        {children}
        <div id="modal-container" />
        <div id="context-menu" />
      </body>
    </html>
  );
}

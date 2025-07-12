import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Head from "next/head";
import GlobalProvider from "@/context/GlobalContext/Provider";

export const metadata = {
  title: "Nota",
  description: "Note taking app with kanban support",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link
          rel="preload"
          href="api/validate"
          as="fetch"
          crossOrigin="use-credentials"
        />
      </Head>

      <GlobalProvider>
        <body
          className={`${GeistSans.variable} ${GeistMono.variable}`}
          style={{ background: "var(--background)" }}
        >
          {children}
          <div id="modal-container" />
          <div id="search-container" />
          <div id="toast-container" />
          <div id="context-menu" />
        </body>
      </GlobalProvider>
    </html>
  );
}

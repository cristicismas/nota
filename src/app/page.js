"use client";
import { useState, useEffect } from "react";
// helpers
import useCookieValidation from "@/helpers/useCookieValidation";
// components
import Sidebar from "@/components/Sidebar";
import HomepageContent from "@/components/HomepageContent";
// styles
import styles from "./styles.module.css";

export default function Home() {
  const [pages, setPages] = useState([]);
  useCookieValidation();

  const [isLoading, setIsLoading] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const serverUrl = process.env.SERVER_URL;
      const response = await fetch(`${serverUrl}/pages`, {
        credentials: "include",
        cache: "no-store",
      });

      if (response.ok) {
        const pages = await response.json();
        setPages(pages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  return (
    <div className={styles.page}>
      <Sidebar />

      <HomepageContent pages={pages} />
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
// helpers
import useCookieValidation from "@/helpers/useCookieValidation";
import { useParams } from "next/navigation";
// components
import Sidebar from "@/components/Sidebar";
import PageContent from "@/components/PageContent";
// styles
import styles from "./styles.module.css";

export default function Page() {
  useCookieValidation();

  const [pageData, setPageData] = useState(null);

  const params = useParams();
  const { page } = params;

  const fetchPage = async (slug) => {
    try {
      const serverUrl = process.env.SERVER_URL;
      const res = await fetch(`${serverUrl}/pages/${slug}`, {
        credentials: "include",
      });

      if (res.ok) {
        const pageData = await res.json();
        setPageData(pageData);
      }
    } catch (err) {
      console.error("Error fetching from server: ", err);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, []);

  return (
    <div className={styles.page}>
      <Sidebar />

      <PageContent data={pageData} />
    </div>
  );
}

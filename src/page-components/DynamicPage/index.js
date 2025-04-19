"use client";
import useSWR from "swr";
// helpers
import { useParams } from "next/navigation";
// components
import Sidebar from "@/components/Sidebar";
import PageContent from "@/components/PageContent";
// styles
import styles from "./styles.module.css";

const DynamicPage = () => {
  const params = useParams();
  const { page } = params;

  const { data: pageData, isLoading } = useSWR(`pages/${page}`);

  return (
    <div className={styles.page}>
      <Sidebar />

      <PageContent data={pageData} loading={isLoading} />
    </div>
  );
};

export default DynamicPage;

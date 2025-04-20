"use client";
import { useEffect } from "react";
import useSWR from "swr";
// helpers
import { useRouter, useParams } from "next/navigation";
// components
import Sidebar from "@/components/Sidebar";
import PageContent from "@/components/PageContent";
import ErrorContent from "@/components/ErrorContent";
import SpinningLoaderPage from "@/components/SpinningLoaderPage";
// styles
import styles from "./styles.module.css";

const DynamicPage = () => {
  const params = useParams();
  const router = useRouter();
  const { page } = params;

  const { data: pageData, isLoading, error } = useSWR(`pages/${page}`);

  useEffect(() => {
    if (error?.status === 404) {
      router.push("/");
    }
  }, [error]);

  return (
    <div className={styles.page}>
      <Sidebar />

      {error?.status === 404 && <SpinningLoaderPage />}

      {error ? (
        <ErrorContent error={error} />
      ) : (
        <PageContent data={pageData} loading={isLoading} />
      )}
    </div>
  );
};

export default DynamicPage;

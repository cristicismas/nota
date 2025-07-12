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
import TabsProvider from "@/context/TabsContext/Provider";
// styles
import styles from "./styles.module.css";

const DynamicPage = () => {
  const params = useParams();
  const router = useRouter();
  const { page } = params;

  const { data: pageData, isLoading, error, mutate } = useSWR(`pages/${page}`);

  useEffect(() => {
    if (error?.status === 404) {
      router.push("/");
    }
  }, [error]);

  const onContentUpdate = (newContent) => {
    if (newContent.text_content) {
      const newTabs = pageData.tabs.map((tab) => {
        if (newContent.tab_id === tab.tab_id) {
          return {
            ...tab,
            text_content: JSON.stringify(newContent.text_content),
          };
        } else {
          return tab;
        }
      });
      mutate({ ...pageData, tabs: newTabs });
    }
  };

  return (
    <TabsProvider tabs={pageData?.tabs} slug={pageData?.slug}>
      <div className={styles.page}>
        <Sidebar />

        {error?.status === 404 ? (
          <SpinningLoaderPage />
        ) : (
          <>
            {error && <ErrorContent error={error} />}

            {!error && pageData && (
              <PageContent
                data={pageData}
                loading={isLoading}
                onContentUpdate={onContentUpdate}
              />
            )}
          </>
        )}
      </div>
    </TabsProvider>
  );
};

export default DynamicPage;

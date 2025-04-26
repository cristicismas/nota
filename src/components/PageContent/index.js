"use client";

import { useEffect, useState } from "react";
// components
import Tabs from "../Tabs";
import TabContent from "../TabContent";
import SpinningLoaderPage from "../SpinningLoaderPage";
// styles
import styles from "./styles.module.css";

const PageContent = ({ data, loading, onContentUpdate }) => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (activeTab >= data?.tabs?.length) {
      setActiveTab(data?.tabs?.length - 1);
    }
  }, [activeTab]);

  if (loading && !data) return <SpinningLoaderPage />;

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {data ? (
          <div className={styles.innerPage}>
            <Tabs
              page_id={data?.page_id}
              page_slug={data?.slug}
              tabs={data?.tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />

            <TabContent
              data={data?.tabs?.[activeTab]}
              onContentUpdate={onContentUpdate}
            />
          </div>
        ) : (
          <h1>Not found</h1>
        )}
      </div>
    </div>
  );
};

export default PageContent;

"use client";

import useSWR from "swr";
// components
import Sidebar from "@/components/Sidebar";
import HomepageContent from "@/components/HomepageContent";
import TabsProvider from "@/components/TabsContext/Provider";
// styles
import styles from "./styles.module.css";

const Homepage = () => {
  const { data: pages, isLoading } = useSWR("pages");

  return (
    <TabsProvider>
      <div className={styles.page}>
        <Sidebar />

        <HomepageContent pages={pages} loading={isLoading} />
      </div>
    </TabsProvider>
  );
};

export default Homepage;

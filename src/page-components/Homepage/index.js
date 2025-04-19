"use client";

import useSWR from "swr";
// components
import Sidebar from "@/components/Sidebar";
import HomepageContent from "@/components/HomepageContent";
// styles
import styles from "./styles.module.css";

const Homepage = () => {
  const { data: pages, isLoading } = useSWR("pages");

  return (
    <div className={styles.page}>
      <Sidebar />

      <HomepageContent pages={pages} loading={isLoading} />
    </div>
  );
};

export default Homepage;

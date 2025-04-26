"use client";

import { useState } from "react";
// components
import SimpleImage from "../SimpleImage";
import AddTabModal from "./AddTabModal";
// styles
import styles from "./styles.module.css";
import { mutate } from "swr";

const Tabs = ({ page_id, page_slug, tabs, activeTab, setActiveTab }) => {
  const [openAddTabModel, setOpenAddTabModal] = useState(false);

  if (!tabs || tabs?.length === 0) {
    return null;
  }

  const handleAddedTab = async () => {
    await mutate(`pages/${page_slug}`);
    setActiveTab(tabs.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            className={`${styles.tabButton} ${tab.tab_order === activeTab && styles.active}`}
            onClick={() => setActiveTab(tab.tab_order)}
            key={tab.tab_id}
          >
            {tab?.title}
          </button>
        ))}
      </div>

      <button
        className={styles.addTabButton}
        onClick={() => setOpenAddTabModal(true)}
      >
        <SimpleImage
          disableLazyLoad
          src={"/icons/plus.svg"}
          width={18}
          height={18}
        />
      </button>

      <AddTabModal
        page_id={page_id}
        handleClose={() => setOpenAddTabModal(false)}
        handleFinished={handleAddedTab}
        isOpen={openAddTabModel}
      />
    </div>
  );
};

export default Tabs;

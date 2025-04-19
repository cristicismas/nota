"use client";

import styles from "./styles.module.css";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  if (!tabs || tabs?.length === 0) {
    return null;
  }

  return (
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
  );
};

export default Tabs;

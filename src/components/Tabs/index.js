"use client";

import styles from "./styles.module.css";

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          className={`${styles.tabButton} ${tab.order === activeTab && styles.active}`}
          onClick={() => setActiveTab(tab.order)}
          key={tab.order}
        >
          {tab?.title}
        </button>
      ))}
    </div>
  );
};

export default Tabs;

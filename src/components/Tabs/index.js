"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import fetcher from "@/helpers/swrFetcher";
// components
import SimpleImage from "../SimpleImage";
import AddTabModal from "./AddTabModal";
import ContextMenu from "../ContextMenu";
import StyledButton from "../StyledButton";
// styles
import styles from "./styles.module.css";

const Tabs = ({ page_id, page_slug, tabs, activeTab, setActiveTab }) => {
  const [openAddTabModel, setOpenAddTabModal] = useState(false);
  const [openContextMenu, setOpenContextMenu] = useState(null);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });

  const { mutate } = useSWRConfig();

  if (!tabs || tabs?.length === 0) {
    return null;
  }

  const handleAddedTab = async () => {
    await mutate(`pages/${page_slug}`);
    setActiveTab(tabs.length);
  };

  const handleContextMenu = (e, tab) => {
    setContextPosition({ x: e.pageX, y: e.pageY });
    e.preventDefault();
    setOpenContextMenu(tab);
  };

  const handleDeleteTab = async (tab) => {
    try {
      await fetcher(`tabs/${tab.tab_id}`, { method: "DELETE" });

      if (tab.tab_order === activeTab && tabs?.length > 0) {
        setActiveTab(tab?.tab_order - 1);
      }

      await mutate(`pages/${page_slug}`);
    } catch (err) {
      console.error(err);
    }
    setOpenContextMenu(null);
  };

  const handleRenameTab = async (tab) => {};

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            onContextMenu={(e) => handleContextMenu(e, tab)}
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

      <ContextMenu
        isOpen={openContextMenu}
        handleClose={() => setOpenContextMenu(null)}
        position={contextPosition}
      >
        <StyledButton
          onClick={() => handleDeleteTab(openContextMenu)}
          className={styles.deleteTabButton}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/trash.svg"}
            width={22}
            height={22}
          />
          <span>Delete Tab</span>
        </StyledButton>

        <StyledButton
          onClick={() => handleRenameTab(openContextMenu)}
          className={styles.deleteTabButton}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/rename.svg"}
            width={22}
            height={22}
          />
          <span>Rename Tab</span>
        </StyledButton>
      </ContextMenu>
    </div>
  );
};

export default Tabs;

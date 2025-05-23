"use client";

import { useState } from "react";
import { useSWRConfig } from "swr";
import fetcher from "@/helpers/swrFetcher";
// components
import SimpleImage from "../SimpleImage";
import AddTabModal from "./AddTabModal";
import ContextMenu from "../ContextMenu";
import StyledButton from "../StyledButton";
import Tab from "./Tab";
// styles
import styles from "./styles.module.css";

const Tabs = ({ page_id, page_slug, tabs, activeTab, setActiveTab }) => {
  const [openAddTabModal, setOpenAddTabModal] = useState(false);
  const [openContextMenu, setOpenContextMenu] = useState(null);
  const [contextPosition, setContextPosition] = useState({ x: 0, y: 0 });
  const [tabToEdit, setTabToEdit] = useState(null);

  const { mutate } = useSWRConfig();

  const handleAddedTab = async () => {
    mutate("search");
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

      mutate("search");
      await mutate(`pages/${page_slug}`);

      if (tabs?.length > 0) {
        setActiveTab(Math.max(0, tab?.tab_order - 1));
      }
    } catch (err) {
      console.error(err);
    }
    setOpenContextMenu(null);
  };

  const handleRenameTab = async (tab) => {
    setTabToEdit(tab);
    setOpenContextMenu(null);
  };

  const handleRenameFinish = async (newName) => {
    await fetcher(`tabs/${tabToEdit.tab_id}/rename`, {
      method: "PUT",
      body: JSON.stringify({ title: newName }),
    });
    await mutate(`pages/${page_slug}`);
    setTabToEdit(null);
  };

  if (!tabs || tabs?.length < 1) {
    return (
      <div className={`${styles.container} ${styles.noTabsContainer}`}>
        <h1 className={styles.title}>
          You don&apos;t have any tabs added yet. Please add a new tab.
        </h1>

        <div className={styles.buttonContainer}>
          <StyledButton
            className={styles.bigAddTabButton}
            onClick={() => setOpenAddTabModal(true)}
          >
            <SimpleImage
              disableLazyLoad
              src={"/icons/plus.svg"}
              width={22}
              height={22}
            />
            <span>Add a tab</span>
          </StyledButton>
        </div>

        <AddTabModal
          page_id={page_id}
          handleClose={() => setOpenAddTabModal(false)}
          handleFinished={handleAddedTab}
          isOpen={openAddTabModal}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <Tab
            isRenaming={tabToEdit?.tab_id === tab.tab_id}
            onRenameFinish={handleRenameFinish}
            onRenameAbort={() => setTabToEdit(null)}
            key={tab.tab_id}
            tab={tab}
            handleContextMenu={handleContextMenu}
            isActive={tab.tab_order === activeTab}
            setActiveTab={setActiveTab}
          />
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
        isOpen={openAddTabModal}
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

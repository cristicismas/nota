import { useRef, useEffect } from "react";
// components
import SimpleImage from "@/components/SimpleImage";
// styles
import styles from "./styles.module.css";

const Tab = ({
  isRenaming,
  handleContextMenu,
  isActive,
  setActiveTab,
  onRenameFinish,
  onRenameAbort,
  tab,
}) => {
  const inputRef = useRef();

  const handleRename = (formData) => {
    const newTitle = formData.get("rename-input");

    onRenameFinish(newTitle);
  };

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.select();
    }
  }, [isRenaming]);

  useEffect(() => {
    const closeModalOnEsc = (e) => {
      if (e.key === "Escape") {
        onRenameAbort(false);
      }
    };

    document.addEventListener("keydown", closeModalOnEsc);

    return () => {
      document.removeEventListener("keydown", closeModalOnEsc);
    };
  }, []);

  if (isRenaming) {
    return (
      <form className={styles.form} action={handleRename}>
        <input
          defaultValue={tab.title}
          ref={inputRef}
          name="rename-input"
          title="Empty strings are not allowed in this input"
          autoComplete="off"
          pattern="^(?!\s*$).+"
          required
          className={styles.input}
          type="text"
        />

        <button type="submit" className={styles.button}>
          <SimpleImage
            disableLazyLoad
            src={"/icons/checkmark.svg"}
            width={18}
            height={18}
          />
        </button>
      </form>
    );
  }

  return (
    <button
      onContextMenu={(e) => handleContextMenu(e, tab)}
      className={`${styles.tabButton} ${isActive && styles.active}`}
      onClick={() => setActiveTab(tab.tab_order)}
    >
      {tab?.title}
    </button>
  );
};

export default Tab;

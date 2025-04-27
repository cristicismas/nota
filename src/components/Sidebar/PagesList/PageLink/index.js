import { useState } from "react";
// helpers
import fetcher from "@/helpers/swrFetcher";
// components
import StyledButton from "@/components/StyledButton";
import SimpleImage from "@/components/SimpleImage";
import RenameInput from "./RenameInput";
// styles
import styles from "./styles.module.css";

const PageLink = ({ className = "", page, onRename, onDelete }) => {
  const [isRenaming, setIsRenaming] = useState(false);

  const handleRename = async (newTitle) => {
    const res = await fetcher(`pages/${page.page_id}`, {
      method: "PUT",
      body: JSON.stringify({ pageTitle: newTitle }),
    });

    try {
      const newSlug = JSON.parse(res.data).newSlug;

      await onRename(page.page_id, newTitle, newSlug);
    } catch (err) {
      console.error(err);
    }

    setIsRenaming(false);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {isRenaming ? (
        <RenameInput
          onSubmit={handleRename}
          onAbort={() => setIsRenaming(false)}
          defaultValue={page.page_title}
        />
      ) : (
        <div className={styles.pageLinkContainer}>
          <StyledButton className={styles.pageLink} href={`/${page.slug}`}>
            {page.page_title}
          </StyledButton>

          <div className={styles.buttons}>
            <button
              onClick={() => setIsRenaming(true)}
              className={styles.button}
            >
              <SimpleImage
                disableLazyLoad
                src={"/icons/rename.svg"}
                width={24}
                height={24}
              />
            </button>

            <button onClick={() => onDelete(page)} className={styles.button}>
              <SimpleImage
                disableLazyLoad
                src={"/icons/close.svg"}
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageLink;

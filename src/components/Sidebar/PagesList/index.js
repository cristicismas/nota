import { useState } from "react";
// helpers
import useSWR from "swr";
import { useSWRConfig } from "swr";
import fetcher from "@/helpers/swrFetcher";
// styles
import styles from "./styles.module.css";
// components
import StyledButton from "@/components/StyledButton";
import SimpleImage from "@/components/SimpleImage";
import PageCreationInput from "./PageCreationInput";
import Modal from "@/components/Modal";

const PagesList = () => {
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const { mutate } = useSWRConfig();

  const { data: pages } = useSWR("pages");

  const deletePage = async (pageId) => {
    await fetcher(`pages/${pageId}`, { method: "DELETE" });
    setPageToDelete(null);

    mutate((key) => {
      if (key === "pages") return true;
      if (key.startsWith("pages/")) return true;

      return false;
    });
  };

  return (
    <div className={styles.links}>
      {pages &&
        pages.map((page) => (
          <div className={styles.pageLinkContainer} key={page.slug}>
            <StyledButton className={styles.pageLink} href={`/${page.slug}`}>
              {page.page_title}
            </StyledButton>

            <button
              onClick={() => setPageToDelete(page)}
              className={styles.deletePageButton}
            >
              <SimpleImage
                disableLazyLoad
                src={"/icons/close.svg"}
                width={24}
                height={24}
              />
            </button>
          </div>
        ))}

      {pageToDelete && (
        <Modal
          isOpen={pageToDelete}
          setIsOpen={() => setPageToDelete(null)}
          overlayClassName={styles.overlay}
          className={styles.innerOverlay}
          shouldCloseOnEsc
          disableScroll
          container="modal-container"
        >
          <div className={styles.deletePageContainer}>
            <div className={styles.modalTitle}>
              Are you sure you want to delete "{pageToDelete.page_title}" ?
            </div>
            <div className={styles.buttons}>
              <button
                className={styles.abort}
                onClick={() => setPageToDelete(null)}
              >
                Abort
              </button>
              <button
                className={styles.delete}
                onClick={() => deletePage(pageToDelete.page_id)}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isCreatingPage && (
        <PageCreationInput
          abort={() => setIsCreatingPage(false)}
          onFinished={() => setIsCreatingPage(false)}
        />
      )}

      <StyledButton
        className={styles.addPage}
        onClick={() => setIsCreatingPage(true)}
      >
        <SimpleImage
          disableLazyLoad
          src={"/icons/plus.svg"}
          width={18}
          height={18}
        />
        <span>Add page</span>
      </StyledButton>
    </div>
  );
};

export default PagesList;

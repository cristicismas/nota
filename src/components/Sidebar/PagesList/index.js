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
import DeletePageModal from "./DeletePageModal";

const PagesList = () => {
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const { mutate } = useSWRConfig();

  const { data: pages } = useSWR("pages");

  const deletePage = async (pageId) => {
    await fetcher(`pages/${pageId}`, { method: "DELETE" });
    setPageToDelete(null);

    mutate((key) => {
      if (!key) return true;
      if (key === "pages") return true;
      if (key?.startsWith("pages/")) return true;

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

      <DeletePageModal
        isOpen={pageToDelete}
        handleClose={() => setPageToDelete(null)}
        handleDelete={() => deletePage(pageToDelete.page_id)}
        pageTitle={pageToDelete?.page_title}
      />

      {isCreatingPage && (
        <PageCreationInput
          abort={() => setIsCreatingPage(false)}
          onFinished={() => setIsCreatingPage(false)}
          currentPages={pages}
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

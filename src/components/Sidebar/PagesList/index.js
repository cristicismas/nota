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
import PageLink from "./PageLink";
import DeleteConfirmation from "@/components/DeleteConfirmation";

const PagesList = () => {
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [pageToDelete, setPageToDelete] = useState(null);

  const { mutate } = useSWRConfig();

  const { data: pages, mutate: mutatePages } = useSWR("pages");

  const deletePage = async (pageId) => {
    await fetcher(`pages/${pageId}`, { method: "DELETE" });
    setPageToDelete(null);

    mutate((key) => {
      if (!key) return true;
      if (key === "pages") return true;
      if (key === "search") return true;
      if (key?.startsWith("pages/")) return true;

      return false;
    });
  };

  const handlePageRename = async (pageId, newTitle, newSlug) => {
    const updatedPages = pages.map((page) => {
      if (page.page_id === pageId) {
        return { ...page, page_title: newTitle, slug: newSlug };
      }
      return page;
    });

    await mutatePages(updatedPages, { optimisticData: updatedPages });
  };

  return (
    <div className={styles.links}>
      {pages &&
        pages.map((page) => (
          <PageLink
            page={page}
            key={page.page_id}
            onDelete={setPageToDelete}
            onRename={handlePageRename}
          />
        ))}

      <DeleteConfirmation
        isOpen={pageToDelete}
        handleClose={() => setPageToDelete(null)}
        handleDelete={() => deletePage(pageToDelete.page_id)}
        title={`Are you sure you want to delete "${pageToDelete?.page_title}"?`}
      />

      {isCreatingPage ? (
        <PageCreationInput
          abort={() => setIsCreatingPage(false)}
          onFinished={() => setIsCreatingPage(false)}
          currentPages={pages}
        />
      ) : (
        <StyledButton
          className={styles.addPage}
          onClick={() => {
            setIsCreatingPage(true);
          }}
        >
          <SimpleImage
            disableLazyLoad
            src={"/icons/plus.svg"}
            width={18}
            height={18}
          />
          <span>Add page</span>
        </StyledButton>
      )}
    </div>
  );
};

export default PagesList;

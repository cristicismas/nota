import { useState } from "react";
// helpers
import useSWR from "swr";
import fetcher from "@/helpers/swrFetcher";
// styles
import styles from "./styles.module.css";
// components
import StyledButton from "@/components/StyledButton";
import SimpleImage from "@/components/SimpleImage";
import PageCreationInput from "./PageCreationInput";

const PagesList = () => {
  const [isCreatingPage, setIsCreatingPage] = useState(false);

  const { data: pages, mutate } = useSWR("pages");

  const addPage = async (pageTitle) => {
    const newPage = await fetcher("page", {
      method: "POST",
      body: JSON.stringify({ pageTitle }),
    });

    mutate([...pages, newPage]);
    setIsCreatingPage(false);
  };

  return (
    <div className={styles.links}>
      {pages &&
        pages.map((page) => (
          <StyledButton key={page.slug} href={`/${page.slug}`}>
            {page.page_title}
          </StyledButton>
        ))}

      {isCreatingPage && (
        <PageCreationInput
          addPage={addPage}
          abort={() => setIsCreatingPage(false)}
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

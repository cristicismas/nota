import { useRouter } from "next/navigation";
import { useState } from "react";
import PageCreationInput from "../Sidebar/PagesList/PageCreationInput";
import SpinningLoaderPage from "../SpinningLoaderPage";
import StyledButton from "../StyledButton";
import styles from "./styles.module.css";

const HomepageContent = ({ pages = [], loading }) => {
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  if (loading || isRedirecting) {
    return <SpinningLoaderPage />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        {pages?.length === 0 ? (
          <div className={styles.title}>No pages created yet.</div>
        ) : (
          <div className={styles.title}>My Pages:</div>
        )}

        {pages?.length > 0 && (
          <div className={styles.pages}>
            {pages.map((page, index) => (
              <StyledButton
                key={index}
                href={page.slug}
                className={styles.link}
              >
                {page.page_title}
              </StyledButton>
            ))}
          </div>
        )}

        {pages?.length === 0 && !isCreatingPage && (
          <StyledButton
            onClick={() => setIsCreatingPage(true)}
            className={styles.createPageButton}
          >
            Create a page
          </StyledButton>
        )}

        {isCreatingPage && (
          <PageCreationInput
            abort={() => setIsCreatingPage(false)}
            onFinished={(newPage) => {
              setIsRedirecting(true);
              setIsCreatingPage(false);
              router.push(newPage.slug);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default HomepageContent;

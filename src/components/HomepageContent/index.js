import SpinningLoaderPage from "../SpinningLoaderPage";
import StyledLink from "../StyledLink";
import styles from "./styles.module.css";

const HomepageContent = ({ pages, loading }) => {
  if (loading) {
    return <SpinningLoaderPage />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.title}>My Pages:</div>

        <div className={styles.pages}>
          {pages?.map((page, index) => (
            <StyledLink key={index} href={page?.slug} className={styles.link}>
              {page?.title}
            </StyledLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomepageContent;

import StyledLink from "../StyledLink";
import styles from "./styles.module.css";

const HomepageContent = ({ pages }) => {
  return (
    <div className={styles.container}>
      {pages === null ? (
        <div className={styles.error}>
          Error fetching pages. Check your console.
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default HomepageContent;

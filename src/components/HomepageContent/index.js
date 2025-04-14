import StyledLink from "../StyledLink";
import styles from "./styles.module.css";

const fetchPages = async () => {
  try {
    const serverUrl = process.env.SERVER_URL;
    const response = await fetch(`${serverUrl}/pages`).then((res) => {
      if (res.status !== 200) {
        return null;
      } else {
        return res.json();
      }
    });

    return response;
  } catch (err) {
    console.error("Error fetching from server: ", err);
    return null;
  }
};

const HomepageContent = async () => {
  const pages = await fetchPages();
  console.log(pages);

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

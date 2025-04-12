import Markdown from "react-markdown";
import styles from "./styles.module.css";

const TextContent = ({ data }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data?.title}</h1>

      <div className={styles.markdown}>
        <Markdown>{data?.text}</Markdown>
      </div>
    </div>
  );
};

export default TextContent;

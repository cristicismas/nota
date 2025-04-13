import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

import styles from "./styles.module.css";

const TextContent = ({ data }) => {
  const editor = useCreateBlockNote({});

  console.log(editor.document);
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data?.title}</h1>

      <div className={styles.markdown}>
        <BlockNoteView editor={editor} />
      </div>
    </div>
  );
};

export default TextContent;

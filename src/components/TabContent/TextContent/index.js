import styles from "./styles.module.css";
import { useState, useEffect, useRef, useTransition } from "react";
import fetcher from "@/helpers/swrFetcher";
import RichTextEditor from "@/components/RichTextEditor";

const TextContent = ({ data, onContentUpdate }) => {
  const initialEditorValue = useRef(data?.text_content);
  const upToDateEditorValue = useRef(data?.text_content);
  const [editorValue, setEditorValue] = useState(data?.text_content);
  // TODO: try to get rid of useTransition, it doesn't really make sense here
  const [_isPending, startTransition] = useTransition();
  // Keep count of the latest generation and send it to the server, in case it
  // receives the requests out-of-order, it can know which was the last change
  const editGeneration = useRef(data.generation || 0);

  const updateTabContent = async () => {
    if (editGeneration.current <= data.generation) return;

    try {
      await fetcher(`tabs/${data?.tab_id}`, {
        method: "PUT",
        body: JSON.stringify({
          tab_type: data.tab_type,
          text_content: upToDateEditorValue.current,
          generation: editGeneration.current,
        }),
      });
    } catch (err) {
      if (err.status === 409) {
        console.info("Got an out of order error");
      } else {
        console.error(err);
      }
    }

    if (upToDateEditorValue.current !== data?.text_content) {
      onContentUpdate({
        tab_id: data.tab_id,
        text_content: JSON.parse(upToDateEditorValue.current),
      });
    }
  };

  useEffect(() => {
    if (data.generation >= editGeneration.current) {
      editGeneration.current = data.generation;
    }

    setEditorValue(data.text_content);

    return async () => {
      await updateTabContent();
    };
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (initialEditorValue.current !== editorValue) {
        updateTabContent();
      }
    }, 200);

    return () => {
      updateTabContent();
      clearTimeout(debounce);
    };
  }, [editorValue]);

  if (!data.text_content) {
    console.error(
      "data.text_content is null but this will crash the Slate editor",
    );
    return null;
  }

  const onChange = (value) => {
    startTransition(() => {
      editGeneration.current += 1;
      setEditorValue(value);
      upToDateEditorValue.current = value;
    });
  };

  return (
    <div className={styles.container}>
      <RichTextEditor data={data} onChange={onChange} />
    </div>
  );
};

export default TextContent;

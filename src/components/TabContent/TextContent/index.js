import styles from "./styles.module.css";
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useTransition,
} from "react";
import {
  createEditor,
  Editor,
  Element as SlateElement,
  Node as SlateNode,
} from "slate";
import withShortcuts from "./withShortcuts";
import { withHistory } from "slate-history";
import SHORTCUTS from "./shortcuts";
import { Slate, ReactEditor, Editable, withReact } from "slate-react";
import ElementRenderer from "./ElementRenderer";
import fetcher from "@/helpers/swrFetcher";

const TextContent = ({ data, onContentUpdate }) => {
  const initialEditorValue = useRef(data?.text_content);
  const upToDateEditorValue = useRef(data?.text_content);
  const [editorValue, setEditorValue] = useState(data?.text_content);
  const [_isPending, startTransition] = useTransition();
  // Keep count of the latest generation and send it to the server, in case it
  // receives the requests out-of-order, it can know which was the last change
  const editGeneration = useRef(data.generation || 0);

  const renderElement = useCallback(
    (props) => <ElementRenderer {...props} />,
    [],
  );

  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    [],
  );

  const handleDOMBeforeInput = useCallback(
    (_e) => {
      queueMicrotask(() => {
        const pendingDiffs = ReactEditor.androidPendingDiffs(editor);
        const scheduleFlush = pendingDiffs?.some(({ diff, path }) => {
          if (!diff.text.endsWith(" ")) {
            return false;
          }
          const { text } = SlateNode.leaf(editor, path);
          const beforeText = text.slice(0, diff.start) + diff.text.slice(0, -1);
          if (!(beforeText in SHORTCUTS)) {
            return;
          }
          const blockEntry = Editor.above(editor, {
            at: path,
            match: (n) =>
              SlateElement.isElement(n) && Editor.isBlock(editor, n),
          });
          if (!blockEntry) {
            return false;
          }
          const [, blockPath] = blockEntry;
          return Editor.isStart(editor, Editor.start(editor, path), blockPath);
        });
        if (scheduleFlush) {
          ReactEditor.androidScheduleFlush(editor);
        }
      });
    },
    [editor],
  );

  const updateTabContent = async () => {
    await fetcher(`tabs/${data?.tab_id}`, {
      method: "PUT",
      body: JSON.stringify({
        tab_type: data.tab_type,
        text_content: upToDateEditorValue.current,
        generation: editGeneration.current,
      }),
    });
    onContentUpdate({
      tab_id: data.tab_id,
      text_content: JSON.parse(upToDateEditorValue.current),
    });
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
    }, 500);

    return () => clearTimeout(debounce);
  }, [editorValue]);

  if (!data.text_content) {
    console.error(
      "data.text_content is null but this will crash the Slate editor",
    );
    return null;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{data?.title}</h1>

      <div className={styles.markdown}>
        <Slate
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => "set_selection" !== op.type,
            );
            if (isAstChange) {
              // Save the value to Local Storage.
              const content = JSON.stringify(value);

              startTransition(() => {
                editGeneration.current += 1;
                setEditorValue(content);
                upToDateEditorValue.current = content;
              });
            }
          }}
          editor={editor}
          initialValue={JSON.parse(data?.text_content)}
        >
          <Editable
            onBeforeInput={handleDOMBeforeInput}
            renderElement={renderElement}
            placeholder="Write your text here..."
            autoFocus
          />
        </Slate>
      </div>
    </div>
  );
};

export default TextContent;

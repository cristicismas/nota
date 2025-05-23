import styles from "./styles.module.css";
import { useMemo, useCallback } from "react";
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

const RichTextEditor = ({ data, onChange, className = "" }) => {
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

  if (!data.text_content) {
    console.error(
      "data.text_content is null but this will crash the Slate editor",
    );
    return null;
  }

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={`${styles.markdown} markdown`}>
        <Slate
          onChange={(value) => {
            const isAstChange = editor.operations.some(
              (op) => "set_selection" !== op.type,
            );
            if (isAstChange) {
              // Save the value to Local Storage.
              const content = JSON.stringify(value);
              onChange(content);
            }
          }}
          editor={editor}
          initialValue={JSON.parse(data?.text_content)}
        >
          <Editable
            onBeforeInput={handleDOMBeforeInput}
            renderElement={renderElement}
            placeholder="Write your text here..."
          />
        </Slate>
      </div>
    </div>
  );
};

export default RichTextEditor;

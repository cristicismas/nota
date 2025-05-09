import { useState, useRef, useEffect } from "react";
import useOutsideClick from "@/helpers/useOutsideClick";
import styles from "./styles.module.css";

const EditField = ({ onExit, onUpdate, defaultValue, generation }) => {
  const [editValue, setEditValue] = useState(defaultValue);
  const upToDateEditorValue = useRef(defaultValue);
  const formRef = useRef();
  const textareaRef = useRef();
  const editGeneration = useRef(generation || 0);

  const handleUpdate = async () => {
    if (editGeneration.current <= generation) return;
    await onUpdate(upToDateEditorValue.current, editGeneration.current);
  };

  useOutsideClick(formRef, async () => {
    await handleUpdate();
    onExit();
  }, [generation]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.select();
    }
  }, []);

  useEffect(() => {
    const closeListener = async (e) => {
      if (e.key === "Escape" || e.key === "Enter") {
        await handleUpdate();
        onExit();
      }
    };

    document.addEventListener("keydown", closeListener);

    return () => {
      document.removeEventListener("keydown", closeListener);
    };
  }, [generation]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      handleUpdate();
    }, 100);

    return () => {
      clearTimeout(debounce);
    };
  }, [editValue]);

  const handleInputChange = (e) => {
    if (e.target.value.includes("\n")) return;
    upToDateEditorValue.current = e.target.value;
    editGeneration.current += 1;
    setEditValue(e.target.value);
  };

  return (
    <div ref={formRef} className={styles.container}>
      <textarea
        ref={textareaRef}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        onChange={handleInputChange}
        className={styles.textArea}
        value={editValue}
        autoFocus
      />
    </div>
  );
};

export default EditField;

import { useEffect, useState } from "react";
import { ToastContext } from "./Context";
import { v4 as uuidv4 } from "uuid";
import styles from "./styles.module.css";

const MESSAGE_TYPE = {
  NORMAL: "normal",
  ERROR: "error",
};

const MESSAGE_TIME = 3000;

const Toast = ({ message }) => {
  return (
    <div
      className={`${styles.message} ${message.type === MESSAGE_TYPE.ERROR ? styles.error : ""}`}
    >
      {message.text}
    </div>
  );
};

const ToastProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const pushMessage = (message, type = MESSAGE_TYPE.NORMAL) => {
    const id = uuidv4();
    const timeout = setTimeout(() => {
      setMessages((messages) => messages.filter((m) => m.id !== id));
    }, MESSAGE_TIME);

    setMessages([...messages, { text: message, type, id, timeout }]);
  };

  useEffect(() => {
    return () => {
      messages.forEach((m) => clearTimeout(m.timeout));
    };
  }, []);

  return (
    <ToastContext value={{ pushMessage }}>
      {children}
      {messages.map((message) => (
        <Toast key={message.id} message={message} />
      ))}
    </ToastContext>
  );
};

export default ToastProvider;

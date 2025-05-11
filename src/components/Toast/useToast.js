import { ToastContext } from "./Context";
import { useContext } from "react";

const useToast = () => {
  const { pushMessage } = useContext(ToastContext);
  return pushMessage;
};

export default useToast;

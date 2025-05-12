import { TabsContext } from "./Context";
import { useContext } from "react";

const useTabs = () => {
  const contextValues = useContext(TabsContext);
  return contextValues;
};

export default useTabs;

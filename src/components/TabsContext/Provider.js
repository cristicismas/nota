import { useState, useEffect } from "react";
import { TabsContext } from "./Context";

const getCachedActiveTab = (slug) => {
  if (typeof localStorage === "undefined" || !slug) return 0;

  const cachedTab = Number(localStorage.getItem(slug));

  if (!isNaN(cachedTab)) {
    return cachedTab;
  }

  return 0;
};

const TabsProvider = ({ children, tabs, slug }) => {
  const [activeTab, setActiveTab] = useState(() => getCachedActiveTab(slug));

  useEffect(() => {
    try {
      localStorage.setItem(slug, activeTab);
    } catch (err) {
      localStorage.clear();
    }
  }, [activeTab]);

  useEffect(() => {
    setActiveTab(getCachedActiveTab(slug));
  }, [slug]);

  return (
    <TabsContext.Provider value={{ tabs, activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  );
};

export default TabsProvider;

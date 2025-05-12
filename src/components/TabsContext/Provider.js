import { useState, useEffect } from "react";
import { TabsContext } from "./Context";

const getCachedActiveTab = (slug) => {
  if (typeof localStorage === "undefined" || !slug) return null;

  const cachedTab = Number(localStorage.getItem(slug));

  if (!isNaN(cachedTab)) {
    return cachedTab;
  }

  return 0;
};

const TabsProvider = ({ children, tabs, slug }) => {
  const [activeTab, setActiveTab] = useState(null);

  useEffect(() => {
    setActiveTab(getCachedActiveTab(slug));
  }, [slug]);

  const handleSetTab = (newActiveTab, pageSlug = slug) => {
    try {
      localStorage.setItem(pageSlug, newActiveTab);
    } catch (err) {
      localStorage.clear();
    }

    if (pageSlug === slug) {
      setActiveTab(newActiveTab);
    }
  };

  return (
    <TabsContext.Provider
      value={{ tabs, activeTab, setActiveTab: handleSetTab }}
    >
      {children}
    </TabsContext.Provider>
  );
};

export default TabsProvider;

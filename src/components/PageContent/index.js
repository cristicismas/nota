// components
import Tabs from "../Tabs";
import TabContent from "../TabContent";
import SpinningLoaderPage from "../SpinningLoaderPage";
// styles
import styles from "./styles.module.css";
import useTabs from "../TabsContext";

const PageContent = ({ data, loading, onContentUpdate }) => {
  const { tabs, activeTab, setActiveTab } = useTabs();

  const onTabDelete = (tab_id) => {
    let deleted_tab_index = 0;

    tabs?.forEach((tab, index) => {
      if (tab.tab_id === tab_id) {
        deleted_tab_index = index;
      }
    });

    if (tabs?.length > 0) {
      setActiveTab(Math.min(0, deleted_tab_index - 1));
    }
  };

  if (loading && !data) return <SpinningLoaderPage />;

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.container}>
        {data ? (
          <div className={styles.innerPage}>
            <div className={styles.title}>{data?.page_title}</div>

            <div className={styles.flexContainer}>
              <Tabs
                page_id={data?.page_id}
                page_slug={data?.slug}
                tabs={tabs}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />

              <TabContent
                key={activeTab}
                data={tabs?.[activeTab]}
                onTabDelete={onTabDelete}
                onContentUpdate={onContentUpdate}
              />
            </div>
          </div>
        ) : (
          <h1>Not found</h1>
        )}
      </div>
    </div>
  );
};

export default PageContent;

"use client";

import TextContent from "./TextContent";
import KanbanContent from "./KanbanContent";
import styles from "./styles.module.css";

const PAGE_TYPE = {
  TEXT: 0,
  KANBAN: 1,
};

const TabContent = ({ data }) => {
  console.log(data);
  if (data?.type === PAGE_TYPE.TEXT) {
    return <TextContent data={data} />;
  } else if (data?.type === PAGE_TYPE.KANBAN) {
    return <KanbanContent data={data} />;
  } else {
    console.error("Unknown content type: ", data?.type);
    return null;
  }
};

export default TabContent;

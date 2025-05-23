"use client";

import TextContent from "./TextContent";
import KanbanContent from "./KanbanContent";

const TabContent = ({ data, onContentUpdate }) => {
  if (!data) return null;

  if (data?.tab_type === "text") {
    return <TextContent data={data} onContentUpdate={onContentUpdate} />;
  } else if (data?.tab_type === "kanban") {
    return <KanbanContent tab_id={data.tab_id} />;
  } else {
    console.error("Unknown content type: ", data?.tab_type);
    return null;
  }
};

export default TabContent;

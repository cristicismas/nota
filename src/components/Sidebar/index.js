import Link from "next/link";
import styles from "./styles.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>Nota</h1>

      <div className={styles.links}>
        <Link href="/project-1">Project 1</Link>
        <Link href="/project-2">Project 2</Link>
        <Link href="/project-3">Project 3</Link>
      </div>
    </aside>
  );
};

export default Sidebar;

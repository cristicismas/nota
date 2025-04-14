import Link from "next/link";
import StyledLink from "../StyledLink";
import styles from "./styles.module.css";

const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>
        <Link href="/">Nota</Link>
      </h1>

      <div className={styles.links}>
        <StyledLink href="/project-1">Project 1</StyledLink>
        <StyledLink href="/project-2">Project 2</StyledLink>
        <StyledLink href="/project-3">Project 3</StyledLink>
      </div>
    </aside>
  );
};

export default Sidebar;

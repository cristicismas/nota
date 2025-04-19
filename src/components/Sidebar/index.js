import { useRouter } from "next/navigation";
// components
import Link from "next/link";
import StyledLink from "../StyledLink";
import SimpleImage from "../SimpleImage";
// styles
import styles from "./styles.module.css";
import fetcher from "@/helpers/swrFetcher";

const Sidebar = () => {
  const router = useRouter();
  const logOut = async () => {
    try {
      await fetcher("logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className={styles.stickyBar}>
        <button onClick={logOut} className={styles.logOut}>
          <SimpleImage
            disableLazyLoad
            src={"/icons/log-out.svg"}
            width={24}
            height={24}
          />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

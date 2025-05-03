import { useRouter } from "next/navigation";
import fetcher from "@/helpers/swrFetcher";
// components
import Link from "next/link";
import PagesList from "./PagesList";
import SimpleImage from "@/components/SimpleImage";
// styles
import styles from "./styles.module.css";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const router = useRouter();

  const logOut = async () => {
    try {
      await fetcher("logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleSidebar = () => {
    if (isOpen) {
      document.body.style.setProperty("--sidebar-width", "80px");
    } else {
      document.body.style.setProperty("--sidebar-width", "350px");
    }

    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${styles.sidebarContainer} ${isOpen ? styles.open : styles.closed}`}
    >
      <aside className={styles.sidebar}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>
            <Link href="/">Nota</Link>
          </h1>

          <button className={styles.toggleSidebar} onClick={toggleSidebar}>
            {isOpen ? (
              <SimpleImage
                disableLazyLoad
                src={"/icons/sidebar_close.svg"}
                width={32}
                height={32}
              />
            ) : (
              <SimpleImage
                disableLazyLoad
                src={"/icons/sidebar_open.svg"}
                width={32}
                height={32}
              />
            )}
          </button>
        </div>

        <div className={styles.pagesList}>
          <PagesList />
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
    </div>
  );
};

export default Sidebar;

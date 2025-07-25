"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import fetcher from "@/helpers/swrFetcher";
// components
import { GlobalContext } from "@/context/GlobalContext/Context";
import Link from "next/link";
import PagesList from "./PagesList";
import SimpleImage from "@/components/SimpleImage";
import Search from "../Search";
import SearchButton from "../SearchButton";
// styles
import styles from "./styles.module.css";

const Sidebar = () => {
  const { sidebarOpen, toggleSidebar } = useContext(GlobalContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    <>
      <div
        className={`${styles.sidebarContainer} ${sidebarOpen ? styles.open : styles.closed}`}
      >
        <aside className={styles.sidebar}>
          <div className={styles.topBar}>
            <h1 className={styles.title}>
              <Link href="/">Nota</Link>
            </h1>

            <button className={styles.toggleSidebar} onClick={toggleSidebar}>
              {sidebarOpen ? (
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

          <SearchButton
            setOpenSearch={() => setIsSearchOpen(true)}
            className={styles.searchButton}
          />

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

      <div className={styles.sidebarWidthPlaceholder} />

      <Search open={isSearchOpen} setOpen={setIsSearchOpen} />
    </>
  );
};

export default Sidebar;

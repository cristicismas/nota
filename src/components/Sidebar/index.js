import { useRouter } from "next/navigation";
import fetcher from "@/helpers/swrFetcher";
// components
import Link from "next/link";
import PagesList from "./PagesList";
import SimpleImage from "@/components/SimpleImage";
// styles
import styles from "./styles.module.css";

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

      <PagesList />

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

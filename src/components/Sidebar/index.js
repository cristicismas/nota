import { useRouter } from "next/navigation";
import useSWR from "swr";
// components
import Link from "next/link";
import StyledButton from "../StyledButton";
import SimpleImage from "../SimpleImage";
// styles
import styles from "./styles.module.css";
import fetcher from "@/helpers/swrFetcher";

const Sidebar = () => {
  const router = useRouter();

  const { data: pages, mutate } = useSWR("pages");

  const logOut = async () => {
    try {
      await fetcher("logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const addPage = async () => {
    const newPage = await fetcher("page", {
      method: "POST",
      body: JSON.stringify({ pageTitle: "Test Page" }),
    });

    mutate([...pages, newPage]);
  };

  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>
        <Link href="/">Nota</Link>
      </h1>

      <div className={styles.links}>
        {pages &&
          pages.map((page) => (
            <StyledButton key={page.slug} href={`/${page.slug}`}>
              {page.page_title}
            </StyledButton>
          ))}

        <StyledButton className={styles.addPage} onClick={addPage}>
          <SimpleImage
            disableLazyLoad
            src={"/icons/plus.svg"}
            width={18}
            height={18}
          />
          <span>Add page</span>
        </StyledButton>
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

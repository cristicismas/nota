import Sidebar from "@/components/Sidebar";
import HomepageContent from "@/components/HomepageContent";
import styles from "./styles.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <Sidebar />

      <HomepageContent />
    </div>
  );
}

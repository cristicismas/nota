import Sidebar from "@/components/Sidebar";
import PageContent from "@/components/PageContent";
import styles from "./styles.module.css";

const fetchPage = async (slug) => {
  try {
    const serverUrl = process.env.SERVER_URL;
    const response = await fetch(`${serverUrl}/pages/${slug}`).then((res) => {
      if (res.status !== 200) {
        return null;
      } else {
        return res.json();
      }
    });

    return response;
  } catch (err) {
    console.error("Error fetching from server: ", err);
  }
};

export default async function Page({ params }) {
  const { page } = await params;
  const pageData = await fetchPage(page);

  return (
    <div className={styles.page}>
      <Sidebar />

      <PageContent data={pageData} />
    </div>
  );
}

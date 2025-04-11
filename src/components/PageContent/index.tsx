import { createEffect, createSignal, type Component } from 'solid-js';
import { useParams } from '@solidjs/router';
import styles from './styles.module.css';

const fetchPage = async (slug: string): Promise<string> => {
  const serverUrl = import.meta.env.VITE_SERVER_URL
  console.log(`${serverUrl}/pages/${slug}`)
  const response = await fetch(`${serverUrl}/pages/${slug}`).then(res => res.text())
  return response as string
}

const PageContent: Component = () => {
  const params = useParams(); // Retrieve the dynamic route parameters
  const [pageData, setPageData] = createSignal('')

  createEffect(() => {
    const pageSlug = params?.page
    fetchPage(pageSlug).then((res) => setPageData(res))
  })

  createEffect(() => {
    console.log("page data: ", pageData())
  })

  return <div class={styles.container}>{params?.page}</div>;
};

export default PageContent;

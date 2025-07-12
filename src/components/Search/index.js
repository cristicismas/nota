import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Overlay from "../Overlay";
import { useRouter } from "next/navigation";
import SimpleImage from "../SimpleImage";
import useSWR from "swr";
import fetcher from "@/helpers/swrFetcher";
import useTabs from "@/context/TabsContext";

const isInQuery = (query, value) => {
  if (query?.trim() === "") return true;

  const strippedQuery = query?.trim()?.toLowerCase()?.replaceAll(" ", "");

  const strippedValue = value?.trim()?.toLowerCase()?.replaceAll(" ", "");

  return strippedValue?.startsWith(strippedQuery);
};

const MAX_SEARCH_RESULTS = 12;

const Search = ({ open, setOpen }) => {
  const { data: searchSpace } = useSWR("search");
  const [searchValue, setSearchValue] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();
  const { setActiveTab } = useTabs();

  useEffect(() => {
    if (!open) {
      setSearchValue("");
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const submitListener = async (e) => {
      if (e.key === "Enter" && results?.[0]) {
        goToResult(results[0]);
      }
    };

    document.addEventListener("keydown", submitListener);

    return () => {
      document.removeEventListener("keydown", submitListener);
    };
  }, [open, results]);

  useEffect(() => {
    if (!searchSpace || !open) return;

    const debounce = setTimeout(() => {
      const searchResults = searchSpace?.filter((potentialResult) => {
        const inQuery = isInQuery(searchValue, potentialResult.text);
        return inQuery;
      });

      setResults(searchResults.slice(0, MAX_SEARCH_RESULTS));
    }, 50);

    return () => clearTimeout(debounce);
  }, [open, searchSpace, searchValue]);

  const goToResult = async (result) => {
    if (result.type === "page") {
      router.push(result.slug);
      setActiveTab(0, result.slug);
    } else {
      const { slug, tab_order } = await fetcher(`tabs/${result.tab_id}/slug`);
      router.push(slug);
      setActiveTab(tab_order, slug);
    }

    setOpen(false);
  };

  return (
    <Overlay
      mountPoint="search-container"
      containerClassName={styles.overlayContainer}
      className={styles.overlay}
      isOpen={open}
      handleClose={() => setOpen(false)}
    >
      <div className={styles.flex}>
        <div className={styles.container}>
          <input
            className={styles.searchBar}
            autoFocus
            placeholder="Type anything to search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <SimpleImage
            disableLazyLoad
            className={styles.searchIcon}
            src={"/icons/search.svg"}
            width={24}
            height={24}
          />
        </div>

        <div className={styles.resultsContainer}>
          {results.map((result, index) => (
            <div className={styles.resultContainer} key={index}>
              <button
                className={styles.result}
                onClick={() => goToResult(result)}
              >
                <div className={styles.title}>
                  <span>{result.text}</span>
                  {result?.page_title && (
                    <span className={styles.pageTitle}>
                      {result?.page_title}
                    </span>
                  )}
                </div>
                <span className={styles.type}>{result?.type}</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
};

export default Search;

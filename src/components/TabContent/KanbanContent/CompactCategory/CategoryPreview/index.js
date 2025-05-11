import useSWR, { mutate } from "swr";
import Overlay from "@/components/Overlay";
import SpinningLoader from "@/components/SpinningLoader";
import SimpleImage from "@/components/SimpleImage";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";
import fetcher from "@/helpers/swrFetcher";

const CategoryPreview = ({
  title,
  categoryId,
  tabId,
  trash,
  isOpen,
  handleClose,
}) => {
  const fetchUrl = trash ? `tabs/${tabId}/deleted` : `categories/${categoryId}`;
  const { data, isLoading } = useSWR(isOpen ? fetchUrl : null);

  const [cards, setCards] = useState([]);

  useEffect(() => {
    setCards(data?.cards);
  }, [data]);

  const restoreCard = async (card) => {
    try {
      await fetcher(`cards/${card.card_id}/restore`, {
        method: "PUT",
        body: JSON.stringify({ card }),
      });

      mutate(`tabs/${card.tab_id}`);

      setCards(cards.filter((c) => c.card_id !== card.card_id));
    } catch (err) {
      // TODO: display a message that we can't restore the card since there is no non-compact category
      console.log(err);
    }
  };

  if (!data || !isOpen) return null;

  return (
    <Overlay
      className={styles.overlay}
      isOpen={isOpen}
      handleClose={handleClose}
    >
      {!cards || isLoading ? (
        <SpinningLoader />
      ) : (
        <div className={styles.container}>
          <div className={styles.title}>{title}</div>

          <button className={styles.closeModalButton} onClick={handleClose}>
            <SimpleImage
              disableLazyLoad
              src="/icons/close.svg"
              width={28}
              height={28}
            />
          </button>

          <div className={styles.grid}>
            {cards.map((card) => (
              <div
                key={card.card_id}
                className={styles.card}
                onClick={() => restoreCard(card)}
              >
                <div className={styles.hoverOverlay}>
                  <SimpleImage src="/icons/back.svg" width={64} height={64} />
                </div>

                <div className={styles.cardTitle}>{card.title}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Overlay>
  );
};

export default CategoryPreview;

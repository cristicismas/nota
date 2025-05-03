export const getOrderedCards = (cards) => {
  const cardsPerCategory = [];

  cards.forEach((card) => {
    const existingArrayIndex = cardsPerCategory.findIndex((arr) =>
      arr.find((c) => c.category_id === card.category_id),
    );

    if (existingArrayIndex >= 0) {
      cardsPerCategory[existingArrayIndex].push(card);
    } else {
      cardsPerCategory.push([card]);
    }
  });

  const orderedCards = [...cardsPerCategory];

  orderedCards.forEach((categoryArray, categoryIndex) => {
    categoryArray.forEach((_card, cardIndex) => {
      orderedCards[categoryIndex][cardIndex].card_order = cardIndex;
    });
  });

  return orderedCards.flat();
};

export const findLastCardInCategory = (cards, category_id) => {
  let lastIndex = 0;

  cards.forEach((card, index) => {
    if (card.category_id === category_id && index > lastIndex) {
      lastIndex = index;
    }
  });

  return lastIndex;
};

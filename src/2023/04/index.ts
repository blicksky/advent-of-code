import { open } from "node:fs/promises";

type Card = {
  winningNumbers: Set<number>;
  numbersYouHave: Set<number>;
};

const parseInput = async (inputFile: string) => {
  const file = await open(new URL(inputFile, import.meta.url));

  const cards: Card[] = [];

  for await (const line of file.readLines()) {
    const [, numbersString] = line.split(":");
    const [winningNumbersString, numbersYouHaveString] =
      numbersString.split("|");

    const winningNumbers = new Set(
      winningNumbersString
        .trim()
        .split(/\s+/)
        .map((n) => parseInt(n, 10)),
    );

    const numbersYouHave = new Set(
      numbersYouHaveString
        .trim()
        .split(/\s+/)
        .map((n) => parseInt(n, 10)),
    );

    cards.push({
      winningNumbers,
      numbersYouHave,
    });
  }

  return cards;
};

export const part1 = async (inputFile: string) => {
  const cards = await parseInput(inputFile);

  return cards
    .map(({ winningNumbers, numbersYouHave }) => {
      const matchCount = [...numbersYouHave].filter((number) =>
        winningNumbers.has(number),
      ).length;

      return matchCount === 0 ? 0 : 2 ** (matchCount - 1);
    })
    .reduce((sum, points) => sum + points);
};

export const part2 = async (inputFile: string) => {
  const cards = await parseInput(inputFile);

  const cardCounts = cards.map(({ winningNumbers, numbersYouHave }) => {
    const matchCount = [...numbersYouHave].filter((number) =>
      winningNumbers.has(number),
    ).length;

    return {
      matchCount,
      cardCount: 1,
    };
  });

  cardCounts.forEach((card, index) => {
    Array.from({ length: card.cardCount }).forEach(() => {
      for (let i = 1; i <= card.matchCount; ++i) {
        cardCounts[index + i].cardCount++;
      }
    });
  });

  return cardCounts.reduce((sum, { cardCount }) => sum + cardCount, 0);
};

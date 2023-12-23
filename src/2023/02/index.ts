import { open } from "node:fs/promises";

const colors = ["red", "green", "blue"] as const;

type Color = (typeof colors)[number];
type Set = Record<Color, number>;
type Game = Set[];

const parseInput = async (inputFile: string) => {
  const games = new Map<number, Game>();

  const file = await open(new URL(inputFile, import.meta.url));

  for await (const line of file.readLines()) {
    const [gameIdInput, setsInput] = line.trim().split(":");

    const [, gameIdString] = gameIdInput.trim().split(" ");
    const gameId = parseInt(gameIdString, 10);
    const sets = setsInput
      .trim()
      .split(";")
      .map((setInput) => {
        const set: Set = {
          red: 0,
          green: 0,
          blue: 0,
        };

        setInput
          .trim()
          .split(", ")
          .forEach((cubeInput) => {
            const [count, color] = cubeInput.split(" ");
            set[color as Color] = parseInt(count, 10);
          });

        return set;
      });

    games.set(gameId, sets);
  }

  return games;
};

const isGamePossible = (game: Game, limits: Record<Color, number>) => {
  return game.every(
    (set) =>
      set.red <= limits.red &&
      set.green <= limits.green &&
      set.blue <= limits.blue,
  );
};

export const part1 = async (inputPath: string) => {
  const games = await parseInput(inputPath);

  let sumOfPossibleGameIds = 0;

  games.forEach((game, id) => {
    if (isGamePossible(game, { red: 12, green: 13, blue: 14 })) {
      sumOfPossibleGameIds += id;
    }
  });

  return sumOfPossibleGameIds;
};

const getMinimumRequiredCubes = (game: Game): Set => {
  const minimumRequiredCubes: Record<Color, number> = {
    red: 0,
    green: 0,
    blue: 0,
  };

  game.forEach((set) => {
    colors.forEach((color) => {
      minimumRequiredCubes[color] = Math.max(
        minimumRequiredCubes[color],
        set[color],
      );
    });
  });

  return minimumRequiredCubes;
};

const getSetPower = (set: Set) => set.red * set.green * set.blue;

export const part2 = async (inputPath: string) => {
  const games = await parseInput(inputPath);

  return [...games.values()]
    .map(getMinimumRequiredCubes)
    .map(getSetPower)
    .reduce((sum, i) => sum + i);
};

console.log(await part1("./input/example.txt"));
console.log(await part1("./input/input.txt"));

console.log(await part2("./input/example.txt"));
console.log(await part2("./input/input.txt"));

import { open } from "node:fs/promises";

type SchematicNumber = {
  readonly number: number;
  readonly row: number;
  readonly column: number;
  readonly length: number;
};

type SchematicSymbol = {
  readonly symbol: string;
  readonly row: number;
  readonly column: number;
};

const parseInput = async (inputFile: string) => {
  const file = await open(new URL(inputFile, import.meta.url));

  const schematicNumbersByRow = new Map<number, SchematicNumber[]>();
  const schematicSymbols: SchematicSymbol[] = [];

  let row = 0;
  for await (const line of file.readLines()) {
    const numberResults = line.matchAll(/\d+/g);

    const rowSchematicNumbers: SchematicNumber[] = [];
    for (const numberResult of numberResults) {
      const [numberString] = numberResult;
      rowSchematicNumbers.push({
        number: parseInt(numberString, 10),
        row,
        column: numberResult.index!,
        length: numberString.length,
      });
    }

    schematicNumbersByRow.set(row, rowSchematicNumbers);

    const symbolResults = line.matchAll(/[^\d.]/g);

    for (const symbolResult of symbolResults) {
      const [symbol] = symbolResult;
      schematicSymbols.push({
        symbol,
        row,
        column: symbolResult.index!,
      });
    }

    ++row;
  }

  return {
    schematicNumbersByRow,
    schematicSymbols,
  };
};

export const part1 = async (inputPath: string) => {
  const { schematicNumbersByRow, schematicSymbols } =
    await parseInput(inputPath);

  const partNumbers = new Set<SchematicNumber>();

  for (const symbol of schematicSymbols) {
    for (let row = symbol.row - 1; row <= symbol.row + 1; ++row) {
      const schematicNumbers = schematicNumbersByRow.get(row);

      schematicNumbers?.forEach((schematicNumber) => {
        if (
          schematicNumber.column <= symbol.column + 1 &&
          schematicNumber.column + schematicNumber.length >= symbol.column
        ) {
          partNumbers.add(schematicNumber);
        }
      });
    }
  }

  // console.log(partNumbers);

  return [...partNumbers].reduce((sum, { number }) => sum + number, 0);
};

export const part2 = async (inputPath: string) => {
  const { schematicNumbersByRow, schematicSymbols } =
    await parseInput(inputPath);

  const adjacentNumbersByGear = new Map<
    SchematicSymbol,
    Set<SchematicNumber>
  >();

  schematicSymbols.forEach((schematicSymbol) => {
    if (schematicSymbol.symbol === "*") {
      const gearNumbers = new Set<SchematicNumber>();

      for (
        let row = schematicSymbol.row - 1;
        row <= schematicSymbol.row + 1;
        ++row
      ) {
        const schematicNumbers = schematicNumbersByRow.get(row);

        schematicNumbers?.forEach((schematicNumber) => {
          if (
            schematicNumber.column <= schematicSymbol.column + 1 &&
            schematicNumber.column + schematicNumber.length >=
              schematicSymbol.column
          ) {
            gearNumbers.add(schematicNumber);
          }
        });
      }
      adjacentNumbersByGear.set(schematicSymbol, gearNumbers);
    }
  });

  return [...adjacentNumbersByGear.values()]
    .filter((schematicNumberSet) => {
      return schematicNumberSet.size === 2;
    })
    .map((schematicNumberSet) => {
      const [first, second] = [...schematicNumberSet.values()];
      return first.number * second.number;
    })
    .reduce((sum, gearRatio) => sum + gearRatio);
};

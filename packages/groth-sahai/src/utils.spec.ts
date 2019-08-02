import { range, same } from "./utils";

describe("same", () => {
  it("works for numbers", () => {
    expect(same(0)).toEqual(0);
    expect(same(0, 0)).toEqual(0);
    expect(same(0, 0, 0)).toEqual(0);

    expect(same(1, 1, 1)).toEqual(1);
    expect(same(-1, -1, -1)).toEqual(-1);
    expect(same(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)).toEqual(
      Number.MAX_SAFE_INTEGER,
    );
    expect(
      same(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
    ).toEqual(Number.POSITIVE_INFINITY);
  });

  it("works for strings", () => {
    expect(same("")).toEqual("");
    expect(same("", "")).toEqual("");
    expect(same("", "", "")).toEqual("");

    expect(same("a", "a", "a")).toEqual("a");
  });

  it("throws for different values", () => {
    expect(() => same(1, 2)).toThrow();
    expect(() => same("a", "b")).toThrow();
  });
});

describe("range", () => {
  it("works", () => {
    expect(range(0)).toEqual([]);
    expect(range(1)).toEqual([0]);
    expect(range(2)).toEqual([0, 1]);
    expect(range(3)).toEqual([0, 1, 2]);
    expect(range(10)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

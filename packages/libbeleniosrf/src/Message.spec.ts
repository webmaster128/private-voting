import { intToMessage } from "./Message";

describe("Message", () => {
  describe("intToMessage", () => {
    it("works for k = 0", () => {
      expect(intToMessage(0, 0)).toEqual([]);
      expect(intToMessage(1, 0)).toEqual([]);
      expect(intToMessage(9, 0)).toEqual([]);
      expect(intToMessage(7000, 0)).toEqual([]);
    });

    it("works for k = 1", () => {
      expect(intToMessage(0, 1)).toEqual([0]);
      expect(intToMessage(1, 1)).toEqual([1]);
      expect(intToMessage(0b1110, 1)).toEqual([0]);
      expect(intToMessage(0b1111, 1)).toEqual([1]);
    });

    it("works for k = 2", () => {
      expect(intToMessage(0, 2)).toEqual([0, 0]);
      expect(intToMessage(1, 2)).toEqual([0, 1]);
      expect(intToMessage(2, 2)).toEqual([1, 0]);
      expect(intToMessage(3, 2)).toEqual([1, 1]);
      expect(intToMessage(0b1110, 2)).toEqual([1, 0]);
      expect(intToMessage(0b1111, 2)).toEqual([1, 1]);
    });

    it("works for k = 5", () => {
      expect(intToMessage(0b00000, 5)).toEqual([0, 0, 0, 0, 0]);
      expect(intToMessage(0b11111, 5)).toEqual([1, 1, 1, 1, 1]);

      expect(intToMessage(0b00001, 5)).toEqual([0, 0, 0, 0, 1]);
      expect(intToMessage(0b00010, 5)).toEqual([0, 0, 0, 1, 0]);
      expect(intToMessage(0b00100, 5)).toEqual([0, 0, 1, 0, 0]);
      expect(intToMessage(0b01000, 5)).toEqual([0, 1, 0, 0, 0]);
      expect(intToMessage(0b10000, 5)).toEqual([1, 0, 0, 0, 0]);
    });
  });
});

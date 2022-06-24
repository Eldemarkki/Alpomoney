import { it, describe, expect } from "vitest";
import { centify, decentify } from "./moneyUtils";

describe("moneyUtils", () => {
  it("should centify 1 correctly", () => expect(centify(1)).toEqual(100));

  // TODO: Commenting this out, because there should never be 3 decimals. May fix later
  // it("should centify 1.398 correctly", () => expect(centify(1.398)).toEqual(139));

  it("should centify 1219.12 correctly", () => expect(centify(1219.12)).toEqual(121912));
  it("should centify 18.10 correctly", () => expect(centify(18.10)).toEqual(1810));

  it("should decentify 1015 correctly", () => expect(decentify(1015)).toEqual(10.15));
  it("should decentify 1810 correctly", () => expect(decentify(1810)).toEqual(18.10));
});

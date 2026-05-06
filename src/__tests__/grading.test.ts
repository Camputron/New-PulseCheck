import { describe, expect, it } from "vitest"
import { isResponseCorrect } from "@/utils"
import { PromptType } from "@/types"

describe("isResponseCorrect — multiple-choice", () => {
  it("is correct when chosen overlaps any correct key", () => {
    expect(isResponseCorrect("multiple-choice", ["a"], ["a"])).toBe(true)
  })

  it("is correct when at least one chosen key is correct", () => {
    expect(isResponseCorrect("multiple-choice", ["a", "b"], ["b"])).toBe(true)
  })

  it("is incorrect when chosen has no correct key", () => {
    expect(isResponseCorrect("multiple-choice", ["a"], ["b"])).toBe(false)
  })

  it("is incorrect when chosen is empty", () => {
    expect(isResponseCorrect("multiple-choice", ["a"], [])).toBe(false)
  })
})

describe("isResponseCorrect — multi-select", () => {
  it("is correct only when chosen set equals correct set", () => {
    expect(isResponseCorrect("multi-select", ["a", "b"], ["a", "b"])).toBe(true)
  })

  it("is correct regardless of order", () => {
    expect(isResponseCorrect("multi-select", ["a", "b"], ["b", "a"])).toBe(true)
  })

  it("is incorrect when chosen is a strict subset", () => {
    expect(isResponseCorrect("multi-select", ["a", "b"], ["a"])).toBe(false)
  })

  it("is incorrect when chosen is a strict superset", () => {
    expect(isResponseCorrect("multi-select", ["a"], ["a", "b"])).toBe(false)
  })

  it("is incorrect when chosen has the same length but different keys", () => {
    expect(isResponseCorrect("multi-select", ["a", "b"], ["a", "c"])).toBe(
      false,
    )
  })

  it("is incorrect when chosen is empty", () => {
    expect(isResponseCorrect("multi-select", ["a"], [])).toBe(false)
  })
})

describe("isResponseCorrect — ranking-poll", () => {
  it("is correct when participant submitted any choice", () => {
    expect(isResponseCorrect("ranking-poll", ["a", "b", "c"], ["a"])).toBe(true)
  })

  it("is correct regardless of which keys were submitted", () => {
    expect(isResponseCorrect("ranking-poll", ["a"], ["x", "y", "z"])).toBe(true)
  })

  it("is incorrect when participant submitted nothing", () => {
    expect(isResponseCorrect("ranking-poll", ["a"], [])).toBe(false)
  })
})

describe("isResponseCorrect — invalid type", () => {
  it("throws on an unknown prompt type", () => {
    expect(() =>
      isResponseCorrect("totally-bogus" as PromptType, ["a"], ["a"]),
    ).toThrowError(/Invalid PromptType/)
  })
})

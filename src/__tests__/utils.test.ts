import { describe, expect, it } from "vitest"
import {
  stoc,
  stoni,
  mmsston,
  ntommss,
  stommss,
  ntops,
  ntoq,
  generateRoomCode,
  getMedian,
  ntogc,
} from "@/utils"

describe("stoc (string to color)", () => {
  it("returns a valid hex color for a normal string", () => {
    expect(stoc("test")).toMatch(/^#[0-9a-f]{6}$/)
  })

  it("returns fallback gray for undefined", () => {
    expect(stoc()).toBe("#808080")
  })

  it("returns fallback gray for empty string", () => {
    expect(stoc("")).toBe("#808080")
  })

  it("returns consistent color for the same input", () => {
    expect(stoc("hello")).toBe(stoc("hello"))
  })

  it("returns different colors for different inputs", () => {
    expect(stoc("alice")).not.toBe(stoc("bob"))
  })

  it("produces colors within muted lightness range", () => {
    const hex = stoc("test-string")
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    // Muted colors should not be pure white or pure black
    const brightness = (r + g + b) / 3
    expect(brightness).toBeGreaterThan(50)
    expect(brightness).toBeLessThan(200)
  })
})

describe("stoni (string to initials)", () => {
  it("returns single initial for one word", () => {
    expect(stoni("Michael")).toBe("M")
  })

  it("returns two initials for two words", () => {
    expect(stoni("Michael Campos")).toBe("MC")
  })

  it("returns first and last initials for three words", () => {
    expect(stoni("John Paul Jones")).toBe("JJ")
  })

  it("returns first and last initials for four+ words", () => {
    expect(stoni("Mary Jane Watson Parker")).toBe("MP")
  })

  it("returns empty string for undefined", () => {
    expect(stoni()).toBe("")
  })

  it("returns empty string for empty string", () => {
    expect(stoni("")).toBe("")
  })

  it("handles extra whitespace", () => {
    expect(stoni("  John   Doe  ")).toBe("JD")
  })

  it("returns uppercase initials for lowercase input", () => {
    expect(stoni("john doe")).toBe("JD")
  })
})

describe("mmsston (MM:SS to milliseconds)", () => {
  it("converts 01:30 to 90000ms", () => {
    expect(mmsston("01:30")).toBe(90000)
  })

  it("converts 00:00 to 0ms", () => {
    expect(mmsston("00:00")).toBe(0)
  })

  it("converts 10:00 to 600000ms", () => {
    expect(mmsston("10:00")).toBe(600000)
  })

  it("converts 00:45 to 45000ms", () => {
    expect(mmsston("00:45")).toBe(45000)
  })

  it("returns null for empty string", () => {
    expect(mmsston("")).toBeNull()
  })

  it("handles minutes-only input", () => {
    expect(mmsston("5")).toBe(300000)
  })
})

describe("ntommss (number to MM:SS)", () => {
  it("converts 90000ms to 01:30", () => {
    expect(ntommss(90000)).toBe("01:30")
  })

  it("converts 600000ms to 10:00", () => {
    expect(ntommss(600000)).toBe("10:00")
  })

  it("converts 45000ms to 00:45", () => {
    expect(ntommss(45000)).toBe("00:45")
  })

  it("returns empty string for null", () => {
    expect(ntommss(null)).toBe("")
  })

  it("returns empty string for 0", () => {
    expect(ntommss(0)).toBe("")
  })

  it("returns empty string for NaN", () => {
    expect(ntommss(NaN)).toBe("")
  })
})

describe("stommss (string to MM:SS format)", () => {
  it("formats 4-digit input as MM:SS", () => {
    expect(stommss("0130")).toBe("01:30")
  })

  it("formats 3-digit input as M:SS", () => {
    expect(stommss("130")).toBe("1:30")
  })

  it("returns raw digits for 1-2 digit input", () => {
    expect(stommss("5")).toBe("5")
    expect(stommss("45")).toBe("45")
  })

  it("strips non-digit characters", () => {
    expect(stommss("01:30")).toBe("01:30")
  })

  it("truncates to 4 digits max", () => {
    expect(stommss("123456")).toBe("12:34")
  })

  it("returns empty string for empty input", () => {
    expect(stommss("")).toBe("")
  })
})

describe("ntops (number to participants string)", () => {
  it("returns singular for 1", () => {
    expect(ntops(1)).toBe("1 Participant")
  })

  it("returns plural for 0", () => {
    expect(ntops(0)).toBe("0 Participants")
  })

  it("returns plural for > 1", () => {
    expect(ntops(5)).toBe("5 Participants")
  })

  it("returns 0 Participants for null", () => {
    expect(ntops(null)).toBe("0 Participants")
  })

  it("returns 0 Participants for undefined", () => {
    expect(ntops(undefined)).toBe("0 Participants")
  })
})

describe("ntoq (number to questions string)", () => {
  it("returns singular for 1", () => {
    expect(ntoq(1)).toBe("1 Question")
  })

  it("returns plural for 0", () => {
    expect(ntoq(0)).toBe("0 Questions")
  })

  it("returns plural for > 1", () => {
    expect(ntoq(10)).toBe("10 Questions")
  })
})

describe("generateRoomCode", () => {
  it("returns a 6-character string", () => {
    expect(generateRoomCode()).toHaveLength(6)
  })

  it("contains only valid characters", () => {
    const valid = /^[ABCDEFGHJKLMNPRTUVWXY0123456789]+$/
    for (let i = 0; i < 20; i++) {
      expect(generateRoomCode()).toMatch(valid)
    }
  })

  it("generates different codes on subsequent calls", () => {
    const codes = new Set(Array.from({ length: 50 }, () => generateRoomCode()))
    // With 30^6 possibilities, 50 codes should almost certainly all be unique
    expect(codes.size).toBeGreaterThan(45)
  })
})

describe("getMedian", () => {
  it("returns median of odd-length array", () => {
    expect(getMedian([1, 3, 5])).toBe(3)
  })

  it("returns average of middle two for even-length array", () => {
    expect(getMedian([1, 2, 3, 4])).toBe(2.5)
  })

  it("returns the element for single-element array", () => {
    expect(getMedian([7])).toBe(7)
  })

  it("handles two-element array", () => {
    expect(getMedian([10, 20])).toBe(15)
  })
})

describe("ntogc (number to grade color)", () => {
  it("returns an HSL string for a valid score", () => {
    expect(ntogc(50)).toMatch(/^hsl\(\d+\.?\d*, 58%, 25%\)$/)
  })

  it("clamps score at 0", () => {
    expect(ntogc(0)).toBe("hsl(0, 58%, 25%)")
  })

  it("clamps score at 100", () => {
    expect(ntogc(100)).toBe("hsl(120, 58%, 25%)")
  })

  it("clamps negative scores to 0", () => {
    expect(ntogc(-10)).toBe("hsl(0, 58%, 25%)")
  })

  it("clamps scores over 100", () => {
    expect(ntogc(200)).toBe("hsl(120, 58%, 25%)")
  })

  it("handles undefined", () => {
    expect(ntogc(undefined)).toMatch(/^hsl\(/)
  })
})

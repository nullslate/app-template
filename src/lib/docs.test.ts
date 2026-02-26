import { slugify } from "./docs"

describe("slugify", () => {
  it("converts text to lowercase kebab-case", () => {
    expect(slugify("Hello World")).toBe("hello-world")
  })

  it("strips non-word characters", () => {
    expect(slugify("What's New?")).toBe("whats-new")
  })

  it("collapses multiple spaces into single hyphen", () => {
    expect(slugify("a   b")).toBe("a-b")
  })
})

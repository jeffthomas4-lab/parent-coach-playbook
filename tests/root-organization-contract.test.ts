import { describe, expect, it } from "vitest";
import { validateRootRegistry } from "../scripts/check-root-organization.mjs";

describe("root organization registry", () => {
  it("requires every tracked root artifact to be classified exactly once", () => {
    expect(validateRootRegistry({ authority: ["README.md"] }, ["README.md", "src/index.ts"]).errors).toEqual([]);
    expect(validateRootRegistry({ authority: ["README.md"] }, ["README.md", "NEW_PLAN.md"]).errors)
      .toContain("Unclassified tracked root artifact: NEW_PLAN.md");
    expect(validateRootRegistry({ authority: ["README.md"], legacy: ["README.md"] }, ["README.md"]).errors)
      .toContain("README.md appears 2 times in the registry.");
  });
});

import { describe, expect, it } from "vitest";
import { validateDirectoryRegistry, validateRootRegistry } from "../scripts/check-root-organization.mjs";

describe("root organization registry", () => {
  it("requires every tracked root artifact to be classified exactly once", () => {
    expect(validateRootRegistry({ authority: ["README.md"] }, ["README.md", "src/index.ts"]).errors).toEqual([]);
    expect(validateRootRegistry({ authority: ["README.md"] }, ["README.md", "NEW_PLAN.md"]).errors)
      .toContain("Unclassified tracked root artifact: NEW_PLAN.md");
    expect(validateRootRegistry({ authority: ["README.md"], legacy: ["README.md"] }, ["README.md"]).errors)
      .toContain("README.md appears 2 times in the registry.");
  });
});

describe("top-level directory registry", () => {
  it("fails on unclassified, duplicate, stale, or nested directory entries", () => {
    expect(validateDirectoryRegistry({ runtime: ["src"] }, ["README.md", "src/index.ts"]).errors).toEqual([]);
    expect(validateDirectoryRegistry({ runtime: ["src"] }, ["src/index.ts", "new-area/file.ts"]).errors)
      .toContain("Unclassified tracked top-level directory: new-area");
    expect(validateDirectoryRegistry({ runtime: ["src"], legacy: ["src"] }, ["src/index.ts"]).errors)
      .toContain("src appears 2 times in the directory registry.");
    expect(validateDirectoryRegistry({ runtime: ["src", "gone", "nested/path"] }, ["src/index.ts"]).errors)
      .toEqual(expect.arrayContaining([
        "Directory registry entry has no tracked files: gone",
        "Invalid top-level directory entry: nested/path",
      ]));
  });
});

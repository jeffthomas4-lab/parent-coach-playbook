import { describe, expect, it } from "vitest";
import { validateSocialStage } from "../scripts/check-social-stage.mjs";

const valid = `
No account creation. No auto-posting. A human pastes every draft at the HUMAN GATE.
### Pin 1
- **Link:** https://parentcoachdesk.com/example/?utm_source=pinterest&utm_medium=social&utm_campaign=test
`;

describe("social distribution staging contract", () => {
  it("accepts a human-gated first-party draft", () => {
    expect(validateSocialStage(valid)).toEqual({ errors: [], links: 1, pins: 1 });
  });

  it("rejects off-site or unmeasured links", () => {
    const result = validateSocialStage(
      valid.replace("https://parentcoachdesk.com/example/?utm_source=pinterest&utm_medium=social&utm_campaign=test", "http://example.com/post"),
    );
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.stringContaining("https://parentcoachdesk.com"),
      expect.stringContaining("utm_source=pinterest"),
      expect.stringContaining("utm_campaign"),
    ]));
  });

  it("rejects credential material and executable posting calls", () => {
    const result = validateSocialStage(`${valid}\napi_key=placeholder\npublish(draft)`);
    expect(result.errors).toEqual(expect.arrayContaining([
      expect.stringContaining("credentials"),
      expect.stringContaining("publication calls"),
    ]));
  });
});

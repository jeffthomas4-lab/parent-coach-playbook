import { describe, expect, it } from "vitest";
import { validateSocialStage } from "../scripts/check-social-stage.mjs";

const valid = `
No account creation. No auto-posting. A human pastes every draft at the HUMAN GATE.
### Pin 1
- **Link:** https://parentcoachdesk.com/example/?utm_source=pinterest&utm_medium=social&utm_campaign=test
`;

describe("social distribution staging contract", () => {
  it("accepts a human-gated first-party draft", () => {
    expect(validateSocialStage(valid)).toEqual({ errors: [], links: 1, items: 1, channel: "pinterest" });
  });

  it("accepts a Facebook group draft only with fit, copy, and Facebook attribution", () => {
    const facebook = `
No account creation. No auto-posting. A human pastes every draft at the HUMAN GATE.
### Facebook Draft 1
- **Group fit:** Parents asking about tryout anxiety; only where group rules allow links.
- **Copy:** A useful answer in Jeff's voice, with the source link after the answer.
- **Link:** https://parentcoachdesk.com/example/?utm_source=facebook&utm_medium=social&utm_campaign=group-help
`;
    expect(validateSocialStage(facebook, "facebook")).toEqual({ errors: [], links: 1, items: 1, channel: "facebook" });
    expect(validateSocialStage(facebook.replace("utm_source=facebook", "utm_source=pinterest"), "facebook").errors)
      .toEqual(expect.arrayContaining([expect.stringContaining("utm_source=facebook")]));
    expect(validateSocialStage(facebook.replace("- **Group fit:**", "- **Audience:**"), "facebook").errors)
      .toContain("Every Facebook draft requires one Group fit and one Copy field.");
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

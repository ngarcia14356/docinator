import { expect } from "chai";
import { packageJson } from "./package-json";

describe("The packageJson object", function() {
  it("Can read the description from the package.json file", function() {
    expect(packageJson.description).to.equal(
      "Extracts documentation from your project to produce a beautiful static website"
    );
  });

  it("Can read the version from the package.json file", function() {
    expect(packageJson.name).to.equal("@tmobile/docinator");
  });

  it("Can read the version from the package.json file", function() {
    expect(packageJson.version).to.equal("0.1.5");
  });
});

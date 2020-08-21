import { expect } from "chai";
import { commonRoot } from "./fs";
import { resolve } from "path";

describe("The fs module", function() {
  describe("commonRoot method", function() {
    it("Gets the common root directory of the given file paths", function() {
      expect(
        commonRoot(
          "./a/b/c.txt",
          "./a/c/d.txt",
          "./a/d/e.txt",
          "./a/f/g/h/i.txt",
          "./a/h/i/j/k/l.txt",
          "a/b/c.txt"
        )
      ).to.equal(resolve("./a/"));

      expect(
        commonRoot(
          "./a/b/c.txt"
        )
      ).to.equal(resolve("./a/b"));

      expect(
        commonRoot(
          "./a/b/"
        )
      ).to.equal(resolve("./a/"));
    });

    it("returns falsey when no paths given", function(){
      expect(commonRoot()).to.be.undefined;
    });
  });
});

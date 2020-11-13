import { expect } from "chai";
import * as directory from "./directory";

describe("The directory module", function () {
	describe("exists method", function () {
		it("returns true when the specified directory exists", async function () {
			expect(await directory.exists("./")).to.be.true;
		});

		it("returns false when the specified directory does not exist", async function () {
			expect(await directory.exists("./does-not-exist")).to.be.false;
		});

		it("returns false when the specified directory is a file", async function () {
			expect(await directory.exists(__filename)).to.be.false;
		});
	});
});

import { join } from "path";
import { expect } from "chai";
import { writeFile, unlink } from "./../file-system/fs";
import { size } from "./../file-system/file";
import { render, normalize } from "./plantuml";
import { fail } from "assert";
import { EOL } from "os";

describe("The plantuml module", function () {
	const pumlContent = `@startuml Given a Valid Plant UML file
		render -> Java: Call Java
		Java --> PlantUML: Execute the JAR
		PlantUML --> FS: Write the diagram to the File System
		@enduml`.replace(/\t{2}/g, "");

	describe("The normalize function", function () {
		it("Removes the file rename directive", function () {
			expect(normalize(pumlContent).split("\n")[0]).to.equal("@startuml");
		});
	});

	describe("The render function", function () {
		describe("Given a valid PlantUML file", function () {
			const pumlPath = join(__dirname, "render.puml");

			beforeEach(async function () {
				await writeFile(pumlPath, pumlContent);
			});

			afterEach(async function () {
				await unlink(pumlPath);
			});

			describe("When it is rendered as a PNG", function () {
				this.timeout(10000);
				const pngPath = join(__dirname, "render.png");
				const pumlPngPath = join(__dirname, "render.puml.png");

				let renderResult: string[];

				beforeEach(async function () {
					renderResult = await render("png", [pumlPath]);
				});

				afterEach(async function () {
					await Promise.all([unlink(pngPath), unlink(pumlPngPath)]);
				});

				it("Renders the PlantUML file in the specified format at predictable file paths", async function () {
					expect(await size(pngPath)).to.be.greaterThan(9000);
					expect(await size(pumlPngPath)).to.be.greaterThan(9000);
				});

				it("Returns the rendered file path", function () {
					expect(renderResult).to.deep.equal([pngPath, pumlPngPath]);
				});
			});
		});

		describe("Given an invalid PlantUML file", function () {
			const pumlPath = join(__dirname, "invalid.puml");

			beforeEach(async function () {
				await writeFile(pumlPath, pumlContent.replace("@", ""));
			});

			afterEach(async function () {
				await unlink(pumlPath);
			});

			it("Throws an exception to indicate the problem", async function () {
				this.timeout(10000);
				// const pngPath = join(__dirname, "invalid.png");
				console.log("Rendering", pumlPath);
				await render("png", [pumlPath])
					.then(() => fail("Render succeeded with invalid puml"))
					.catch((err: { message: string }) => {
						expect(err.message).to.equal(
							`Warning: no image in ${pumlPath}${EOL}` + "No diagram found"
						);
					});
			});
		});
	});
});

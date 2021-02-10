import { expect } from "chai";
import {
	mdLinksToPrettyLinks,
	mdTableColumnHeaders,
	mdTableRow,
} from "./markdown";

describe("The markdown module", function () {
	describe("The mdLinksToPrettyLinks function", function () {
		const markdownContent =
			"Here are some links: " +
			"\n * [Link A](a.md)" +
			"\n * [Link B](../b.md)" +
			"\n * [Link C](../../c.md)" +
			"\n * [Link D](./d.md)" +
			"\n * [Link D2](d2.md)" +
			"\n * [Link E](e/e.md)" +
			"\n * [Link F](f/f/f.md)" +
			"\n * [Link G](/g.md)";

		describe("Given an index markdown file's contents", function () {
			let actualMarkdownContent = "";
			beforeEach(function () {
				actualMarkdownContent = mdLinksToPrettyLinks(
					markdownContent,
					true,
					"_index.md"
				);
			});

			const expectedMarkdownContent =
				"Here are some links: " +
				"\n * [Link A](a)" +
				"\n * [Link B](../b)" +
				"\n * [Link C](../../c)" +
				"\n * [Link D](./d)" +
				"\n * [Link D2](d2)" +
				"\n * [Link E](e/e)" +
				"\n * [Link F](f/f/f)" +
				"\n * [Link G](/g)";

			describe("When mdLinksToPrettyLinks is called it...", function () {
				it("Updates the links to 'pretty' links", function () {
					expect(actualMarkdownContent).to.equal(expectedMarkdownContent);
				});
			});
		});

		describe("Given a content (non-index) markdown file's contents", function () {
			let actualMarkdownContent = "";
			beforeEach(function () {
				actualMarkdownContent = mdLinksToPrettyLinks(
					markdownContent,
					false,
					"_index.md"
				);
			});

			const expectedMarkdownContent =
				"Here are some links: " +
				"\n * [Link A](../a)" +
				"\n * [Link B](../../b)" +
				"\n * [Link C](../../../c)" +
				"\n * [Link D](../d)" +
				"\n * [Link D2](../d2)" +
				"\n * [Link E](../e/e)" +
				"\n * [Link F](../f/f/f)" +
				"\n * [Link G](../g)";

			describe("When mdLinksToPrettyLinks is called it...", function () {
				it("Updates the links to 'pretty' links", function () {
					expect(actualMarkdownContent).to.equal(expectedMarkdownContent);
				});
			});
		});
	});

	describe("The mdTableColumnHeaders function", function () {
		it("Converts an array to markdown table columns", function () {
			expect(mdTableColumnHeaders(["Column One", "Column Two"])).to.equal(
				"| Column One | Column Two |\n" + 
				"|------------|------------|\n"
			);
		});
	});

	describe("The mdTableColumns function", function () {
		it("Converts an array to markdown table contents", function () {
			expect(mdTableRow(["Column One Value", "Column Two Value"])).to.equal(
				"| Column One Value | Column Two Value |\n"
			);
		});
	});
});

import { hugoProvider } from "./hugo";

/**
 * A function that builds a static site baed on the provided information
 */
export type Builder = {
	(destination: string, docsPath: string, sources: string[]): Promise<string[]>;
};

export interface Provider {
	build: Builder;
	serve: Builder;
}

export const providers: {
	[index: string]: Provider;
} = {
	hugo: hugoProvider,
};

// TODO: Make it possible to register new builders, e.g. Gatsby

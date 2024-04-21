import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
// @ts-expect-error - svelte/internal is a module, wrong error
import * as svelteinternal from "svelte/internal";
beforeAll(() => {
  vi.mock("svelte", () => svelteinternal);
});

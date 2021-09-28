import { createRequire } from "module";
import PLazy from "p-lazy";

// See https://nodejs.org/api/esm.html#esm_no_native_module_loading
const require = createRequire(import.meta.url);

const fastFileType = require("./index.node");

export const fromFileSync = fastFileType.fromFile;

export const fromBufferSync = fastFileType.fromBuffer;

export const matchFileSync = fastFileType.matchFile;

export const matchBufferSync = fastFileType.matchBuffer;

export async function fromFile(...args) {
  return new PLazy((resolve) => resolve(fastFileType.fromFile(...args)));
}

export async function fromBuffer(...args) {
  return new PLazy((resolve) => resolve(fastFileType.fromBuffer(...args)));
}

export async function matchFile(...args) {
  return new PLazy((resolve) => resolve(fastFileType.matchFile(...args)));
}

export async function matchBuffer(...args) {
  return new PLazy((resolve) => resolve(fastFileType.matchBuffer(...args)));
}

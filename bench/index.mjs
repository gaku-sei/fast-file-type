import { dirname } from "path";
import { fileURLToPath } from "url";
import { PerformanceObserver, performance } from "perf_hooks";
import * as fileTypeRs from "../index.mjs";
import fileTypeJs from "file-type";
import { readFileSync, openSync, fstat, fstatSync } from "fs";
import glob from "glob";

// Init

const __dirname = fileURLToPath(dirname(import.meta.url));

const filepaths = glob.sync(`${__dirname}/resources/**`, { nodir: true });

if (filepaths.length === 0) {
  console.error('No file found in the "resources" directory');
  process.exit(1);
}

const files = filepaths.map((filepath) => readFileSync(filepath));

const obs = new PerformanceObserver((items) => {
  for (const { name, duration } of items.getEntries()) {
    console.log(name, duration);
  }
});

obs.observe({ entryTypes: ["function"] });

// Functions

async function jsExtractOneByOne() {
  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      await fileTypeJs.fromFile(filepath);
    }

    for (const file of files) {
      await fileTypeJs.fromBuffer(file);
    }
  }
}

function jsExtractBatch() {
  const promises = [];

  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      promises.push(fileTypeJs.fromFile(filepath));
    }

    for (const file of files) {
      promises.push(fileTypeJs.fromBuffer(file));
    }
  }

  return Promise.all(promises);
}

async function rsExtractOneByOne() {
  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      fileTypeRs.fromFileSync(filepath);
    }

    for (const file of files) {
      fileTypeRs.fromBufferSync(file);
    }
  }
}

function rsExtractBatch() {
  const promises = [];

  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      promises.push(fileTypeRs.fromFile(filepath));
    }

    for (const file of files) {
      promises.push(fileTypeRs.fromBuffer(file));
    }
  }

  return Promise.all(promises);
}

async function jsCheckOneByOne() {
  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      (await fileTypeJs.fromFile(filepath)) === "image/jpeg";
    }

    for (const file of files) {
      (await fileTypeJs.fromBuffer(file)) === "image/jpeg";
    }
  }
}

function jsCheckBatch() {
  const promises = [];

  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      promises.push(
        fileTypeJs.fromFile(filepath).then(({ mime }) => mime === "image/jpeg")
      );
    }

    for (const file of files) {
      promises.push(
        fileTypeJs.fromBuffer(file).then(({ mime }) => mime === "image/jpeg")
      );
    }
  }

  return Promise.all(promises);
}

async function rsCheckOneByOne() {
  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      fileTypeRs.matchFileSync(filepath, "image/jpeg");
    }

    for (const file of files) {
      fileTypeRs.matchBufferSync(file, "image/jpeg");
    }
  }
}

function rsCheckBatch() {
  const promises = [];

  for (let i = 0; i < 1_000; i++) {
    for (const filepath of filepaths) {
      promises.push(fileTypeRs.matchFile(filepath, "image/jpeg"));
    }

    for (const file of files) {
      promises.push(fileTypeRs.matchBuffer(file, "image/jpeg"));
    }
  }

  return Promise.all(promises);
}

// Runner

async function run() {
  await performance.timerify(jsExtractOneByOne)();
  await performance.timerify(jsExtractBatch)();
  await performance.timerify(jsCheckOneByOne)();
  await performance.timerify(jsCheckBatch)();

  await performance.timerify(rsExtractOneByOne)();
  await performance.timerify(rsExtractBatch)();
  await performance.timerify(rsCheckOneByOne)();
  await performance.timerify(rsCheckBatch)();

  // Wait for all the operations to end
  return new Promise((resolve) => {
    setImmediate(() => {
      performance.clearMarks();
      obs.disconnect();
      resolve();
    });
  });
}

run();

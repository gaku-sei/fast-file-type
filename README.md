# fast-file-type

`fast-file-type` is a simple Node native library that checks for the _actual_ mime type of a file (i.e. not based on the extension). It's written in Rust using the [`tree_magic_mini`](https://docs.rs/tree_magic_mini/3.0.2/tree_magic_mini/) crate.

You can think of `fast-file-type` as a more exhaustive [`file-type`](https://www.npmjs.com/package/file-type) with a [very large](https://gitlab.freedesktop.org/xdg/shared-mime-info/-/raw/master/data/freedesktop.org.xml.in) (and extensible) amount of supported mime types.

Also, `fast-file-type` is much faster (x5 on my machine). See the [Benchmarks](#Benchmarks) section below for more.

### Installation notice

You need [`share-mime-info`](https://www.freedesktop.org/wiki/Specifications/shared-mime-info-spec/) installed on the machine that runs your code.

After, you can install this module with:

```
npm install https://github.com/gaku-sei/fast-file-type
```

or

```
yarn add https://github.com/gaku-sei/fast-file-type
```

### Benchmarks

You can add some files in the `bench/resources` folder and run the `yarn bench` command to compare `fast-file-type` and [`file-type`](https://www.npmjs.com/package/file-type) on your machine.

### Differences from [`file-type`](https://www.npmjs.com/package/file-type)

`fast-file-type` is not meant to be 1:1 with `file-type` and while their surface apis are close enough, there are some significant differences, including:

- Much much more mime types supported.
- Extra quality of life functions like `matchFile` and `matchBuffer` that will check that a file has the provided mime type. (Prefer these functions when you only need to validate a file's mime type agains a few values, they're blazing fast: up to x20 times faster on my machine).

### Caveats

First of all, `fast-file-type` is _highly_ experimental and most (if not all) the caveats come from this. Nonetheless, straightforward use cases like checking the mime type of uploaded files on a Node server is expected to work properly.

- [ESM](https://nodejs.org/api/esm.html) only. If you try to `require` this module it'll throw an `ERR_REQUIRE_ESM` error. Notice that this limitation is becoming more and more common in the Node ecosystem and will not be considered a caveat soon.
- Works only on the server side, and there is no plans to make it work on the client side. For "basic" file type checks client side you can use [`file-type`](https://www.npmjs.com/package/file-type) and `fast-file-type` for faster server side validations.
- No support (_yet_) for Node's streams.

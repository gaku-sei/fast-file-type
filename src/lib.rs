use neon::prelude::*;
use std::path::Path;
use tree_magic_mini::{from_filepath, from_u8, match_filepath, match_u8};

fn from_file(mut cx: FunctionContext) -> JsResult<JsString> {
    let filepath = cx.argument::<JsString>(0)?.value(&mut cx);

    let filepath = Path::new(filepath.as_str());

    let mime = match from_filepath(&filepath) {
        None => return cx.throw_error("Couldn't read the mime type of file"),
        Some(mime) => mime,
    };

    Ok(cx.string(mime))
}

fn from_buffer(mut cx: FunctionContext) -> JsResult<JsString> {
    let buffer = cx.argument::<JsBuffer>(0)?;

    let lock = cx.lock();

    let buffer = buffer.borrow(&lock).as_slice();

    let mime = from_u8(buffer);

    Ok(cx.string(mime))
}

fn match_file(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let filepath = cx.argument::<JsString>(0)?.value(&mut cx);

    let filepath = Path::new(filepath.as_str());

    let mime = cx.argument::<JsString>(1)?.value(&mut cx);

    Ok(cx.boolean(match_filepath(mime.as_str(), filepath)))
}

fn match_buffer(mut cx: FunctionContext) -> JsResult<JsBoolean> {
    let buffer = cx.argument::<JsBuffer>(0)?;

    let lock = cx.lock();

    let buffer = buffer.borrow(&lock).as_slice();

    let mime = cx.argument::<JsString>(1)?.value(&mut cx);

    Ok(cx.boolean(match_u8(mime.as_str(), buffer)))
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("fromFile", from_file)?;
    cx.export_function("fromBuffer", from_buffer)?;
    cx.export_function("matchFile", match_file)?;
    cx.export_function("matchBuffer", match_buffer)?;

    Ok(())
}

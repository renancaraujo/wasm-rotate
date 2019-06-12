mod utils;
use wasm_bindgen::prelude::*;
use std::mem;
use std::slice;
use std::os::raw::c_void;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

// In order to work with the memory we expose (de)allocation methods
#[no_mangle]
pub extern "C" fn alloc(size: usize) -> *mut c_void {
    let mut buf = Vec::with_capacity(size);
    let ptr = buf.as_mut_ptr();
    mem::forget(buf);
    return ptr as *mut c_void;
}

#[no_mangle]
pub extern "C" fn dealloc(ptr: *mut c_void, cap: usize) {
    unsafe  {
        let _buf = Vec::from_raw_parts(ptr, 0, cap);
    }
}

#[wasm_bindgen]
pub fn greet(pointer: *mut u8, width: usize, height: usize, time: f64) {


    let pixelLength: usize = 4;
    let lineLength = width * pixelLength;
    let halfHeifghtUntraited: f32 = (height as f32) / 2.0;
    let size = width * height * pixelLength;

    let halfHeight = ((halfHeifghtUntraited * 100.0).round() / 100.0) as usize;

    let sl = unsafe { slice::from_raw_parts_mut(pointer, size) };

    for line in 0..halfHeight {
        let startOfLine = line * lineLength;
        let startOfOppositeLine = (height - 1 - line) * lineLength;
        for column in 0..width {
            let pixelStart = startOfLine + column * pixelLength;
            let pixelEnd = pixelStart + pixelLength;

            let oppositePixelStart = startOfOppositeLine + column * pixelLength;
            let oppositePixelEnd = oppositePixelStart + pixelLength;

            let oppositePixel = [sl[oppositePixelStart], sl[oppositePixelStart +1], sl[oppositePixelStart + 2], sl[oppositePixelStart + 3]];
            let targetPixel = [sl[pixelStart], sl[pixelStart +1], sl[pixelStart + 2], sl[pixelStart + 3]];

            for item in oppositePixelStart..oppositePixelEnd {
                let is = item - oppositePixelStart;
                sl[item] = targetPixel[is];
            }
           
            for item in pixelStart..pixelEnd {
                let is = item - pixelStart;
                sl[item] = oppositePixel[is];
            }
        }

    }
}

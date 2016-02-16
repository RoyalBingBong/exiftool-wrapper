'use strict';
const cp = require('child_process');
const fs = require('fs');

export function ({source, tags, useBufferLimit = true, maxBufferSize = 10000, callback}) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      if(!source) {
        let error = new Error('Missing sourcer');
        tryCallback(callback, error)
        reject(error);
      }
      let exifparams = prepareTags(tags);
      exifparams.push('-j');    // "-j" for Exiftool json output

      let usingBuffer = false;

      if(Buffer.isBuffer(source)) {
        usingBuffer = true;
        exifparams.push('-');   // "-" for piping the buffer into Exiftool
      } else if (typeof source == "string") {
        exifparams.push(source);
      } else if (Array.isArray(source)) {
        exifparams = exifparams.concat(source)
      }

      let exif = cp.spawn("exiftool", exifparams);
      let exifdata = "";
      let exiferr = "";

      if(usingBuffer) {
        if(!useBufferLimit) {
          maxBufferSize = source.length
        }
        let buf = source.slice(0, maxBufferSize);
        exif.stdin.write(buf);
        exif.stdin.end();
      }

      exif.stdout.on('data', (data) => {
        exifdata += data
      })
      exif.stderr.on('data', (data) => {
        exiferr += data
      })
      exif.on('close', (code) => {
        if(code == 0) {
          try {
            var parsed = JSON.parse(exifdata)
            tryCallback(callback, null, parsed)
            resolve(parsed);
          } catch(err) {
            tryCallback(callback, err);
            reject(err);
          }
        } else {
          let error = new Error("Exiftool returned an error");
          tryCallback(callback, error);
          reject(error);
        }
      });
    });
  });
}

/**
 * Helper function for callbacks
 */
function tryCallback(cbfunction, error, result) {
  if(cbfunction) {
    cbfunction(error, result);
  }
}

/**
 * Helper function for tag preparation.
 */
function prepareTags(tags) {
  if(tags) {
    tags = tags.map(function(tagname) {
      return ('-' + tagname);
    });
    return  tags;
  }
  return [];
}

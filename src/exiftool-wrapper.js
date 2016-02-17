'use strict';
const cp = require('child_process');
const fs = require('fs');

export function metadata ({source, tags, useBufferLimit = true, maxBufferSize = 10000, callback}) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      if(!source) {
        let error = new Error('Missing source');
        tryCallback(callback, error);
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
        exifparams = exifparams.concat(source);
      } else {
        let error =  new Error('Invalid type for "source"!');
        tryCallback(callback, error);
        reject(error);
      }

      let exif = cp.spawn("exiftool", exifparams);
      let exifdata = "";
      let exiferr = "";

      if(usingBuffer) {
        let buf = (useBufferLimit ? source.slice(0, source.length) : source.slice(0, maxBufferSize));
        // if(!useBufferLimit) {
        //   maxBufferSize = source.length
        // }
        // let buf = source.slice(0, maxBufferSize);
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
            var parseddata = JSON.parse(exifdata);
            if(parseddata.length == 1) {
              parseddata = parseddata[0];
            }
            tryCallback(callback, null, parseddata);
            resolve(parseddata);
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

export function metadataSync({source, tags, useBufferLimit = true, maxBufferSize = 10000}) {
  if(!source) {
    throw new Error('Missing source');
  }
  let exifparams = prepareTags(tags);
  exifparams.push('-j');    // "-j" for Exiftool json output

  let etdata;
  if(Buffer.isBuffer(source)) {
    exifparams.push('-');   // "-" for piping the buffer into Exiftool
    let buf = (useBufferLimit ? source.slice(0, source.length) : source.slice(0, maxBufferSize))
    // if(!useBufferLimit) {
    //   maxBufferSize = source.length
    // }
    // let buf = source.slice(0, maxBufferSize);
    etdata = cp.spawnSync('exiftool', exifparams, {input: buf});
  } else if (typeof source == "string") {
    exifparams.push(source);
    etdata = cp.spawnSync('exiftool', exifparams);
  } else if (Array.isArray(source)) {
    exifparams = exifparams.concat(source)
    etdata = cp.spawnSync('exiftool', exifparams);
  } else {
    throw new Error('Invalid type for "source"!');
  }

  try {
    var parseddata = JSON.parse(etdata.stdout);
    if(jsondata.length == 1) {
      parseddata = parseddata[0];
    }
    return parseddata;
  } catch(e) {
    throw new Error('Could not parse data returned by ExifTool');
  }
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

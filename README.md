# exiftool-wrapper
JavaScript wrapper for ExifTool by Phil Harvey.

## Requirements
You need to have the [ExifTool](http://www.sno.phy.queensu.ca/~phil/exiftool/) by Phil Harvey installed or be able to call it via command-line. You should be able to do this for your respective OS.

# Usage

```javascript
var exiftool = require('exiftool-wrapper');

exiftool.exiftool({source, tags, maxBufferSize, useBufferLimit, callback});
```
## Parameters

* `source`: String, array of string or buffer. Examples:
  * String: `source: 'paath/to/my/image.jpg'`
  * Array: `source: ['image1.jpg', 'image2.jpg', 'video.mp4']`
  * Buffer: `source: <Buffer>`
* `tags`: List of tagnames that should be included or excluded. If ommited, `exiftool()` will return all the metadata that is available in `source`. [Overview of possible tags](http://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/index.html). Examples:
  * `tags: ['imagewidth', 'imageheight']` to only return the width and height of an image/video.
  * `tags: ['-imagewidth', '-imageheight']` to exclude width and height in the returned metadata.
* `callback`: Usual `function (error, data)` format. If omitted, `exiftool()` will return a Promise
* `useBufferLimit`: If set to `false` the whole Buffer will be piped into ExifTool. (default: `true`)
* `maxBufferSize`: Maximum length of Buffer, that will be piped into ExifTool. (default: `10000`)


# Example

### Get imagewidth and imageheight from files in `examples/sampleimages/`
```javascript
var exiftool = require('../lib/exiftool-wrapper.js');
var fs = require('fs')
var path = require('path')


var samplepath = './sampleimages/'
fs.readdir(samplepath, function(err, files) {
  files = files.map(function(f) {
    return path.join(samplepath, f)
  })
  // As callback
  exiftool.exiftool({source: files, tags: ['imagewidth', 'imageheight'], callback: function (err, metadata) {
    if(err) {
      return console.log(err);
    }
    console.log(metadata);
  }});
  // As Promise:
  exiftool.exiftool({source: files, tags: ['imagewidth', 'imageheight']})
    .then(function(metadata) {
      console.log(metadata)
    })
    .catch(function(err) {
      console.log(err)
    });
});
```
#### Output:
```JSON
[
   {
      SourceFile:'sampleimages/Example.jpg',
      ImageWidth:275,
      ImageHeight:297
   },
   {
      SourceFile:'sampleimages/NodeJS.png',
      ImageWidth:234,
      ImageHeight:73
   },
   {
      SourceFile:'sampleimages/Stationary_wavelet_transform_lena.png',
      ImageWidth:1280,
      ImageHeight:1278
   }
]
```

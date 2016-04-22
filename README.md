# exiftool-wrapper
JavaScript wrapper for ExifTool by Phil Harvey.

## Installation
------
The usual way:

```npm install exiftool-wrapper```

### Requirements
You need to have the [ExifTool](http://www.sno.phy.queensu.ca/~phil/exiftool/) by Phil Harvey installed or be able to call it from your bash/console.



## Usage
------
You can use callbacks or promises.

```javascript
var exiftool = require('exiftool-wrapper');

exiftool.metadata({source, tags, maxBufferSize, useBufferLimit, callback});
```
Or if you need it to be sync:
```javascript
exiftool.metadataSync({source, tags, maxBufferSize, useBufferLimit});
```

Depending on what you passed as `source`, you will either get single object or an array of objects containing the metadata. See below for a more detailed example.


### Parameters

* `source`: file, files or buffer. Examples:
  * String: `source: 'path/to/my/image.jpg'`
  * Array: `source: ['path/to/my/image1.jpg', 'path/to/my/image2.jpg', 'path/to/my/video.mp4']`
  * Buffer: `source: <Buffer>`, e.g. via `fs.readFile()`
* `tags`: List of [tags](http://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/index.html) that should be included or excluded. If omitted, the function will return all metadata that is available in `source`. Add a single dash `-` in front of the tag to exclude it. Not case sensitive. Examples:
  * `tags: ['imagewidth', 'imageheight']` will only return the width and height of an image/video.
  * `tags: ['-imagewidth', '-imageheight']` will exclude width and height in the returned metadata.
* `useBufferLimit`: If set to `false` the whole Buffer will be piped into ExifTool otherwise `maxBufferSize` will be used to cap the Buffer. (default: `true`)
* `maxBufferSize`: Maximum length of Buffer, that will be piped into ExifTool. (default: `10000`)
* `callback`: Usual `function (error, metadata)` format. If omitted, `metadata()` will return a Promise

## Example
------
Get filtered metadata (only imagewidth and imageheight) for a list of files under `./sampleimages/`.

Also see: [exiftool-wrapper/examples](https://github.com/RoyalBingBong/exiftool-wrapper/tree/master/examples)
```javascript
var exiftool = require('exiftool-wrapper');
var fs = require('fs');
var path = require('path');


var samplepath = './sampleimages/'
fs.readdir(samplepath, function(err, files) {
  files = files.map(function(f) {
    return path.join(samplepath, f);
  })
  // As callback
  exiftool.metadata({source: files, tags: ['imagewidth', 'imageheight'], callback: function (err, metadata) {
    if(err) {
      return console.log(err);
    }
    console.log(metadata);
  }});
  // As Promise:
  exiftool.metadata({source: files, tags: ['imagewidth', 'imageheight']})
    .then(function(metadata) {
      console.log(metadata);
    })
    .catch(function(err) {
      console.log(err);
    });
});
```
#### Output:
```JSON
[
  {
    "SourceFile": "sampleimages/Example.jpg",
    "ImageWidth": 275,
    "ImageHeight": 297
  },
  {
    "SourceFile": "sampleimages/NodeJS.png",
    "ImageWidth": 234,
    "ImageHeight": 73
  },
  {
    "SourceFile": "sampleimages/Stationary_wavelet_transform_lena.png",
    "ImageWidth": 1280,
    "ImageHeight": 1278
  }
]
```

## Notes
------
* It is not the fastest way to get your metadata.
* Some tags will be missing, if `maxBufferSize` is too small. `10000` worked fine for basic data like imageheight and imagewidth.
* .webm-files appear to be problematic when using `useBufferLimit: false`. This is an issue with ExifTool itself. It has problems with piped in webm-files.
* Feedback would be great, since this is my first module.


## Todo
------
Real tests.

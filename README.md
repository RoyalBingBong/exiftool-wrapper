# exiftool-wrapper
JavaScript wrapper for ExifTool by Phil Harvey.

## Requirements
You need to have the [ExifTool](http://www.sno.phy.queensu.ca/~phil/exiftool/) by Phil Harvey installed or be able to call it from the command-line of your choice. I trust in your ability to find out on how to do this yourself.


## Motivation
I needed a module that would give me some basic metadata of media files typical for the web: .jpg, .png, .gif and .webm. I found another wrapper for ExifTool, but said wrapper only provided support for buffers, which resulted in problems for webm-files. In addition to that, I wanted to parse local files without the need to read them in node first.

# Usage
`metadata()` and `metadataSync()` will return a single object or an array of objects containing the metadata.
```javascript
var exiftool = require('exiftool-wrapper');

exiftool.metadata({source, tags, maxBufferSize, useBufferLimit, callback});
```
Or if you desperately need it to be sync:
```javascript
exiftool.metadataSync({source, tags, maxBufferSize, useBufferLimit});
```
## Parameters

* `source`: Path/paths or buffer. Examples:
  * String: `source: 'path/to/my/image.jpg'`
  * Array: `source: ['path/to/my/image1.jpg', 'path/to/my/image2.jpg', 'path/to/my/video.mp4']`
  * Buffer: `source: <Buffer>`, e.g. via `fs.readFile()` etc.
* `tags`: List of [tags](http://www.sno.phy.queensu.ca/~phil/exiftool/TagNames/index.html) that should be included or excluded. If omitted, the function will return all metadata that is available in `source`. Add a single dash `-` in front of the tag to exclude it. Examples:
  * `tags: ['imagewidth', 'imageheight']` to only return the width and height of an image/video.
  * `tags: ['-imagewidth', '-imageheight']` to exclude width and height in the returned metadata.
* `useBufferLimit`: If set to `false` the whole Buffer will be piped into ExifTool. (default: `true`)
* `maxBufferSize`: Maximum length of Buffer, that will be piped into ExifTool. (default: `10000`)
* `callback`: Usual `function (error, metadata)` format. If omitted, `metadata()` will return a Promise


# Example

### Get imagewidth and imageheight from files in `./sampleimages/`
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

# Notes
* It is not the fastest way to get your metadata.
* If `maxBufferSize` is set too small, then some tags will be missing. `10000` worked find for basic data like imageheight and imagewidth.
* webm-files files are problematic when using `useBufferLimit: false`
* Feedback would be great, since this is my first module.


## Todo
Real tests.

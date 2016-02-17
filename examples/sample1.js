var exiftool = require('../lib/exiftool-wrapper.js');
var fs = require('fs')
var path = require('path')


var samplepath = './sampleimages/'
fs.readdir(samplepath, function(err, files) {
  files = files.map(function(f) {
    return path.join(samplepath, f)
  })
  // As callback
  exiftool.metadata({source: files, tags: ['imagewidth', 'imageheight'], callback: function (err, metadata) {
    if(err) {
      return console.log(err);
    }
    console.log(JSON.stringify(metadata, null, 2));
  }});
  // As Promise:
  exiftool.metadata({source: files, tags: ['imagewidth', 'imageheight']})
    .then(function(metadata) {
      console.log(JSON.stringify(metadata, null, 2));
    })
    .catch(function(err) {
      console.log(err)
    });
});

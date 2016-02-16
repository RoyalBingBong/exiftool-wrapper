var exiftool = require('../lib/exiftool-wrapper.js');
var fs = require('fs')
var path = require('path')


var samplepath = './sampleimages/'
fs.readdir(samplepath, function(err, files) {
  files = files.map(function(f) {
    return path.join(samplepath, f)
  })
  // As callback
  exiftool.exiftool({source: files, tags: ['imAGewidth', 'imageheight'], callback: function (err, metadata) {
    if(err) {
      return console.log(err);
    }
    console.log(metadata);
  }});
  // As Promise:
  exiftool.exiftool({source: files, tags: ['imAGewidth', 'imageheight']})
    .then(function(metadata) {
      console.log(metadata)
    })
    .catch(function(err) {
      console.log(err)
    });
});

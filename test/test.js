// 'use strict'
// var exiftool = require('../lib/exiftool-wrapper.js');
// var fs = require('fs');
// var path = require('path');
// var _ = require('lodash')
//
// var exif = require('exiftool');
//
// var testpath = './images/';
// var jsonpath = './json/';
//
// var start = new Date().getTime();

let mypath = 'my/image/path/'

fs.readdir(testpath, function(err, files) {
  files = files.map(function(f) {
    return path.join(mypath, f)
  })
  exiftool.exiftool({source: files, tags: ['imagewidth', 'imageheight'], callback: function (err, metadata) {
    if(!err) {
      console.log(metadata)
    }
  }});
});

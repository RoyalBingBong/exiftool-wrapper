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



var test = [1,2,3,4,5,6,7,8,9]
var res = test.slice(0,2)
console.log(res)
console.log(res.length)

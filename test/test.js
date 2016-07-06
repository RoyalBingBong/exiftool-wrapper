'use strict'
const fs = require('fs')
const path = require('path')

const chai = require('chai')
const expect = chai.expect
const chaiJsonEqual = require('chai-json-equal')

chai.use(chaiJsonEqual)
chai.use(require('chai-fuzzy'))

const exiftool = require('../lib/exiftool-wrapper.js')


const jsonPath = path.join(__dirname, 'json')
const testFilesPath = path.join(__dirname, 'testfiles')


let testFile = path.join(testFilesPath, 'PNG.png')
let testFileLarge = path.join(testFilesPath, 'ExifTool.jpg')
let testFiles = ['PNG.png', 'Sony.jpg', 'GIF.gif', 'Vorbis.ogg', 'MP3.mp3', 'ZIP.zip'].map((f) => {
  return path.join(testFilesPath, f)
})

let testFileJSON = getJSON(testFile)
let testFileLargeJSON = getJSON(testFileLarge)

function getJSON(filename) {
  let p = path.join(jsonPath, path.basename(filename) + '.json')
  return require(p)[0]
}


describe('metadata', () => {
  describe('via callback', () => {
    it('from string', (done) => {
      let options = {
        source: testFile,
        callback: function (err, meta) {
          if (err) return done(err)
          expect(meta).to.be.like(testFileJSON)
          done()
        }
      }
      exiftool.metadata(options)
    })

    it('from [string]', (done) => {
      let options = {
        source: testFiles,
        callback: function (err, meta) {
          if (err) return done(err)
          expect(meta).to.have.lengthOf(testFiles.length)
          done()
        }
      }
      exiftool.metadata(options)
    })

    it('from Buffer', (done) => {
      fs.readFile(testFile, (err, fd) => {
        if (err) return done(err)
        expect(fd).to.be.an.instanceof(Buffer)
        let options = {
          source: fd,
          callback: function (err, meta) {
            if (err) return done(err)
            expect(meta['SourceFile']).to.equal('-')
            done()
          }
        }
        exiftool.metadata(options)
      })
    })
  })
  describe('via Promise', () => {
    it('from string', (done) => {
      let options = { source: testFile }
      exiftool.metadata(options)
        .then((meta) => {
          expect(meta).to.be.like(testFileJSON)
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    it('from [string]', (done) => {
      let options = { source: testFiles }
      exiftool.metadata(options)
        .then((meta) => {
          expect(meta).to.have.lengthOf(testFiles.length)
          done()
        })
        .catch((err) => {
          done(err)
        })
    })

    it('from Buffer', (done) => {
      fs.readFile(testFile, (err, fd) => {
        if (err) return done(err)
        expect(fd).to.be.an.instanceof(Buffer)
        let options = { source: fd }
        exiftool.metadata(options)
          .then((meta) => {
            expect(meta['SourceFile']).to.equal('-')
            done()
          })
          .catch((err) => {
            done(err)
          })
      })
    })
  })
  describe('Sync', () => {
    it('from string', () => {
      let options = { source: testFile }
      let meta = exiftool.metadataSync(options)
      expect(meta).to.be.like(testFileJSON)
    })

    it('from [string]', () => {
      let options = { source: testFiles }
      let meta = exiftool.metadataSync(options)
      expect(meta).to.have.lengthOf(testFiles.length)
    })

    it('from Buffer', (done) => {
      fs.readFile(testFile, (err, fd) => {
        if (err) return done(err)
        expect(fd).to.be.an.instanceof(Buffer)
        let options = { source: fd }
        let meta = exiftool.metadataSync(options)
        expect(meta['SourceFile']).to.equal('-')
        done()
      })
    })
  })
})
describe('options', () => {
  describe('tags', () => {
    it('whitelist: imagewidth and imageheight', (done) => {
      let options = {
        source: testFile,
        tags: ['imagewidth', 'imageheight']
      }
      exiftool.metadata(options)
        .then((meta) => {
          expect(meta).to.have.property('ImageWidth')
          expect(meta).to.have.property('ImageHeight')
          expect(meta).to.not.have.property('MIMEType')
          expect(meta).to.not.have.property('Directory')
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
    it('blacklist: imagewidth and imageheight', (done) => {
      let options = {
        source: testFile,
        tags: ['-imagewidth', '-imageheight']
      }
      exiftool.metadata(options)
        .then((meta) => {
          expect(meta).to.not.have.property('ImageWidth')
          expect(meta).to.not.have.property('ImageHeight')
          expect(meta).to.have.property('MIMEType')
          expect(meta).to.have.property('Directory')
          done()
        })
        .catch((err) => {
          done(err)
        })
    })
  })
  describe('BufferLimit', () => {
    it('useBufferLimit: false', (done) => {
      fs.readFile(testFileLarge, (err, fd) => {
        let JSONcopy = Object.assign({}, testFileLargeJSON)
        JSONcopy['SourceFile'] = '-'
        if (err) return done(err)
        expect(fd).to.be.an.instanceof(Buffer)
        let options = {
          source: fd,
          useBufferLimit: false
        }
        exiftool.metadata(options)
          .then((meta) => {
            expect(meta['SourceFile']).to.equal('-')
            let keyLength = Object.keys(testFileLargeJSON).length
            // Meta via buffer has less tags (e.g. direcotry, dates related to file, etc)
            expect(Object.keys(meta)).to.have.length.within(keyLength - 10, keyLength)
            done()
          })
          .catch((err) => {
            done(err)
          })
      })
    })
    it('useBufferLimit: true, maxBufferSize: 200', (done) => {
      fs.readFile(testFileLarge, (err, fd) => {
        let JSONcopy = Object.assign({}, testFileLargeJSON)
        JSONcopy['SourceFile'] = '-'
        if (err) return done(err)
        expect(fd).to.be.an.instanceof(Buffer)
        let options = {
          source: fd,
          useBufferLimit: true,
          maxBufferSize: 200
        }
        exiftool.metadata(options)
          .then((meta) => {
            expect(meta['SourceFile']).to.equal('-')
            expect(Object.keys(meta)).to.have.length.below(10)
            expect(meta).to.have.property('Warning')
            done()
          })
          .catch((err) => {
            done(err)
          })
      })
    })
  })
})

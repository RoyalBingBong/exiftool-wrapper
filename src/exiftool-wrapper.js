import {spawn, spawnSync} from 'child_process'


/**
 * Returns the metadata of the given source. Returns a Promise or uses the passed callback.
 * 
 * @export
 * @param {object} options
 * @param {string|string[]|Buffer} options.source - The media for which we want to extract the metadata
 * @param {string[]} [options.tags] - List of metadata tags to whitelist or blacklist (add '-' before each tag). See [ExifTool Tag Names]{@link http://www.sno.phy.queensu.ca/%7Ephil/exiftool/TagNames/index.html} for available tags.
 * @param {boolean} [options.useBufferLimit=true] - Allows the limiting the size of the buffer that is piped into ExifTool
 * @param {number} [options.maxBufferSize=10000] - Size of the buffer that is piped into ExifTool
 * @param {metadataCallback} [options.callback] - Callback that receives the metadata
 * @returns {Promise.<object[]>} A promise that contains the metadata for the media in an Array of Objects
 */
export function metadata ({source, tags, useBufferLimit = true, maxBufferSize = 10000, callback}) {
  return new Promise((resolve, reject) => {
    process.nextTick(() => {
      if (!source) {
        let error = new TypeError('"source" must be a string, [string] or Buffer')
        tryCallback(callback, error)
        reject(error)
      }
      let exifparams = prepareTags(tags)
      // "-j" for Exiftool json output
      exifparams.push('-j')

      let usingBuffer = false

      if (Buffer.isBuffer(source)) {
        usingBuffer = true
        exifparams.push('-')   // "-" for piping the buffer into Exiftool
      } else if (typeof source === 'string') {
        exifparams.push(source)
      } else if (Array.isArray(source)) {
        exifparams = exifparams.concat(source)
      } else {
        let error = new TypeError('"source" must be a string, [string] or Buffer')
        tryCallback(callback, error)
        reject(error)
      }

      let exif = spawn('exiftool', exifparams)
      let exifdata = ''
      let exiferr = ''

      if (usingBuffer) {
        let buf = (useBufferLimit ? source.slice(0, maxBufferSize) : source)
        exif.stdin.write(buf)
        exif.stdin.end()
      }

      exif.stdout.on('data', (data) => {
        exifdata += data
      })
      exif.stderr.on('data', (data) => {
        exiferr += data
      })
      exif.on('close', (code) => {
        if (code === 0) {
          try {
            var parseddata = JSON.parse(exifdata)
            if (parseddata.length === 1) {
              parseddata = parseddata[0]
            }
            tryCallback(callback, null, parseddata)
            resolve(parseddata)
          } catch (err) {
            tryCallback(callback, err)
            reject(err)
          }
        } else {
          let error = new Error('Exiftool returned an error')
          error.commandlog = {
            'stdout': exifdata,
            'stderr': exiferr
          }
          tryCallback(callback, error)
          reject(error)
        }
      })
    })
  })
}

/**
 * Returns the metadata of the given source synchroniously.
 * 
 * @export
 * @param {object} options
 * @param {string|string[]|Buffer} options.source - The media for which we want to extract the metadata
 * @param {string[]} [options.tags] - List of metadata tags to whitelist or blacklist (add '-' before each tag). See [ExifTool Tag Names]{@link http://www.sno.phy.queensu.ca/%7Ephil/exiftool/TagNames/index.html} for available tags.
 * @param {boolean} [options.useBufferLimit=true] - Allows the limiting the size of the buffer that is piped into ExifTool
 * @param {number} [options.maxBufferSize=10000] - Size of the buffer that is piped into ExifTool
 * @returns {object[]} An array of objects that contains the metadata for each media
 */
export function metadataSync ({source, tags, useBufferLimit = true, maxBufferSize = 10000}) {
  if (!source) {
    throw new Error('Undefined "source"')
  }
  let exifparams = prepareTags(tags)
  // "-j" for Exiftool json output
  exifparams.push('-j')

  let etdata
  if (Buffer.isBuffer(source)) {
    // "-" for piping the buffer into Exiftool
    exifparams.push('-')
    let buf = (useBufferLimit ? source.slice(0, maxBufferSize) : source)
    etdata = spawnSync('exiftool', exifparams, {input: buf})
  } else if (typeof source === 'string') {
    exifparams.push(source)
    etdata = spawnSync('exiftool', exifparams)
  } else if (Array.isArray(source)) {
    exifparams = exifparams.concat(source)
    etdata = spawnSync('exiftool', exifparams)
  } else {
    throw new TypeError('"source" must be a string, [string] or Buffer')
  }

  try {
    var parseddata = JSON.parse(etdata.stdout)
    if (parseddata.length === 1) {
      parseddata = parseddata[0]
    }
    return parseddata
  } catch (e) {
    let err = new Error('Could not parse data returned by ExifTool')
    err.commandlog = {
      'stdout': etdata.stdout,
      'stderr': etdata.stderr
    }
    throw err
  }
}

// Helper function for tag preparation.
function tryCallback(cbfunction, error, result) {
  if (cbfunction) {
    cbfunction(error, result)
  }
}

// Helper function for tag preparation.
function prepareTags(tags) {
  if (tags) {
    tags = tags.map((tagname) => {
      return ('-' + tagname)
    })
    return tags
  }
  return []
}

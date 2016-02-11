'use strict';

const fs = require('fs');
const path = require('path');


module.exports = () => {
  const GYPI_PATH = path.resolve(`${__dirname}/../libchromiumcontent/chromiumcontent/chromiumcontent.gypi`);

  let GYPI = fs.readFileSync(GYPI_PATH, 'utf8');
  const delete_lines = [
    "    # Enalbe using proprietary codecs.",
    "    'proprietary_codecs': 1,",
    "    'ffmpeg_branding': 'Chrome',"
  ]

  delete_lines.forEach((line) => {
    GYPI = GYPI.replace(line, '');
  });

  fs.writeFileSync(GYPI_PATH, GYPI, 'utf8');
}

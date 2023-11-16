/*
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 * Created Date: Nov 10, 2023
 * Author: Manraj Bains
 */

const AdmZip = require("adm-zip"),
  fs = require("fs"),
  PNG = require("pngjs").PNG,
  path = require("path");
/**
 * Description: decompress file from given pathIn, write to given pathOut
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */


const unzip = (pathIn, pathOut) => {
  return new Promise((resolve, reject) => {
    var zip = new AdmZip(pathIn);
    zip.extractAllTo(pathOut, true);
    resolve();
  });
};

/**
 * Description: read all the png files from given directory and return Promise containing an array of each png file path
 * @param {string} dir
 * @return {Promise}
 */
const readDir = async (dir) => {
  try {
    const files = await fs.promises.readdir(dir);
    const pngFiles = files.filter(file => file.endsWith(".png"));
    return pngFiles.map(file => path.join(dir, file));
  } catch (error) {
    console.error(`Error reading directory ${dir}: ${error.message}`);
    throw error;
  }
};



/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {Promise}
 */

//hackjob attempt of a vintageFilter
const vintageFilter = (pathIn, pathOut) => {
  return fs.promises.readFile(pathIn)
    .then((image) => {
      console.log(`Processing file: ${pathIn}`);
      const png = PNG.sync.read(image);
      
      for (let i = 0; i < png.data.length; i += 4) {
        
        const red = png.data[i];
        const green = png.data[i + 1];
        const blue = png.data[i + 2];

        png.data[i] = Math.min(255, red + 45);
        png.data[i + 1] = Math.min(255, green + 15);
        png.data[i + 2] = Math.max(0, blue - 30);
      }
      const vintageBuffer = PNG.sync.write(png);
      return fs.promises.writeFile(pathOut, vintageBuffer);;
    })
    .catch((error) => {
      console.error(`Error processing file ${pathIn}: ${error.message}`);
      throw error;
    });
};



//grayScale
const grayScale = (pathIn, pathOut) => {
  return fs.promises.readFile(pathIn)
    .then((image) => {
      console.log(`Processing file: ${pathIn}`);
      const png = PNG.sync.read(image);
      for (let i = 0; i < png.data.length; i += 4) {
        const avg = (png.data[i] + png.data[i + 1] + png.data[i + 2]) / 3;
        png.data[i] = avg;
        png.data[i + 1] = avg;
        png.data[i + 2] = avg;
      }

      const grayscaleBuffer = PNG.sync.write(png);
      return fs.promises.writeFile(pathOut, grayscaleBuffer);
    })
    .catch((error) => {
      console.error(`Error processing file ${pathIn}: ${error.message}`);
      throw error;
    });
};


module.exports = {
  unzip,
  readDir,
  grayScale,
  vintageFilter,

};
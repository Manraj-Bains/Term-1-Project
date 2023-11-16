const path = require("path");
const readline = require("readline");
const fs = require("fs");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "proceessed");

const createDirectories = (directories) => {
  directories.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

const applyFilter = (filterType, filterFunction) => {
  console.log(`Applying ${filterType} filter...`);
  IOhandler.unzip(zipFilePath, pathUnzipped)
    .then(() => IOhandler.readDir(pathUnzipped))
    .then((pngFiles) => {
      const promises = pngFiles.map((filePath) =>
        filterFunction(filePath, path.join(pathProcessed, filterType, path.basename(filePath)))
      );
      return Promise.all(promises);
    })
    .catch((error) => console.error(error));
};

createDirectories([path.join(pathProcessed, "grayscale"), path.join(pathProcessed, "vintage")]);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Choose a filter (1 for grayscale, 2 for vintage): ", (answer) => {
  rl.close();

  if (answer === "1") {
    applyFilter("grayscale", IOhandler.grayScale);
  } else if (answer === "2") {
    applyFilter("vintage", IOhandler.vintageFilter);
  } else {
    console.log("Invalid choice. Please choose 1 for grayscale or 2 for vintage.");
  }
});
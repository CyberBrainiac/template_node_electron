const fs = require("fs/promises");
const { existsSync, createWriteStream } = require("fs");
const path = require("path");

/**
 * Saves processed content to a new text file
 * @param {string} outputPath - Directory to save output files
 * @param {string} fileName - Original file name
 * @param {string} content - Processed content to save
 */
async function txt(outputPath, fileName, content) {
  let response = {
    data: [],
    status: "Success",
  };

  try {
    // Create output directory if it doesn't exist
    if (!existsSync(outputPath)) {
      await fs.mkdir(outputPath, { recursive: true });
    }

    // Generate output filename (replace original extension with .txt)
    const baseName = path.basename(fileName, path.extname(fileName));
    const outputFileName = `${baseName}.txt`;
    const outputFilePath = path.join(outputPath, outputFileName);

    // Create a write stream
    const writeStream = createWriteStream(outputFilePath, {
      encoding: "utf8",
    });

    // Write content in chunks
    const chunkSize = 1024 * 1024; // 1MB per chunk
    for (let i = 0; i < content.length; i += chunkSize) {
      const chunk = content.substring(i, i + chunkSize);
      if (!writeStream.write(chunk)) {
        await new Promise((resolve) => writeStream.once("drain", resolve));
      }
    }

    // Close the stream
    const filePath = await new Promise((resolve, reject) => {
      writeStream.end(() => {
        console.log(`File saved: ${outputFileName}`);
        resolve(outputFilePath);
      });
      writeStream.on("error", reject);
    });
    return { ...response, data: filePath };
  } catch (error) {
    return { ...response, errReason: error, status: "Failed" };
  }
}

module.exports = { txt };

const fs = require("fs/promises");
const path = require("path");
const iconv = require("iconv-lite");

/**
 * Reads files matching the .T* pattern with CP866 encoding
 * @param {string} folderPath - Path to the directory to scan
 * @param {Function} onFileContent - Callback for processing file content (fileName, content)
 * @param {Function} onError - Optional callback when all files are processed
 */
async function getContent(folderPath, onFileContent, onError = () => {}) {
  let response = {
    data: [],
    status: "Success",
  };
  let error;
  try {
    const files = await fs.readdir(folderPath, async (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        error = `Помилка при читанні директорії: ${err}`;
      }
      throw new Error(error);
    });

    // Filter files by pattern (DEL*.T*)
    const matchingFiles = files.filter((file) => {
      return path.extname(file).startsWith(".T");
    });

    // If no matching files found
    if (matchingFiles.length === 0) {
      console.error(`Can't find expected .T00 files ${folderPath}`);
      error = `Помилка, файлів з розширенням .Т00 не знайдено за шляхом ${folderPath}`;
      throw new Error(error);
    }

    // Process each matching file
    for (const fileName of matchingFiles) {
      const filePath = path.join(folderPath, fileName);

      // Read file with DOS Cyrillic encoding (CP866)
      const rawContent = await fs.readFile(filePath, (err, data) => {
        if (err) {
          console.error(`Error reading file ${fileName}:`, err);
          error = `Помилка при читанні файлу ${fileName}: ${err}`;
          throw new Error(error);
        }
        return data;
      });

      // Convert from CP866 to UTF-8
      const fileContent = iconv.decode(rawContent, "cp866");
      response.data.push({ name: fileName, content: fileContent });
    }
    return response;
  } catch (error) {
    return {
      ...response,
      errReason: error,
      status: "Failed",
    };
  }
}

module.exports = { getContent };

function mergeFiles(filesContent) {
  let response = {
    data: [],
    status: "Success",
  };

  const mergeFileRows = filesContent.data.map((file) => toRows(file.content));
  let mergeFile = [];
  let clearFile = [];

  for (let i = 0; i < mergeFileRows[0].length; i++) {
    let currentRow = mergeFileRows[0][i]; //init row with first file row.

    if (i < 9) {
      //skip 10 lines with document header
      mergeFile[i] = currentRow;
      continue;
    }

    if (i > 13 && isNaN(parseInt(currentRow))) {
      //after document header and columns name
      //skip 10 lines with duplicate document header. Gamma 1101 will be duplicate header each 200 rows, I am goin to skip it
      mergeFile[i] = undefined;
      continue;
    }

    for (let j = 1; j < mergeFileRows.length; j++) {
      let fileContent = mergeFileRows[j]; //j = 1 because I am going to skip first file content
      currentRow += fileContent[i].slice(14); //return string without TIMI column;
    }
    mergeFile[i] = currentRow;
  }

  for (const row of mergeFile) {
    if (typeof row === "undefined") continue;
    clearFile.push(row);
  }
  response.data = clearFile.join("\r\n");

  return response;
}

function toRows(fileContent) {
  const rows = fileContent.split("\r\n"); //10 rows is header of document, 11 row is table heading. 12-13 rows - empty, 1 column of each document is TIMI

  return rows;
}

module.exports = { toRows, mergeFiles };

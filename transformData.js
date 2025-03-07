function mergeFiles(filesContent) {
  let response = {
    data: [],
    status: "Success",
  };

  const mergeFileRows = filesContent.data.map((file) => toRows(file.content));
  let mergeFile = [];

  for (let i = 0; i < mergeFileRows[0].length; i++) {
    let currentRow = mergeFileRows[0][i];

    if (i < 9) {
      //skip 10 lines with document header
      mergeFile[i] = currentRow;
      continue;
    }

    for (let j = 1; j < mergeFileRows.length; j++) {
      let fileContent = mergeFileRows[j]; //j = 1 because I skip first file content
      currentRow += fileContent[i].slice(13); //return string whiout TIMI column;
    }
    mergeFile[i] = currentRow;
  }

  response.data = mergeFile.join("\r\n");
  return response;
}

function toRows(fileContent) {
  const rows = fileContent.split("\r\n"); //10 rows is header of document, 11 row is table heading. 12-13 rows - empty, 1 column of each document is TIMI
  return rows;
}

module.exports = { toRows, mergeFiles };

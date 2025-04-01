function mergeFiles(filesContent) {
  let response = {
    data: [],
    status: "Success",
  };

  const mergeFileRows = filesContent.data.map((file) => toRows(file.content));
  let mergeFile = [];
  let clearFile = [];
  const { timiRowPosition, timiPosition } =
    checkStructureOfFiles(mergeFileRows);

  for (let i = 0; i < mergeFileRows[0].length; i++) {
    let currentRow = mergeFileRows[0][i]; //init row with row of first file.

    if (i < timiRowPosition) {
      //skip lines with document header
      mergeFile[i] = currentRow;
      continue;
    }

    if (i > timiRowPosition + 3 && isNaN(parseInt(currentRow))) {
      //after document header and columns name
      //with duplicate document header. Gamma 1101 will be duplicate header each 200 rows, I am goin to skip it
      mergeFile[i] = undefined;
      continue;
    }

    for (let j = 1; j < mergeFileRows.length; j++) {
      let fileContent = mergeFileRows[j]; //j = 1 because I am going to skip first file content
      //return string without TIMI column; //some tables has 13 symbols for TIMI, some has 14. For safety work with each format, i need to add white space
      currentRow += fileContent[i].slice(timiPosition + 4);
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

//split raw string data in each file to separate string
function toRows(fileContent) {
  const rows = fileContent.split("\r\n"); //10 rows is header of document, 11 row is table heading. 12-13 rows - empty, 1 column of each document is TIMI

  return rows;
}

function checkStructureOfFiles(mergeFileRows) {
  let timiRowPosition;
  let timiPosition;

  const fileTimiPositions = mergeFileRows.map((file) => {
    let rowI = 0;

    //20 - expected max number of header rows in file
    while (rowI < 20) {
      const row = file[rowI];
      const timiIndex = row.indexOf("TIMI");
      if (timiIndex === -1) {
        rowI++;
        continue;
      }

      timiPosition = timiIndex;
      timiRowPosition = rowI;
      rowI++;
    }

    return { timiRowPosition, timiPosition };
  });

  let prevFileTimiPosition = fileTimiPositions[0];
  const isEqualPosition = fileTimiPositions.every(
    ({ timiRowPosition, timiPosition }, index) => {
      const comparision =
        prevFileTimiPosition.timiRowPosition === timiRowPosition &&
        prevFileTimiPosition.timiPosition === timiPosition;
      prevFileTimiPosition = fileTimiPositions[index];
      return comparision;
    }
  );

  if (!isEqualPosition) {
    throw new Error(
      "Позиція заголовка TIMI відрізняється для деякіх з обраних файлів. Можливо ви намагаєтесь об'єднати несумісні .T00 файли. Перевірте, що усі файли для злиття мають однакову структуру і відносяться до однієї бази даних"
    );
  }
  return { timiRowPosition, timiPosition };
}

module.exports = { toRows, mergeFiles };

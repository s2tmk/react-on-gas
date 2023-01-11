import { Data } from "../interfaces/data";

const doGet = () => {
  return HtmlService.createTemplateFromFile("index.html").evaluate();
};

const getSheet = () => {
  console.log("Start get sheet process");

  const app = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty("SPREADSHEET_ID") ?? ""
  );
  const sheet = app.getSheetByName(
    PropertiesService.getScriptProperties().getProperty("SHEET_NAME") ?? ""
  );

  console.log("Finish get sheet process");

  return sheet;
};

const getSheetData = () => {
  console.log("Start get data process");

  const sheet = getSheet();
  if (!sheet) throw new Error("Sheet doesn't exist");

  const values = sheet.getDataRange().getValues();
  let data: Data[] = [];

  for (let i = 0; i < values.length; i++) {
    if (i === 0) continue;
    const param: any = {};
    for (let j = 0; j < values[i].length; j++) {
      param[values[0][j].toLowerCase()] = values[i][j];
    }
    data = [...data, param];
  }

  console.log("Finish get data process");
  console.log("data");

  return { data, sheet };
};

const insertSheetData = (newData: Omit<Data, "id">) => {
  console.log("Start insert data process");

  const { data, sheet } = getSheetData();
  if (!data) throw new Error("Data doesn't exist");

  const newId = data.length === 0 ? 1 : Math.max(...data.map((d) => d.id)) + 1;
  const insertValues = [[newId, newData.name, newData.age, newData.job]];

  sheet.insertRows(2, 1);
  sheet.getRange(2, 1, 1, insertValues[0].length).setValues(insertValues);

  console.log("Finish insert data process");
  console.log({ insertValues });
};

const updateSheetData = (newData: Data) => {
  console.log("Start update data process");

  const { data, sheet } = getSheetData();
  if (!data) throw new Error("Data doesn't exist");

  const targetIndex = data.findIndex((d) => d.id === newData.id);
  const insertValues = [[newData.id, newData.name, newData.age, newData.job]];

  sheet
    .getRange(targetIndex + 2, 1, 1, insertValues[0].length)
    .setValues(insertValues);

  console.log("Finish update data process");
  console.log("{insetValues");
};

const deleteSheetData = (id: number) => {
  console.log("Start delete data process");

  const { data, sheet } = getSheetData();
  if (!data) throw new Error("Data doesn't exist");

  const targetIndex = data.findIndex((d) => d.id === id);

  sheet.deleteRow(targetIndex + 2);

  console.log("Finish delete data process");
};

export { getSheetData, insertSheetData, updateSheetData, deleteSheetData };

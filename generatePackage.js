const xlsx = require("xlsx");
const xmlbuilder = require("xmlbuilder");
const fs = require("fs");
const { exec } = require("child_process");

const filePath = process.argv[2];

function readExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

const generatePackage = (excelData) => {
  if (excelData.length === 0) {
    return null;
  }

  // Para cada fila, juntar los datos que sean del mismo Meta
  const metaMap = {};
  excelData.forEach((data) => {
    const { Tipo, Meta, Object, Api } = data;

    if (Meta != "" && Meta != null && Meta != undefined) {
      if (!metaMap[Meta]) {
        metaMap[Meta] = { Apis: [] };
      }

      if (Object) {
        if (Api) {
          metaMap[Meta].Apis.push(`${Object}.${Api}`);
        } else {
          metaMap[Meta].Apis.push(Object);
        }
      } else if (Api) {
        metaMap[Meta].Apis.push(Api);
      }
    }
  });

  return generatePackageXML(metaMap);
};

function generatePackageXML(metaMap) {
  const root = xmlbuilder
    .create("Package", { encoding: "UTF-8" })
    .att("xmlns", "http://soap.sforce.com/2006/04/metadata");

  // Para cada uno, generar un xml con los datos
  Object.keys(metaMap).forEach((meta) => {
    const { Apis } = metaMap[meta];
    const types = root.ele("types");
    Apis.forEach((object) => {
      types.ele("members", object);
    });
    types.ele("name", meta);
  });

  root.ele("version", "62.0");

  return root.end({ pretty: true });
}

try {
  if (!filePath) {
    throw new Error("No se ingresó un archivo");
  }
  const correctFilePath = filePath.includes(".xlsx")
    ? filePath
    : filePath + ".xlsx";

  if (!fs.existsSync(correctFilePath)) {
    throw new Error(`No se encontró el archivo ${correctFilePath}`);
  }

  const excelData = readExcelFile(correctFilePath);
  const xml = generatePackage(excelData);

  const outputDir = "./output";
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  // Escribir el XML en un archivo
  fs.writeFileSync(`${outputDir}/package.xml`, xml, "utf8");

  console.log(xml);

  const outputDirWindowsPath = outputDir.replace(/\//g, "\\");
  exec(`start ${outputDirWindowsPath}`, (err) => {
    if (err) {
      console.error("Error al abrir el explorador de archivos:", err);
      console.error("Command executed:", `explorer ${outputDirWindowsPath}`);
    }
  });
} catch (error) {
  console.error("Error:", error.message);
}

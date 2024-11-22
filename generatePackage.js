const xlsx = require("xlsx");
const xmlbuilder = require("xmlbuilder");
const fs = require("fs");
const readline = require("readline");

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

//Pedir nombre del archivo

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Usar la función para leer el archivo
rl.question("Ingrese el nombre del archivo: ", (filename) => {
  try {
    const excelData = readExcelFile(filename + ".xlsx");
    const xml = generatePackage(excelData);

    const outputDir = "./output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Escribir el XML en un archivo
    fs.writeFileSync(`${outputDir}/package.xml`, xml, "utf8");

    console.log(xml);
    rl.close();
  } catch (error) {
    console.log("Error al leer el archivo");
    rl.close();
  }
});

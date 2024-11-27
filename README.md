
## Salesforce Package Generator

Este proyecto es una herramienta para generar paquetes de Salesforce de manera automatizada.


### Características

- Generación automática de `package.xml` en base a un archivo Excel con metadatos.
- Soporte para múltiples tipos de metadatos.


### Instalación

Para instalar las dependencias del proyecto, ejecute:

```bash
npm install
```

### Uso

Para generar un paquete, ejecute:

```bash
npm run generate <ruta_del_archivo_excel>
```

### Instrucciones

1. Genera o modifica un archivo Excel similar a la plantilla `Metadatos.xlsx`.
2. Ejecuta el programa e introduce el nombre del archivo `.xlsx`.
3. En la carpeta `output` encontrarás el archivo `xml`.

### Tecnologías Usadas

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![xlsx](https://img.shields.io/badge/xlsx-217346?style=for-the-badge&logo=microsoft-excel&logoColor=white)
![xmlbuilder](https://img.shields.io/badge/xmlbuilder-FF6600?style=for-the-badge&logo=xml&logoColor=white)
![fs](https://img.shields.io/badge/fs-0078D4?style=for-the-badge&logo=windows&logoColor=white)
![child_process](https://img.shields.io/badge/child_process-0078D4?style=for-the-badge&logo=windows&logoColor=white)


## Salesforce Package Generator

Este proyecto es una herramienta para generar paquetes de Salesforce de manera automatizada.

### Características

- Generación automática de `package.xml` en base a un archivo Excel con metadatos.

### Instalación

Para instalar las dependencias del proyecto, ejecute:

```bash
npm install
```

### Uso

Para generar un paquete, ejecute:

```bash
node .\generatePackage.js
```

### Instrucciones

1. Genera o modifica un archivo Excel similar a la plantilla `Metadatos.xlsx`.
2. Ejecuta el programa e introduce el nombre del archivo `.xlsx`.
3. En la carpeta `output` encontrarás el archivo `xml`.



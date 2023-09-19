const fs = require("fs");
const path = require("path");

const variables = require("../json/colors.json");

let scssVariables = "";

for (const [key, value] of Object.entries(variables)) {
  scssVariables += `$${key}: ${value};\n`;
}

const outputPath = path.join(__dirname, "../dist/colors.scss");
fs.writeFileSync(outputPath, scssVariables);

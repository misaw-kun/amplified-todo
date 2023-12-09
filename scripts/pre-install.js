const fs = require("fs");

const buildProfile = process.env.EAS_BUILD_PROFILE;
const configProd = process.env.AMPLIFY_EXPORTS;
// const configDevelop = process.env.AMPLIFY_EXPORTS_DEVELOP;

// const config = buildProfile === "production" ? configProd : configDevelop;

const decoded = Buffer.from(configProd, "base64").toString();

fs.writeFileSync("./src/amplifyconfiguration.json", decoded);
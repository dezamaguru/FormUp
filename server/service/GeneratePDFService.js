const puppeteer = require("puppeteer");
const fs = require("fs-extra");
const hbs = require("handlebars");
const path = require("path");
const moment = require("moment");

const compile = async (templateName, data) => {
    const filePath = path.join(process.cwd(), "templates", `${templateName}.hbs`);
    const html = await fs.readFile(filePath, "utf-8");
    return hbs.compile(html)(data);
};

hbs.registerHelper("dateFormat", (value, format) => {
    return moment(value).format(format);
});

const generatePDFBuffer = async (templateName, data, saveLocal = false) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const html = await compile(templateName, data);
    await page.setContent(html);
    await page.emulateMediaType("screen");

    const pdfOptions = {
        format: "A4",
        printBackground: true,
        margin: {
            top: "40px",
            bottom: "40px",
            left: "40px",
            right: "40px",
        }
    };

    // let filePath = null;

    // if (saveLocal) {
    //     const fs = require("fs");
    //     const folderPath = path.join(__dirname, "../test-output");
    //     if (!fs.existsSync(folderPath)) {
    //         fs.mkdirSync(folderPath);
    //     }
    //     const fileName = `adeverinta.pdf`;
    //     filePath = path.join(folderPath, fileName);
    //     pdfOptions.path = filePath; // setează calea pentru salvare
    // }

    const buffer = await page.pdf(pdfOptions);

    await browser.close();

    if (filePath) {
        console.log("PDF salvat local la:", filePath);
    }

    return buffer;
};


module.exports = { generatePDFBuffer };

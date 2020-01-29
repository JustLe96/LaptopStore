const fs = require('fs');
const http = require('http');
const url = require('url');

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8');
const laptopData = JSON.parse(json);
//console.log(laptopData);

const server = http.createServer((req, res) => {
    const pathname = url.parse(req.url, true).pathname;
    const id = url.parse(req.url, true).query.id;
    // PRODUCT OVERVIEW
    if (pathname === '/products' || pathname === '') {
        res.writeHead(200, { 'Content-type': 'text/html', });
        fs.readFile(`${__dirname}/template/template_overview.html`, 'utf-8', (err, data) => {
            let overviewOutput = data;
            fs.readFile(`${__dirname}/template/template_card.html`, 'utf-8', (err, data) => {
                const cardOutputs = laptopData.map(el => replaceTemplate(data, el)).join('');
                overviewOutput = overviewOutput.replace('{%CARD%}', cardOutputs);
                res.end(overviewOutput);
            });
        });
    } 
    // LAPTOP DETAIL
    else if (pathname === '/laptop' && id < laptopData.length && id >= 0) {
        res.writeHead(200, { 'Content-type': 'text/html', });
        fs.readFile(`${__dirname}/template/template_laptop.html`, 'utf-8', (err, data) => {
            const laptop = laptopData[id];
            res.end(replaceTemplate(data, laptop));
        });
    } 
    // PAGE NOT FOUND
    else {
        res.writeHead(404, { 'Content-type': 'text/html', })
        res.end('This URL was not found on the server');
    }
});

server.listen(1337, '127.0.0.1', () => {
    console.log('listening for requests now');
});

const replaceTemplate = (data, laptop) => {
    let output = data.replace(/{%PRODUCTNAME%}/g, laptop.productName);
    output = output.replace(/{%IMAGE%}/g, laptop.image);
    output = output.replace(/{%PRICE%}/g, laptop.price);
    output = output.replace(/{%CPU%}/g, laptop.cpu);
    output = output.replace(/{%SCREEN%}/g, laptop.screen);
    output = output.replace(/{%RAM%}/g, laptop.ram);
    output = output.replace(/{%DESCRIPTION%}/g, laptop.description);
    output = output.replace(/{%STORAGE%}/g, laptop.storage);
    return output;
};
//Declaration et initialisation de tout les modules a utiliser dans le programmes
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const extra_fs = require('fs-extra');
const os = require('os')
var contentDisposition = require('content-disposition')
const mysql = require('mysql')


const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose")
const config = require('./BD.js')
const bodyParser = require('body-parser');

mongoose.Promise = global.Promise
mongoose.connect(config.DB, { userNewUrlParser: true }).then(
    () => { console.log("Database is connected") },
    err => { console.log('Can not connect to the database' + err) }
)

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Declaration des variables globales
var FILE_NAME = ''; //variable pour stocker le nom de fichier a traiter
var OUTPUT_FILE_NAME = ''; //variable pour stocker le nom de fichier traiter qui sort dans le dossier redacted files
var OUTPUT_FILE_NAME_CLICK = ''; //variable pour stocker le nom de fichier traiter qui sort dans le dossier clickable files
var selected_files = []; //un array pour stocker tout les fichiers pdf dans le dossier selectionner
var pdfpath_redacted; // variable pour le nom de chaque fichier traités + le mot redacted
var pdfpath_clickable; // variable pour le nom de chaque fichier traités + le mot clickable
var Time = 0; //Variable time pour un time quoi
var numBtn = 1; //Variable numbtn a utiliser pour le numero de button (a voir dans la fonction button_redacted)
var dir_home = os.homedir()
var dir_desktop = path.join(dir_home, "Desktop", "Download");



var redacted_files_directory = "Downloads/Readact"; //variable pour le dossier a vider a chaque fois que le programme commence a traiter un dossier selectionné
var zip_files_directory = "Downloads/zip"; //variable pour le dossier a vider a chaque fois que le programme commence a traiter un dossier selectionné
var clickable_files_directory = "Downloads/Clickable"; //variable pour le dossier a vider a chaque fois que le programme commence a traiter un dossier selectionné

// extra_fs.emptyDirSync(redacted_files_directory); //Vidage du dossier redacted_files
// extra_fs.emptyDirSync(clickable_files_directory); //Vidage du dossier clickables_files

const PORT = process.env.PORT || 8080

// const db = mysq.createConnection({
//     host: "localhost",
//     user: 'root',
//     password: '',
//     database : 'solumada'
// })

// db.connect((err) => {
//     if (err) {
//         throw err;
//     }
//     console.log("mysql conneced");
// })
// fonction pour ecrire dans un fichier progress.txt (utile pour le loading sur l'interface)
function progress(value) {
    let fs = require('fs');
    return fs.writeFileSync('./public/progress.txt', `${value}`);
}

var donne = []
http.createServer(function (req, res) {

    if (req.url == "/parametre" && req.method == "POST") {

        console.log("data " + donne);
        req.on('data', (data) => {
            //empty donne variable before push in
            console.log("data  === " + data);
            if (donne.length > 0) {
                for (let index = donne.length; index > 0; index--) {
                    donne.pop()
                }
            }

            var data1 = JSON.parse(data)
            for (let i = 0; i < data1.length; i++) {
                donne.push(data1[i])
                console.log("data1 iii  !!!! " +JSON.stringify(data1[i]) );
            }
        })


    }
    if (req.url == '/option') {
        extra_fs.emptyDirSync(zip_files_directory)

        var zipdir = require('zip-dir');
        zipdir('Downloads/Clickable', { saveTo: 'Downloads/zip/Clickable.zip' }, function (err, buffer) {
        });
        zipdir('Downloads/Readact', { saveTo: 'Downloads/zip/Readact.zip' }, function (err, buffer) {
        });
        fs.readFile("./public/option.html", "UTF-8", function (err, data) {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });

        // var path_click = 'Downloads/zip/Clickable.zip'
        // // //Set require Header
        // // // Request headers you wish to allow
        // res.setHeader('Content-Type', 'application/zip')
        // res.setHeader('Content-Disposition', contentDisposition(path_click))
        // // // send file
        // async function starting(params) {
        //     var stream1 = fs.createReadStream(path_click)
        //     await stream1.pipe(res)
        //     await stream1.on('close', () => {
        //         stream1.destroy()
        //     })
        // }
    }
    //Quand l'utilisateur click sur le bouton traitement l'url / fileupload va etre demander
    if (req.url == '/fileupload') {
        // variables à reinitialiser
        FILE_NAME = '';
        OUTPUT_FILE_NAME = '';
        OUTPUT_FILE_NAME_CLICK = '';
        selected_files = [];
        pdfpath_redacted;
        Time = 20000;
        numBtn = 1;
        // Utilisation de module formidable pour prendre les fichier dans le dossier selectionnes
        let form = new formidable.IncomingForm();
        form.on('file', function (field, file) {

            //Insertion des fichiers pdf dans l'array selected_files
            if (file.type === 'application/pdf')
                selected_files.push(file);
        });
        form.parse(req, async function (err, fields, files) {
            if (fields.btn1 == '') {
                //Demarrage du traitement
                extra_fs.emptyDirSync(redacted_files_directory); //Vidage du dossier redacted_files
                extra_fs.emptyDirSync(clickable_files_directory); //Vidage du dossier clickables_files
                extra_fs.emptyDirSync(redacted_files_directory); //Vidage du dossier redacted_files
                extra_fs.emptyDirSync(clickable_files_directory); //Vidage du dossier clickables_files
                progress(0); //Ecrire 0 dans le fichier progress.txt
                if (selected_files.length === 0) {
                    console.log('Aucun fichier PDF...')
                } else {
                    //Basculer l'index html en load html pour suivre la progression du traitement
                    req.url = '/load';
                    HTML('/load', './public/load.html');
                    for (let file of selected_files) {
                        if (file !== undefined) {
                            setTimeout(async () => {

                                let arr = file.name.split('/');
                                FILE_NAME = arr[arr.length - 1];
                                OUTPUT_FILE_NAME = FILE_NAME.split('.pdf')[0] + '_redacted.pdf';
                                OUTPUT_FILE_NAME_CLICK = FILE_NAME.split('.pdf')[0] + '_clickable.pdf';
                                pdfpath_redacted = path.join(redacted_files_directory, OUTPUT_FILE_NAME)
                                pdfpath_clickable = path.join(clickable_files_directory, OUTPUT_FILE_NAME_CLICK);

                                await create_redaction(file.path, donne); //une fonction pour traiter un fichier

                            }, Time); //Une fonction setTimeout de 10 seconde pour s'assurrer que le traitement du fichier soit bien fini (un fichier = 20 seconde)
                            //NB: Sur cette fonction si un ou plusieurs fichiers presente des champs non traitéés, il faudra augmenter le time
                            Time += 20000;
                        }
                    }
                    let current_nbr_file = 0; //variable pour compter les fichiers deja traites
                    const counter = setInterval(() => {
                        fs.readdir(redacted_files_directory, function (err, files) {
                            if (files.length != current_nbr_file) {
                                console.log(files.length + (!(files.length > 1) ? ' fichier traité' : ' fichiers traités'));
                                progress(files.length); //Ecrire le nombre de fichier traités dans progress.txt
                            }
                            current_nbr_file = files.length;
                            if (files.length >= selected_files.length) {
                                clearInterval(counter);
                                console.log('** Redaction terminée... **');
                            }
                        });
                    }, 1000);

                }
            }
        });
    }
    //parcours du dossier
    //downloading file process
    else if (req.method == "GET" && req.url == '/downloadClick') {
        var path_click = 'Downloads/zip/Clickable.zip'
        // //Set require Header
        // // Request headers you wish to allow
        res.setHeader('Content-Type', 'application/zip')
        res.setHeader('Content-Disposition', contentDisposition(path_click))
        // // send file
        var stream1 = fs.createReadStream(path_click)
        stream1.pipe(res)
        stream1.on('close', () => {
            stream1.destroy()
        })
        res.writeHeader(200, { "Content-Type": "text/plain" });
        res.write('File downloaded');
    }
    else if (req.method == "GET" && req.url == '/downloadRead') {
        var path_readact = 'Downloads/zip/Readact.zip'
        // //Set require Header
        // // Request headers you wish to allow
        res.setHeader('Content-Type', 'application/zip')
        res.setHeader('Content-Disposition', contentDisposition(path_readact))
        // // send file
        var stream2 = fs.createReadStream(path_readact)
        stream2.pipe(res)
        stream2.on('close', () => {
            stream2.destroy()
        })
        res.writeHeader(200, { "Content-Type": "text/plain" });
        res.write('File downloaded');
    }
    else if (req.method == 'GET' && req.url == '/progress.txt') {
        //Ecrire ce qui est dans le fichier progress.txt pour l'interface load.html
        res.writeHead(200, { 'content-type': 'text/plain' });
        fs.readFile('./public/progress.txt', 'utf8', function (err, data) {
            if (err) {
                return console.log(err);
            } else {
                res.writeHeader(200, { "Content-Type": "text/plain" });
                res.write(data);
                res.end();
            }
        });
    } else {
        if (req.url === "/") {
            fs.readFile("./public/index.html", "UTF-8", function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else if (req.url.match("\.css$")) {
            var cssPath = path.join(__dirname, 'public', req.url);
            var fileStream = fs.createReadStream(cssPath);
            res.writeHead(200, { 'Content-Type': "text/css" });
            fileStream.pipe(res);
        } else if (req.url.match("\.js$")) {
            var jsPath = path.join(__dirname, 'public', req.url);
            var fileStream = fs.createReadStream(jsPath);
            res.writeHead(200, { 'Content-Type': "text/js" });
            fileStream.pipe(res);
        }
        else if (req.url.match("\.jpg$")) {
            var jsPath = path.join(__dirname, 'public', req.url);
            var fileStream = fs.createReadStream(jsPath);
            res.writeHead(200, { 'Content-Type': "image/jpeg" });
            fileStream.pipe(res);
        }
    }

    var HTML = function (url, html_path) {
        if (req.url === url) {
            fs.readFile(html_path, "UTF-8", function (err, data) {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            });
        } else if (req.url.match("\.css$")) {
            var cssPath = path.join(__dirname, 'public', req.url);
            var fileStream = fs.createReadStream(cssPath);
            res.writeHead(200, { 'Content-Type': "text/css" });
            fileStream.pipe(res);
        } else if (req.url.match("\.js$")) {
            var jsPath = path.join(__dirname, 'public', req.url);
            var fileStream = fs.createReadStream(jsPath);
            res.writeHead(200, { 'Content-Type': "text/js" });
            fileStream.pipe(res);
        }
    }


}).listen(PORT); // port pour appeler le serveur app.js

// PDF REDACTION
const { PDFNet } = require('@pdftron/pdfnet-node')

const route = express.Router();
let Users = require('./public/model/model')
async function create_redaction(pdffile, cachedata) {
    for (let index = 0; index < cachedata.length; index++) {
        let clef = cachedata[index].name
        console.log("clef == ", clef);
        if (clef == "Nom" || clef == "Adresse" || clef == "Ville") {
            if (clef == "Nom") {
                try {
                    let result = await Users.distinct('nom');
                    result.forEach(async element => {
                        if (element.length !== 0) {
                            let nom =
                            {
                                name: "Noms",
                                pattern: String(element)
                            }
                            await search_redact(nom);
                        }
                    });
                    // res.json({
                    //     sql
                    // });
                } catch (error) {
                    logger.error(error);
                    res.status(500).json({ details: error });
                }
            } else if (clef == "Adresse") {
                try {
                    let result = await Users.distinct('adresse');
                    result.forEach(async r => {
                        if (r.length !== 0) {
                            let adresse =
                            {
                                name: "Adresse",
                                pattern: String(r)
                            }
                            await search_redact(adresse);
                        }
                    });
                } catch (error) {
                    logger.error(error);
                    res.status(500).json({ details: error });
                }
            } else if (clef == "Ville") {
                try {
                    let result = await Users.distinct('ville');

                    result.forEach(async element => {
                        if (element.length !== 0) {
                            let ville =
                            {
                                name: "Ville",
                                pattern: String(element)
                            }
                            await search_redact(ville);
                        }
                    });
                } catch (error) {
                    logger.error(error);
                    res.status(500).json({ details: error });
                }
            }
        } else {
            await search_redact(cachedata[index]);
        }
    }
    //con.end()


    var inputPath_redacted = pdffile; // pdf a chercher
    var inputPath_clickable = pdffile; // pdf a chercher
    //Fonction pour chercher un mot dans le pdf
    function search_redact(pattern) {
        const main = async () => {
            try {
                const doc = await PDFNet.PDFDoc.createFromUFilePath(pdffile);
                doc.initSecurityHandler();
                doc.lock();
                const txtSearch = await PDFNet.TextSearch.create();
                let mode = (PDFNet.TextSearch.Mode.e_whole_word | PDFNet.TextSearch.Mode.e_highlight) + PDFNet.TextSearch.Mode.e_reg_expression;
                txtSearch.begin(doc, pattern.pattern, mode);
                let result = await txtSearch.run();
                while (true) {
                    if (result.code === PDFNet.TextSearch.ResultCode.e_found) {
                        let hlts = result.highlights;
                        hlts.begin(doc);
                        while ((await hlts.hasNext())) {
                            const quadArr = await hlts.getCurrentQuads();
                            for (let i = 0; i < quadArr.length; ++i) {
                                //Coordonnée du mot trouvé dans le pdf 
                                const currQuad = quadArr[i];
                                const x1 = Math.min(Math.min(Math.min(currQuad.p1x, currQuad.p2x), currQuad.p3x), currQuad.p4x);
                                const x2 = Math.max(Math.max(Math.max(currQuad.p1x, currQuad.p2x), currQuad.p3x), currQuad.p4x);
                                const y1 = Math.min(Math.min(Math.min(currQuad.p1y, currQuad.p2y), currQuad.p3y), currQuad.p4y);
                                const y2 = Math.max(Math.max(Math.max(currQuad.p1y, currQuad.p2y), currQuad.p3y), currQuad.p4y);
                                redact_create(x1, y1, x2, y2, result.page_num, pattern.name); //Mettre un redact dans le coordonnée designé
                                button_create(x1, y1, x2, y2, result.page_num, pattern.name); //Mettre un masque clickable dans le coordonnée designé
                                break;
                            }
                            hlts.next();
                            break;
                        }
                        while (await hlts.hasNext()) {
                            await hlts.next();
                        }
                    } else if (result.code === PDFNet.TextSearch.ResultCode.e_page) {
                        ////////////////////////////////////////

                    } else if (result.code === PDFNet.TextSearch.ResultCode.e_done) {
                        ///////////////////////////////////////
                        await doc.save(pdfpath_redacted, PDFNet.SDFDoc.SaveOptions.e_linearized);
                        inputPath_redacted = pdfpath_redacted;
                        await doc.save(pdfpath_clickable, PDFNet.SDFDoc.SaveOptions.e_linearized);
                        inputPath_clickable = pdfpath_clickable;
                        break;
                    }
                    result = await txtSearch.run();
                }
            } catch (err) {
                console.log(err);
            }
            //Fonction pour redacter
            function redact_create(x1, y1, x2, y2, page_num, name) {
                ((exports) => {
                    exports.runPDFRedactTest = () => {
                        const main = async () => {
                            try {
                                const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath_redacted);
                                doc.initSecurityHandler();

                                const blankPage = await doc.getPage(page_num);
                                const btn_field = await doc.fieldCreate("button." + numBtn, PDFNet.Field.Type.e_button);
                                const btnbox = await PDFNet.PushButtonWidget.createWithField(doc, await PDFNet.Rect.init(x1, y1, x2, y2), btn_field);
                                btnbox.setBackgroundColor(await PDFNet.ColorPt.init(0, 0, 0), 1);
                                fields = ["button." + numBtn];
                                //await btnbox.setAction(await PDFNet.Action.createHideField(doc, fields));
                                btnbox.setStaticCaptionText(name)
                                btnbox.refreshAppearance();
                                blankPage.annotPushBack(btnbox);

                                numBtn++;

                                await doc.save(pdfpath_redacted, PDFNet.SDFDoc.SaveOptions.e_linearized);
                                inputPath_redacted = pdfpath_redacted;
                            } catch (err) {
                                console.log(err.stack);
                            }
                        };

                        // add your own license key as the second parameter, e.g. PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY')
                        PDFNet.runWithCleanup(main).then(function () { PDFNet.shutdown(); });
                    };
                    exports.runPDFRedactTest();
                })(exports);

            }

            // Fonction pour creer un bouton
            function button_create(x1, y1, x2, y2, page_num, name) {
                ((exports) => {

                    exports.runPDFRedactTest = () => {

                        const main = async () => {
                            try {
                                const doc = await PDFNet.PDFDoc.createFromFilePath(inputPath_clickable);
                                doc.initSecurityHandler();
                                const blankPage = await doc.getPage(page_num);

                                const btn_field = await doc.fieldCreate("button." + numBtn, PDFNet.Field.Type.e_button);
                                const btnbox = await PDFNet.PushButtonWidget.createWithField(doc, await PDFNet.Rect.init(x1, y1, x2, y2), btn_field);
                                btnbox.setBackgroundColor(await PDFNet.ColorPt.init(0, 0, 0), 1);
                                fields = ["button." + numBtn];
                                await btnbox.setAction(await PDFNet.Action.createHideField(doc, fields));
                                btnbox.setStaticCaptionText(name)
                                btnbox.refreshAppearance();
                                blankPage.annotPushBack(btnbox);

                                numBtn++;
                                await doc.save(pdfpath_clickable, PDFNet.SDFDoc.SaveOptions.e_linearized);
                                inputPath_clickable = pdfpath_clickable;
                            } catch (err) {
                                console.log(err.stack);
                                ret = 1;
                            }
                        };
                        // add your own license key as the second parameter, e.g. PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY')
                        PDFNet.runWithCleanup(main).then(function () { PDFNet.shutdown(); });
                    };
                    exports.runPDFRedactTest();
                })(exports);
            }

        }
        PDFNet.runWithCleanup(main).catch((err) => {
            console.log(err);
        }).then(() => {
            PDFNet.shutdown();
        });

    }
}



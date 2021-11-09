const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
    console.log("The server started on port 3000 !!!!!!");
});

const storage = multer.diskStorage({
    destination: (req, file, callBack) => {
        callBack(null, 'img')
    },
    filename: (req, file, callBack) => {
        callBack(null, `fukuro-`+Date.now() + '.jpg')
    }
})

const upload = multer({ storage: storage })

//let upload = multer({ dest: 'uploads/' })

app.get("/", (req, res) => {
    res.send(
        `<div><br><h1 style='text-align: center'>
            FUKURO UPLOAD <br>
            <img src="https://yt3.ggpht.com/ytc/AKedOLTXiC5MPUVXTDvRIMOtjrxjbaEpXOwd_QkTywon=s900-c-k-c0x00ffffff-no-rj" width="25%">
        </h1></div>`
    );
});

app.post('/file', upload.single('file'), (req, res, next) => {
    const file = req.file;
    console.log(file.filename);
    if (!file) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file);
})

app.post('/multipleFiles', upload.array('files'), (req, res, next) => {
    const files = req.files;
    console.log(files);
    if (!files) {
        const error = new Error('No File')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send({sttus:  'ok'});
})

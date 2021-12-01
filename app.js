const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use('/img', express.static('img'));

app.listen(3000, () => {
  console.log("The server started on port 3000 !!!!!!");
});

const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
      callBack(null, 'img');
    }
    else {
      callBack(new Error("not image"), false);
    }
  },
  filename: (req, file, callBack) => {
    callBack(null, 'fukuro' + (Math.floor(Math.random() * 999) + 100) + '-' + Date.now() + '.jpg');
  }
})

const upload = multer({ storage: storage })

//let upload = multer({ dest: 'uploads/' })

app.get("/", (req, res) => {
  res.send(
    `<h1 style='text-align: center'>
            Wellcome to Fukuro Upload
            <br><br>
            <b style="font-size: 182px;">😃</b>
        </h1>`
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
  res.send(files);
})

app.delete('/file/delete',(req, res, next) => {
  const filePath = 'img/'+req.body['file_name'];
  try {
    fs.unlinkSync(filePath)
    res.send({status: 'Success'})
    //file removed
  } catch(err) {
    res.send({status: 'Fail'})
    console.error(err)
  }
})

app.delete('/files/delete',(req, res, next) => {
  const files = req.body['files_name'];
  let flag = false;
  files.forEach(function(filePath) {
    filePath = 'img/'+filePath;
    try {
      fs.unlinkSync(filePath)
      flag = true;
    } catch(err) {
      flag = false;
      console.error(err)
    }
  });
  if(flag == true){
    res.send({status: 'Success'})
  }else{
    res.send({status: 'Fail'})
  }
})

const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const fileUpload = require("express-fileupload");

app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.listen(3000,()=>console.log('Express server is running'));

// create connection and export it
var db = mysql.createConnection({
  host:'localhost',
  user: 'root',
  password: 'mnaa090601mysql',
  database: 'intelliq22',
  multipleStatements: true
});

module.exports = { db };

// for file upload
app.post('/upload', (req, res) => {
  const filename =  Date.now() + '-' + req.files.file.name;
  const md5 = req.files.file.md5;
  const saveAs = `${md5}_${filename}`;
  req.files.file.mv(`${__dirname}/public/${saveAs}`,(err)=>{
    if(err){
      return res.send(err);
    }
  });
  console.log(req.files);

  const fs = require('fs');
  const readableStream = fs.createReadStream("./public/"+saveAs.toString());
  readableStream.on('data', (chunk) => {
    str = chunk.toString();
    console.log(str);
    json = JSON.parse(str);
    console.log(json["questions"][0]["qID"]);
  })
});

app.get('/admin/healthcheck', function(req, res, next) {
  db.connect((err)=>{
    if(!err) console.log('DB connection succeeded.');
    else console.log('DB connection failed \n Error : ' + JSON.stringify(err,undefined,2));
  });
  db.connect(function(err) {
    if (err) {
        res.send({ message: "Wrong username/password combination!"});
    }
    console.log('Connected to the MySQL server.');
  });
});

app.post('/login', function(req, res, next) {
  const email = req.body.username;
  const password = req.body.password;

  db.query(
    "SELECT * FROM member WHERE email = ? AND password = ?", [email,password], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      if(result.length>0) {
        res.send(result);
      } else {
        res.send({ message: "Wrong username/password combination!"})
      }
    }
  )
});

app.post('/admin/questionnaires', function(req, res, next) {
  const id = req.body.id;
  console.log(id);
  db.query(
    "SELECT * FROM questionnaire_form WHERE member_id = ?", [id], (err, result) => {
      if(err) {
        res.send({err: err})
      }
      res.send(result);
      console.log(result);
    }
  )
});


/*
//route setup for homepage
app.get('/intelliq_api', (req, res) =>{
    res.render('../views/index.ejs')
})

// set view engine
app.set("view engine","ejs")

// load assets
//app.use(express.static(path.resolve(__dirname,"assets")))

// Routes
const viewRoutes = require('./routes/routes');
app.use('/',viewRoutes);


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({storage});
app.post('/upload',upload.single('file'), (req, res) => {
  upload(req, res, (err) => {
      if (err) {
          return res.status(500).json(err)
      }

      return res.status(200).send(req.files)
  })
});
*/

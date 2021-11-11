const express = require('express')
const app = express()
const { Connection, Request } = require("tedious");



// const fileUpload = require('express-fileupload')


const Sqltest = require('./Sqltest');
let loginPass;

const cors = require('cors')
app.use(cors());
app.use(express.json());

app.post('/registration', (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const phonenumber = req.body.phonenumber
    const password = req.body.password
    console.log(email, username, phonenumber, password);

    Sqltest.signup(email, username, phonenumber, password);
    let x = setTimeout(() => {
        let ss = Sqltest.signupSuccess();
        res.send({
            signup: ss.result,
            error: ss.error
        });
    }, 4000);
});

app.post('/login', (req, res) => {
    
    const username = req.body.username
    const password = req.body.password
    console.log(username, password);

    Sqltest.login(username, password);
    let x = setTimeout(() => {
        res.send({
            login: Sqltest.bachalo().result,
            error: Sqltest.bachalo().error,
            username: username
        });
    },4000);
    // console.log(Sqltest.bachalo());
    
});

app.post('/uploadmetadata', (req, res) => {
    const username = req.body.username;
    const filename = req.body.filename;
    console.log(1);
    console.log(username, filename);
    console.log(2);
    Sqltest.uploadMetaData(username, filename);
    console.log(3);
})

app.post('/deletefile', (req, res) => {
    const username = req.body.username;
    const filename = req.body.filename;
    console.log(username, filename);
    Sqltest.deleteContainerFiles(username, filename);
    let x = setTimeout(() => {
        let dd = Sqltest.deleteSuccess();
        res.send({
            deleted: dd.result,
            error: dd.error
        })
    }, 4000)
})

app.post('/downloadBlob', (req, res) => {
    const username = req.body.username;
    const filename = req.body.filename;
    console.log(username, filename);
    Sqltest.downloadFile(username, filename);
    let x = setTimeout(() => {
        let df = Sqltest.deleteSuccess();
        res.send({
            downloaded: df.result,
            error: df.error
        })
    }, 1000)
})


// app.post('/upload', (req, res) => {
//     if (req.files === null) {
//       return res.status(400).json({ msg: 'No file uploaded' });
//     }
  
//     const file = req.files.file;
  
//     file.mv(`${__dirname}/client/public/uploads/${file.name}`, err => {
//       if (err) {
//         console.error(err);
//         return res.status(500).send(err);
//       }
  
//       res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });
//     });
// });


app.listen(3001, ()=>{console.log("yay your server is running on port 3001");})


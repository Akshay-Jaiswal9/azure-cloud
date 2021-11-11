const express = require('express')
const app = express()

const Sqltest = require('./Sqltest');

const cors = require('cors')
app.use(cors());
app.use(express.json());

app.post('/registration', (req, res) => {
    const email = req.body.email
    const username = req.body.username
    const phonenumber = req.body.phonenumber
    const password = req.body.password
    
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
    
    Sqltest.login(username, password);
    let x = setTimeout(() => {
        res.send({
            login: Sqltest.bachalo().result,
            error: Sqltest.bachalo().error,
            username: username
        });
    },4000);
    
});

app.post('/uploadmetadata', (req, res) => {
    const username = req.body.username;
    const filename = req.body.filename;
    Sqltest.uploadMetaData(username, filename);
})

app.post('/deletefile', (req, res) => {
    const username = req.body.username;
    const filename = req.body.filename;
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
    Sqltest.downloadFile(username, filename);
    let x = setTimeout(() => {
        let df = Sqltest.deleteSuccess();
        res.send({
            downloaded: df.result,
            error: df.error
        })
    }, 1000)
})

app.listen(3001, ()=>{console.log("yay your server is running on port 3001");})

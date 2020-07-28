const express = require('express');
const mongoose = require('mongoose');
const userModel = require('./models/user');
const bodyParser = require('body-parser');
const QRCode = require('qrcode');

// connect db
mongoose.connect('mongodb://127.0.0.1:27017/qrdemo', { useNewUrlParser: true })
    .then(() => console.log('connected to db'))
    .catch((err) => console.log(err));

// init app
const app = express();

// set the template engine
app.set('view engine', 'ejs');

// fetch data from the request
app.use(bodyParser.urlencoded({ extended: false }));

// default page load
app.get('/', (req, res) => {
    userModel.find((err, data) => {
        if (err) {
            console.log(err);
        } else {
            if (data != '') {
                var temp = [];
                for (var i = 0; i < data.length; i++) {
                    var name = {
                        data: data[i].name
                    }
                    temp.push(name);
                    var phno = {
                        data: data[i].phno
                    }
                    temp.push(phno);
                }
                // Returns a Data URI containing a representation of the QR Code image
                QRCode.toDataURL(temp, { errorCorrectionLevel: 'H' }, function(err, url) {
                    console.log(url);
                    res.render('home', { data: url });
                });
            } else {
                res.render('home', { data: '' });
            }
        }
    });
});

app.post('/', (req, res) => {
    var userr = new userModel({
        name: req.body.name,
        phno: req.body.phno
    });
    userr.save((err, data) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

// assign port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`server run at port ${port}`));
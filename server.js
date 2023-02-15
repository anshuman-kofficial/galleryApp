const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const imageModel = require('./models/imageModel')
const multer = require('multer');
const fs = require('fs')
const path = require('path')

const app = express()

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, 'uploads');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
 
const upload = multer({ storage: storage })

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.set("view engine", "ejs")
app.use(express.static("public"))


app.get('/', (req, res) => {
    imageModel.find({}, (err, images) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
        else {
            res.render('index', { images: images });
        }
    });
});


app.post('/', upload.single('image'), (req, res) => {
    var saveImage = {
        image: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }

    imageModel.create(saveImage, (err, image) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

const PORT = 3000

mongoose.connect(
  "mongodb+srv://anshuman:koADCE2VduNBNJgn@anshuman.jh6tpic.mongodb.net/galleryApp?retryWrites=true&w=majority"
).then(()=> {
    app.listen(PORT, ()=>{
      console.log(`Server is running on ${PORT} & DB is Connected!`)
    })
  })
  .catch((error)=> {
    console.log(error)
  });
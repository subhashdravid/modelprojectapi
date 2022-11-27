import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path"
const app = express();
dotenv.config();
app.use(bodyParser.json());
app.use(express.static('data'))
// mongodb connection
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("connected with database");
  })
  .catch((err) => {
    console.log("connection problem ");
    console.log(err);
  });

// CONST SCHEMA
const dataSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  desc: {
    type: String,
  },
  img: {
    type: String,
  },
  music: {
    type: String,
  },
});

const DataModel = mongoose.model("data", dataSchema);

// image upload code
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "data");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

const cpUpload = upload.fields([
  { name: "img", maxCount: 1 },
  { name: "music", maxCount: 1 },
]);

app
  .get("/get", async(req, res, next) => {
    const data = await DataModel.find();
    res.status(200).json({ msg: "data goted",data:data });
  })
  .post("/set", cpUpload, async(req, res, next) => {
    const files = req.files;

    const img = files.img[0].filename;
    const music = files.music[0].filename;

    const { title, desc } = req.body;
    let data = { title, desc, img, music };

    const mydata = new DataModel(data)
        data =  await mydata.save()
    res.status(200).json({msg:'data stored ', data: data });
  }).get('/admin',async(req,res,next)=>{
res.status(200).sendFile(path.join(__dirname,'./page/index.html'))
  })

app.listen(process.env.APP_PORT || 9000, () => {
  console.log(`the server is runnign port no ${process.env.APP_PORT || 9000}`);
});


module.exports = app;
import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';
import config from '../config';

const router = express.Router();
const s3 = new aws.S3();
aws.config.update({
  accessKeyId: config.accessKeyId,
  secretAccessKey: config.secretAccessKey,
  region:"ap-south-1"
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type, only JPEG and PNG is allowed!"), false);
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: "public-read",
    s3,
    bucket: 'sugandham-bucket',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: "TESTING_METADATA" });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

const singleUpload = upload.single("image");

router.post("/", (req, res) =>  {

  singleUpload(req, res, (err) =>  {
    if (err) {
      console.log('Error uploading'+ err );
      return res.send(err);
    }
    return res.send(req.file.location);
});

});



export default router;

import { Request } from "express";
import multer from "multer"
import path from 'path'

const storage = multer.diskStorage({
  destination: function(req: Request, file: Express.Multer.File, callback) {
    callback(null, path.join(path.resolve('src'), 'images'));
  },
  filename: function (req: Request, file: Express.Multer.File, callback) {
    callback(null, file.originalname);
  }
});

export const upload = multer({storage})
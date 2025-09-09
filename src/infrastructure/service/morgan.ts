import fs from 'fs';
import path from "path";
import * as rfs from "rotating-file-stream";

const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

export const accessLogStream = rfs.createStream("access.log", {
    interval: "1d",       
    path: logDirectory,
    maxFiles: 7            
  });

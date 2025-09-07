const multer = require("multer");
const path = require("path");
const fs = require("fs");


["uploads/thumbnails", "uploads/certificates", "uploads/lectures"].forEach((folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname.includes("thumbnail")) {
      cb(null, "uploads/thumbnails");
    } else if (file.fieldname.includes("certificateTemplate")) {
      cb(null, "uploads/certificates");
    } else if (file.fieldname.startsWith("lectures")) {
      cb(null, "uploads/lectures");
    }
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });
module.exports = upload;

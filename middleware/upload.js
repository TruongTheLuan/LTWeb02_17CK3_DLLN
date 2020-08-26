const multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      if(file.mimetype == 'audio/mp3'){
          cb(null,'./audios');
      }
      
      if(file.mimetype == 'image/jpg'
        | file.mimetype == 'image/png' | file.mimetype == 'image/jpeg'){
          cb(null,'./uploads');
      }
     
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
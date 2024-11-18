const express = require('express');
const multer = require('multer');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { login, signup } = require('./auth');
const db = require('./db');

router.post('/login', login);
router.post('/signup', signup);

router.get('/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).send(rows);
  });
});

// Initialize Multer to save uploaded files to 'uploads/' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);  // Create the 'uploads' folder if it doesn't exist
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = Date.now() + fileExtension;  // Use a unique file name
    cb(null, fileName);
  }
});

const upload = multer({
  storage: storage
}); // Multer setup

// POST route to insert customer data (with FormData)
router.post('/insertcustomer', upload.fields([
  { name: 'name', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
  { name: 'word', maxCount: 1 },
  { name: 'access', maxCount: 1 }
]), (req, res) => {
  // You will receive the file paths or empty strings in req.body
  const { name, photo, video, pdf, word, access } = req.body;  // photo, video, pdf, word will be the file paths or empty strings

  // Check if files are present, otherwise use the empty strings
  const photoPath = req.files?.photo ? req.files.photo[0].path : photo;
  const videoPath = req.files?.video ? req.files.video[0].path : video;
  const pdfPath = req.files?.pdf ? req.files.pdf[0].path : pdf;
  const wordPath = req.files?.word ? req.files.word[0].path : word;

  // Check if required fields (like name) are missing or invalid
  if (!photoPath && !videoPath && !pdfPath && !wordPath) {
    return res.status(400).send({
      message: "At least one file must be provided"
    });
  }

  // Prepare the SQL insert statement
  const insert = db.prepare("INSERT INTO customers (name, photo, video, pdf, word, access) VALUES (?, ?, ?, ?, ?, ?)");

  // Insert customer into the database
  insert.run(name, photoPath, videoPath, pdfPath, wordPath, access);

  // Finalize the insert statement
  insert.finalize();

  // Respond to the client
  res.status(201).send({
    message: "Customers imported successfully"
  });
});

router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// GET route to retrieve all customers
router.get('/customers-data', (req, res) => {
  // Query to select all customers from the database
  db.all("SELECT * FROM customers", (err, rows) => {
    if (err) {
      return res.status(500).send({
        message: "Error retrieving customers",
        error: err
      });
    }
    // Return the results as a JSON response
    res.status(200).json(rows);
  });
});

// DELETE customer route
router.delete('/customers/:id', (req, res) => {
  const userId = req.params.id;

  db.run('DELETE FROM customers WHERE id = ?', [userId], function(err) {
      if (err) {
          return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
          return res.status(404).json({ message: 'Customer not found' });
      }
      res.status(200).json({ message: 'Customer deleted successfully' });
  });
});

router.get('/outData', (req, res) => {
  db.all("SELECT * FROM outs order by id", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).send(rows);
  });
});

router.post('/import-outs', (req, res) => {
  const outData = req.body;

  db.run("DELETE FROM outs", (err) => {
    if (err) return res.status(500).send(err.message);
    
    const insert = db.prepare("INSERT INTO outs (access,id,new,outDate,name,nickName,ic,phone,income,occupation,pic,divide,source,account,owe,take,ins,fees,open,deposit,pay,dueDate,dueTime,duration,keep,note) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    outData.forEach(out => {
      insert.run(out.access, out.id, out.new, out.outDate, out.name, out.nickName, out.ic, out.phone, 
        out.income, out.occupation, out.pic, out.divide, out.source, out.account, out.owe, out.take, 
        out.ins, out.fees, out.open, out.deposit, out.pay, out.dueDate, out.dueTime, out.duration, 
        out.keep, out.note);
    });
    insert.finalize();

    res.status(201).send({ message: "Out Data imported successfully" });
  });
});

router.get('/inData', (req, res) => {
  db.all("SELECT * FROM ins order by id", [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.status(200).send(rows);
  });
});

router.post('/import-ins', (req, res) => {
  const inData = req.body;

  db.run("DELETE FROM ins", (err) => {
    if (err) return res.status(500).send(err.message);
    
    const insert = db.prepare("INSERT INTO ins (access,id,inDate,name,ins,payment,fees,income,receive,kanzhang,clear,total,account,next,note) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
    inData.forEach(data => {
      insert.run(data.access, data.id, data.inDate, data.name, data.ins, data.payment, data.fees, data.income, 
        data.receive, data.kanzhang, data.clear, data.total, data.account, data.next, data.note);
    });
    insert.finalize();

    res.status(201).send({ message: "In Data imported successfully" });
  });
});


module.exports = router;

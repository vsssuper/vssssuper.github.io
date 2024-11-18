const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY, 
      name TEXT, photo TEXT, 
      video TEXT, 
      pdf TEXT, 
      word TEXT,
      access TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS outs (
      idNo INTEGER PRIMARY KEY AUTOINCREMENT,
      access TEXT NOT NULL,
      id TEXT NOT NULL,
      new TEXT,
      outDate TEXT,
      name TEXT,
      nickName TEXT,
      ic INTEGER,
      phone INTEGER, 
      income INTEGER,
      occupation TEXT,
      pic TEXT,
      divide TEXT,
      source TEXT,
      account TEXT,
      owe INTEGER,
      take INTEGER,
      ins INTEGER,
      fees INTEGER,
      open INTEGER,
      deposit INTEGER,
      pay INTEGER,
      dueDate TEXT,
      dueTime TEXT,
      duration TEXT,
      keep TEXT,  
      note TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS ins (
      idNo INTEGER PRIMARY KEY AUTOINCREMENT,
      access TEXT NOT NULL,
      id TEXT NOT NULL,
      inDate TEXT,
      name TEXT,
      ins INTEGER,
      payment INTEGER,
      fees INTEGER,
      income INTEGER,
      receive INTEGER,
      kanzhang INTEGER,
      clear INTEGER,
      total INTEGER,
      account TEXT,
      next TEXT,  
      note TEXT
    )
  `);
});

module.exports = db;

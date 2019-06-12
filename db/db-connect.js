//connection for mysql
var mysql = require('mysql');


var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '29871486-Jesper',
  database: 'relateit'
});

connection.connect(function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("connected");
  };
});

module.exports = connection;

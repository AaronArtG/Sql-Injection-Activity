const http = require('http'),
      path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();


const app = express();
app.use(express.static('.'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
	db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
	db.run("INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')");
});app.post('/login', function(req, res) {
  // Get the username and password from the request body
  var username = req.body.username;
  var password = req.body.password;

  // Construct the SQL query
  var query = "SELECT title FROM user WHERE username = '" + username + "' AND password = '" + password + "'";

  // Log the username, password, and SQL query
  console.log("Username:", username);
  console.log("Password:", password);
  console.log("SQL Query:", query);

  // Run the SQL query using the db.get() method
  db.get(query, function(err, row) {
    if (err) {
      // Handle any errors
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else {
      if (row) {
        // Valid login
        res.send("Login successful");
      } else {
        // Invalid login
        res.send("Invalid login");
      }
    }
  });
});
app.listen(3000, function() {
  console.log('Server is running on port 3000');
});


app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

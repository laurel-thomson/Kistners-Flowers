var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./data/flowers.db');

var arrangements = {}


//gets all the arrangements from the database
arrangements.getAll = function(callback) {
    var sql = `SELECT arrangements.id, name, description,
              GROUP_CONCAT(arrangements_photos.id) AS photo_ids
              FROM arrangements LEFT JOIN arrangements_photos
              ON arrangements.id = arrangements_photos.arrangement_id
              GROUP BY arrangements.id;`;
    db.all(sql, (err, rows) => {
        if(err) return callback(err);
        if(!rows) return callback("Not Found");
        
        rows.map(row => {
            row.photo_ids = row.photo_ids ? row.photo_ids.split(",") : []
        });
        
        return callback(false, rows);
    });
}

arrangements.featured = function(count, callback) {
  var sql = `SELECT arrangements.id, name, description,
              GROUP_CONCAT(arrangements_photos.id) AS photo_ids
              FROM arrangements LEFT JOIN arrangements_photos
              ON arrangements.id = arrangements_photos.arrangement_id
              GROUP BY arrangements.id;`
  db.all(sql, (err, rows) => {
      if (err) return callback(err);
    // Preprocess photo_ids from a string to an array
    rows.map(row => {
      row.photo_ids = row.photo_ids ? row.photo_ids.split(",") : []
    });
    // If more arrangements were requested than available,
    // send all we have
    if(rows < count) return callback(rows);
    // Ohterwise, pick [count] random items from the array
    var selected = [];
    var selectedIds = [];
    // Invariant - still need to pick more elements
    while(selected.length < count) {
      var id = Math.floor(Math.random() * rows.length);
      // make sure we haven't already added this id
      if(!selectedIds.includes(id)) {
        selected.push(rows[id]);
        selectedIds.push(id);
      }
    }
    callback(err, selected);
  });
}


arrangements.find = function(id, callback) {
  var sql = `SELECT arrangements.id, name, description,
              GROUP_CONCAT(arrangements_photos.id) AS photo_ids
              FROM arrangements LEFT JOIN arrangements_photos
              ON arrangements.id = arrangements_photos.arrangement_id
              WHERE arrangements.id = ?
              GROUP BY arrangements.id;`;
  db.get(sql, id, (err, row) => {
    // Check for errors
    if(err) return callback(err);
    if(!row) return callback("Not Found");
    // Preprocess photo_ids from a string to an array
    row.photo_ids = row.photo_ids ? row.photo_ids.split(",") : [];
    // Send the result
    callback(false, row);
  });
}

var arrangementImages = {}


arrangementImages.find = function(id, callback) {
  db.get("SELECT * FROM arrangements_photos WHERE id = ?;", id, (err, row) => {
    if(err) console.error(err);
    callback(err, row);
  });
}

module.exports = {
  arrangements,
  arrangementImages,
  db
}

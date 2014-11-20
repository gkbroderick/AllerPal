var fn = document.getElementById("nameInput");

fn.value = localStorage.getItem("nameInput");
document.getElementById("nameOutput").textContent = fn.value;

fn.addEventListener('input', function() {
  localStorage.setItem('nameInput', fn.value);}, false);

document.getElementById("nameSubmit").addEventListener('click', function(){
  document.getElementById("nameOutput").textContent = fn.value;
  });


// AllergyList webdb

var allergyList = {};
allergyList.webdb = {};
allergyList.webdb.db = null;

allergyList.webdb.open = function() {
  var dbSize = 5 * 1024 * 1024; // 5MB
  allergyList.webdb.db = openDatabase("Test2", "1.0", "Allergy List Manager", dbSize);
}

allergyList.webdb.createTable = function() {
  var db = allergyList.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("CREATE TABLE IF NOT EXISTS allergy(ID INTEGER PRIMARY KEY ASC, allergy TEXT, added_on DATETIME)", []);
  });
}

allergyList.webdb.addAllergy = function(allergyText) {
  var db = allergyList.webdb.db;
  db.transaction(function(tx) {
    var addedOn = new Date();
    tx.executeSql("INSERT INTO allergy(allergy, added_on) VALUES (?,?)", [allergyText, addedOn],
    allergyList.webdb.onSuccess,
    allergyList.webdb.onError);
  });
}

allergyList.webdb.onError = function(tx, e) {
  alert("There has been an error: " + e.message);
}

allergyList.webdb.onSuccess = function(tx, r) {
  // re-render the data.
  allergyList.webdb.getAllAllergyItems(loadAllergyItems);
}

allergyList.webdb.getAllAllergyItems = function(renderFunc) {
  var db = allergyList.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM allergy", [], renderFunc,
    allergyList.webdb.onError);
  });
}

allergyList.webdb.deleteAllergy = function(id) {
  var db = allergyList.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("DELETE FROM allergy WHERE ID=?", [id],
    allergyList.webdb.onSuccess,
    allergyList.webdb.onError);
  });
}

function loadAllergyItems(tx, rs) {
  var rowOutput = "";
  var allergyItems = document.getElementById("allergyItems");
  for (var i = 0; i < rs.rows.length; i++) {
    rowOutput += renderAllergy(rs.rows.item(i));
  }

  allergyItems.innerHTML = rowOutput;
}

function renderAllergy(row) {
  return "<li>" + row.allergy + " <a href='javascript:void(0);'  onclick='allergyList.webdb.deleteAllergy(" + row.ID + ");'>[X]</a></li>";
}

function addAllergy() {
  var allergy = document.getElementById("allergyInput");
  allergyList.webdb.addAllergy(allergy.value);
  allergy.value = "";
}

function init() {
  allergyList.webdb.open();
  allergyList.webdb.createTable();
  allergyList.webdb.getAllAllergyItems(loadAllergyItems);
}

window.addEventListener("DOMContentLoaded", init(), false);
}

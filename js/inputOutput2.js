var fn = document.getElementById("firstname");

fn.value = localStorage.getItem("firstname");
document.getElementById("FinalName").textContent = fn.value;

fn.addEventListener('input', function() {
  localStorage.setItem('firstname', fn.value);}, false);

document.getElementById("nameSubmit").addEventListener('click', function(){
  document.getElementById("FinalName").textContent = fn.value;
  });



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

allergyList.webdb.addTodo = function(allergyText) {
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
  allergyList.webdb.getAllTodoItems(loadTodoItems);
}


allergyList.webdb.getAllTodoItems = function(renderFunc) {
  var db = allergyList.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM allergy", [], renderFunc,
    allergyList.webdb.onError);
  });
}

allergyList.webdb.deleteTodo = function(id) {
  var db = allergyList.webdb.db;
  db.transaction(function(tx) {
    tx.executeSql("DELETE FROM allergy WHERE ID=?", [id],
    allergyList.webdb.onSuccess,
    allergyList.webdb.onError);
  });
}

function loadTodoItems(tx, rs) {
  var rowOutput = "";
  var allergyItems = document.getElementById("allergyItems");
  for (var i = 0; i < rs.rows.length; i++) {
    rowOutput += renderTodo(rs.rows.item(i));
  }

  allergyItems.innerHTML = rowOutput;
}

function renderTodo(row) {
  return "<li>" + row.allergy + " <a href='javascript:void(0);'  onclick='allergyList.webdb.deleteTodo(" + row.ID + ");'>[X]</a></li>";
}

function addTodo() {
  var allergy = document.getElementById("allergyInput");
  allergyList.webdb.addTodo(allergy.value);
  allergy.value = "";
}

function init() {
  allergyList.webdb.open();
  allergyList.webdb.createTable();
  allergyList.webdb.getAllTodoItems(loadTodoItems);
}

window.addEventListener("DOMContentLoaded", init(), false);



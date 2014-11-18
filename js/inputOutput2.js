var fn = document.getElementById("firstname");

fn.value = localStorage.getItem("firstname");
document.getElementById("FinalName").textContent = fn.value;

fn.addEventListener('input', function() {
  localStorage.setItem('firstname', fn.value);}, false);

document.getElementById("nameSubmit").addEventListener('click', function(){
  document.getElementById("FinalName").textContent = fn.value;
  });

 if("indexedDB" in window) {
  var allergyList = {};

  window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
  if ('webkitIndexedDB' in window) {
    window.IDBTransaction = window.webkitIDBTransaction;
    window.IDBKeyRange = window.webkitIDBKeyRange;
  }

  allergyList.indexedDB = {};
  allergyList.indexedDB.db = null;

  allergyList.indexedDB.onerror = function(e) {
    console.log(e);
  };

  allergyList.indexedDB.open = function() {
    var version = 1;
    var request = indexedDB.open("allergies", version);

    // We can only create Object stores in a versionchange transaction.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      // A versionchange transaction is started automatically.
      e.target.transaction.onerror = allergyList.indexedDB.onerror;

      if(db.objectStoreNames.contains("test")) {
        db.deleteObjectStore("test");
      }

      var store = db.createObjectStore("test",
        {keyPath: "timeStamp"});
    };

    request.onsuccess = function(e) {
      allergyList.indexedDB.db = e.target.result;
      allergyList.indexedDB.getAllallergyItems();
    };

    request.onerror = allergyList.indexedDB.onerror;
  };

  allergyList.indexedDB.addAllergy = function(allergyText) {
    var db = allergyList.indexedDB.db;
    var trans = db.transaction(["test"], "readwrite");
    var store = trans.objectStore("test");

    var data = {
      "text": allergyText,
      "timeStamp": new Date().getTime()
    };

    var request = store.put(data);

    trans.oncomplete = function(e) {
      allergyList.indexedDB.getAllallergyItems();
    };

    request.onerror = function(e) {
      console.log("Error Adding: ", e);
    };
  };

  allergyList.indexedDB.deleteAllergy = function(id) {
    var db = allergyList.indexedDB.db;
    var trans = db.transaction(["test"], "readwrite");
    var store = trans.objectStore("test");

    var request = store.delete(id);

    trans.oncomplete = function(e) {
      allergyList.indexedDB.getAllallergyItems();
    };

    request.onerror = function(e) {
      console.log("Error Adding: ", e);
    };
  };

  allergyList.indexedDB.getAllallergyItems = function() {
    var allergies = document.getElementById("allergyItems");
    allergies.innerHTML = "";

    var db = allergyList.indexedDB.db;
    var trans = db.transaction(["test"], "readwrite");
    var store = trans.objectStore("test");

    // Get everything in the store;
    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = store.openCursor(keyRange);

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      if(!!result == false)
        return;

      renderAllergy(result.value);
      result.continue();
    };

    cursorRequest.onerror = allergyList.indexedDB.onerror;
  };

  function renderAllergy(row) {
    var allergies = document.getElementById("allergyItems");
    var li = document.createElement("li");
    var Xbutton = document.createElement("Xbutton");
    var t = document.createTextNode(row.text);

    Xbutton.addEventListener("click", function() {
      allergyList.indexedDB.deleteAllergy(row.timeStamp);
    }, false);

    Xbutton.innerHTML = "<button>" + " X " + "</button>";
    li.appendChild(t);
    li.appendChild(Xbutton);
    allergies.appendChild(li);
  }

  function addAllergy() {
    var allergyInput = document.getElementById("allergyInput");
    allergyList.indexedDB.addAllergy(allergyInput.value);
    allergyInput.value = "";
  }

  function init2() {
    allergyList.indexedDB.open();
  }

  window.addEventListener("DOMContentLoaded", init2(), false);
}



// else if (window.openDatabase) {
//   var allergyList = {};
//   allergyList.webdb = {};
//   allergyList.webdb.db = null;

//   allergyList.webdb.open = function() {
//     var dbSize = 5 * 1024 * 1024; // 5MB
//     allergyList.webdb.db = openDatabase("Test2", "1.0", "Allergy List Manager", dbSize);
//   }

//   allergyList.webdb.createTable = function() {
//     var db = allergyList.webdb.db;
//     db.transaction(function(tx) {
//       tx.executeSql("CREATE TABLE IF NOT EXISTS allergy(ID INTEGER PRIMARY KEY ASC, allergy TEXT, added_on DATETIME)", []);
//     });
//   }

//   allergyList.webdb.addAllergy = function(allergyText) {
//     var db = allergyList.webdb.db;
//     db.transaction(function(tx) {
//       var addedOn = new Date();
//       tx.executeSql("INSERT INTO allergy(allergy, added_on) VALUES (?,?)", [allergyText, addedOn],
//       allergyList.webdb.onSuccess,
//       allergyList.webdb.onError);
//     });
//   }

//   allergyList.webdb.onError = function(tx, e) {
//     alert("There has been an error: " + e.message);
//   }

//   allergyList.webdb.onSuccess = function(tx, r) {
//     // re-render the data.
//     allergyList.webdb.getAllAllergyItems(loadAllergyItems);
//   }


//   allergyList.webdb.getAllAllergyItems = function(renderFunc) {
//     var db = allergyList.webdb.db;
//     db.transaction(function(tx) {
//       tx.executeSql("SELECT * FROM allergy", [], renderFunc,
//       allergyList.webdb.onError);
//     });
//   }

//   allergyList.webdb.deleteAllergy = function(id) {
//     var db = allergyList.webdb.db;
//     db.transaction(function(tx) {
//       tx.executeSql("DELETE FROM allergy WHERE ID=?", [id],
//       allergyList.webdb.onSuccess,
//       allergyList.webdb.onError);
//     });
//   }

//   function loadAllergyItems(tx, rs) {
//     var rowOutput = "";
//     var allergyItems = document.getElementById("allergyItems");
//     for (var i = 0; i < rs.rows.length; i++) {
//       rowOutput += renderAllergy(rs.rows.item(i));
//     }

//     allergyItems.innerHTML = rowOutput;
//   }

//   function renderAllergy(row) {
//     return "<li>" + row.allergy + " <a href='javascript:void(0);'  onclick='allergyList.webdb.deleteAllergy(" + row.ID + ");'>[X]</a></li>";
//   }

//   function addAllergy() {
//     var allergy = document.getElementById("allergyInput");
//     allergyList.webdb.addAllergy(allergy.value);
//     allergy.value = "";
//   }

//   function init() {
//     allergyList.webdb.open();
//     allergyList.webdb.createTable();
//     allergyList.webdb.getAllAllergyItems(loadAllergyItems);
//   }

//   window.addEventListener("DOMContentLoaded", init(), false);
// }



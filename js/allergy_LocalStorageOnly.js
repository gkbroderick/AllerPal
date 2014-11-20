var childName = document.getElementById("nameInput");
var childNameOutput = document.getElementById("nameOutput");
var allergyItems = document.getElementById("allergyItems");
var allergyInput = document.getElementById("allergyInput");

Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

if (childName) {
  childName.value = localStorage.getItem("nameInput");
  document.getElementById("nameOutput").textContent = childName.value;

  childName.addEventListener('input', function() {
    localStorage.setItem('nameInput', childName.value);}, false);

  document.getElementById("nameSubmit").addEventListener('click', function(){
    childNameOutput.textContent = childName.value;
    });
}

if(childNameOutput) {
  document.getElementById("nameOutput").textContent = localStorage.getItem("nameInput");
};


var allergies = [];

function outputList() {
  var retrievedData = localStorage.getObj("allergyKey");
  for (var i = 0; i < retrievedData.length; i++) {
    console.log(retrievedData[i]);
  }
}

function addToList(item) {
  var retrievedData = [];
  retrievedData = localStorage.getObj("allergyKey");
  retrievedData.push(item);
  localStorage.setObj("allergyKey", retrievedData);
}

function removeFromList(item) {
  var retrievedData = [];
  retrievedData = localStorage.getObj("allergyKey");
  for(var i = retrievedData.length; i--;) {
    if(retrievedData[i] == item) {
      retrievedData.splice(i, 1);
    }
  }
  localStorage.setObj("allergyKey", retrievedData);
}

document.getElementById("edit").addEventListener('click', function() {
  addToList(allergyInput.value);
  allergyInput.value= "";
  renderList();
}, false);


function renderList() {
var retrievedData = localStorage.getObj("allergyKey");
allergyItems.innerHTML = "";
  for (var i = 0; i < retrievedData.length; i++) {

    var li = document.createElement("li");
    // var Xbutton = document.createElement("Xbutton");
    // var t = document.createTextNode(retrievedData[i]);

    li.innerHTML = retrievedData[i];
    // + "<button class='delete'>" + " X " + "</button>";
    // li.appendChild(t);
    // li.appendChild(Xbutton);
    allergyItems.appendChild(li);

  }
}

function getTarget(e) {                          // Declare function
  if (!e) {                                      // If there is no event object
    e = window.event;                            // Use old IE event object
  }
  return e.target || e.srcElement;               // Get the target of event
}

function itemDone(e) {                           // Declare function
  // Remove item from the list
  var target, elParent, elGrandparent;           // Declare variables
  target = getTarget(e);                         // Get the item clicked link

  elParent = target.parentNode;                  // Get its list item
  elGrandparent = target.parentNode.parentNode;  // Get its list

  removeFromList(target.firstChild.nodeValue);
  // elGrandparent.removeChild(elParent);           // Remove list item from list
  elParent.removeChild(target);           // Remove list item from list


  // Prevent the link from taking you elsewhere
  if (e.preventDefault) {                        // If preventDefault() works
    e.preventDefault();                          // Use preventDefault()
  } else {                                       // Otherwise
    e.returnValue = false;                       // Use old IE version
  }
}

// Set up event listeners to call itemDone() on click
var el = document.getElementById('allergyItems');// Get shopping list
if (el.addEventListener) {                       // If event listeners work
  el.addEventListener('click', function(e) {     // Add listener on click
    itemDone(e);                                 // It calls itemDone()
  }, false);                                     // Use bubbling phase for flow
} else {                                         // Otherwise
  el.attachEvent('onclick', function(e){         // Use old IE model: onclick
    itemDone(e);                                 // Call itemDone()
  });
}


window.addEventListener("DOMContentLoaded", renderList(), false);


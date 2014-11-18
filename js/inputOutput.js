var fn = document.getElementById("firstname");

fn.value = localStorage.getItem("firstname");
document.getElementById("FinalName").textContent = fn.value;


fn.addEventListener('input', function() {
    localStorage.setItem('firstname', fn.value);}, false);

document.getElementById("nameSubmit").addEventListener('click', function(){
    document.getElementById("FinalName").textContent = fn.value;
    });



 var create = {};
                    create.webdb = {};
                    create.webdb.db = null;

                    create.webdb.open = function() {
                        var dbSize = 5 * 1024 * 1024; // 5MB
                        create.webdb.db = openDatabase("Todo", "1.0", "Todo manager", dbSize);
                    }

                    create.webdb.createTable = function() {
                        var db = create.webdb.db;
                        db.transaction(function(tx) {
                            tx.executeSql("CREATE TABLE IF NOT EXISTS todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
                        });
                    }

                    create.webdb.addTodo = function(todoText) {
                        var db = create.webdb.db;
                        db.transaction(function(tx) {
                            var addedOn = new Date();
                            tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)", [todoText, addedOn],
                            create.webdb.onSuccess,
                            create.webdb.onError);
                        });
                    }

                    create.webdb.onError = function(tx, e) {
                        alert("There has been an error: " + e.message);
                    }

                    create.webdb.onSuccess = function(tx, r) {
                        // re-render the data.
                        create.webdb.getAllTodoItems(loadTodoItems);
                    }


                    create.webdb.getAllTodoItems = function(renderFunc) {
                        var db = create.webdb.db;
                        db.transaction(function(tx) {
                            tx.executeSql("SELECT * FROM todo", [], renderFunc,
                            create.webdb.onError);
                        });
                    }

                    create.webdb.deleteTodo = function(id) {
                        var db = create.webdb.db;
                        db.transaction(function(tx) {
                            tx.executeSql("DELETE FROM todo WHERE ID=?", [id],
                            create.webdb.onSuccess,
                            create.webdb.onError);
                        });
                    }

                    function loadTodoItems(tx, rs) {
                        var rowOutput = "";
                        var todoItems = document.getElementById("todoItems");
                        for (var i = 0; i < rs.rows.length; i++) {
                            rowOutput += renderTodo(rs.rows.item(i));
                        }

                        todoItems.innerHTML = rowOutput;
                    }

                    function renderTodo(row) {
                        return "<li>" + row.todo + " <a href='javascript:void(0);'  onclick='create.webdb.deleteTodo(" + row.ID + ");'>[X]</a></li>";
                    }

                    function addTodo() {
                        var todo = document.getElementById("todo");
                        create.webdb.addTodo(todo.value);
                        todo.value = "";
                    }

                    function init() {
                        create.webdb.open();
                        create.webdb.createTable();
                        create.webdb.getAllTodoItems(loadTodoItems);
                    }
a



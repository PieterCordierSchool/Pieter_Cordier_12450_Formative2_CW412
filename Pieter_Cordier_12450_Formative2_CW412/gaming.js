if (!window.indexedDB){
    window.alert("Your browser doesn't support a stable version of IndexedDB.");
}

function addGame(){
    var request = window.indexedDB.open("Gaming", 1);
    var db;
    var transaction;
    var objectStore;
    var request;
    var game = {};
    game.gameName = document.getElementById("gameName").value;
    game.gameType = document.getElementById("gameType").value;
    game.gameRating = document.getElementById("gameRating").value;

    request.onsuccess = function(event){
        db = request.result;
        transaction = db.transaction(["games"], "readwrite");
        objectStore = transaction.objectStore("games");
        var requestAdd = objectStore.add(game);
        if ((game.gameName == "") || (game.gameType == "") || (game.gameRating == "")){
            this.alert("Please fill in all fields.");

           // Check if game is in database if not move on
        }else if (game.gameName == gameName){
            window.alert(`Game (${game.gameName}) already in database. ` );
            document.getElementById("database-form").reset();
        
        } else if(game.gameRating > 5 || game.gameRating < 1 ){ //and && or ||
            window.alert("Please enter a rating between 1 and 5.");
            document.getElementById("gameRating").reset();
                  
        }else{
            
            requestAdd.onsuccess = function(event){
                window.alert(`Game added to your database. (${game.gameName}, ${game.gameType}, ${game.gameRating})`);
                document.getElementById("database-form").reset();
                // window.location.reload();
            };
         
        }
   
    };
    request.onupgradeneeded = function(event){
        db = event.target.result;
        objectStore = db.createObjectStore("games", {keyPath: "gameName"} );

        objectStore.createIndex("gameType", "type", {unique: false});
        objectStore.createIndex("gameRating", "rating", {unique: false});
    };
    showGames();

}

function showGames(){
    var request = window.indexedDB.open("Gaming", 1);
    var db;
    var transaction;
    var objectStore;
    var request;
    var game = {};
    var gamesList = document.getElementById("gamesList");

    request.onsuccess = function(event){
        db = request.result;
        transaction = db.transaction(["games"]);
        objectStore = transaction.objectStore("games");
        objectStore.openCursor().onsuccess = function(event){
        var cursor = event.target.result;
            // Show the database in a table in js with some css 
            try
            {
                if (cursor){
                    var listItem = document.createElement("li");
                    listItem.textContent = cursor.value.gameName + " - " + cursor.value.gameType + " - " + cursor.value.gameRating;
                    gamesList.appendChild(listItem);
                    cursor.continue();
    
                }
            }
            catch(err)
            {
                if (cursor){
                var listItem = document.createElement("li");
                listItem.textContent = cursor.value.gameName + " - " + cursor.value.gameType + " - " + cursor.value.gameRating;
                gamesList.appendChild(listItem);
                cursor.continue();
                // document.createElement("li").setAttribute("id", "gamesList");
                // console.log('Did I made it?')
                }
            }

        };
    };
}

function clearDatabase(){
    document.getElementById("gamesList").innerHTML = "";

}

function deleteGame(){
    var request = window.indexedDB.open("Gaming", 1);
    var db;
    var transaction;
    var objectStore;
    var request;
    var gameTitle = document.getElementById("gameName").value;
    request.onsuccess = function(event){
        db = request.result;
        transaction = db.transaction(["games"], "readwrite");
        objectStore = transaction.objectStore("games");

            var requestDelete = objectStore.delete(gameTitle);

            requestDelete.onsuccess = function(event){
                window.alert(`Game deleted from your database. ${gameTitle}`);
                document.getElementById("database-form").reset();
                // window.location.reload();
        
            // window.alert("Game removed from your database.");
            // document.getElementById("database-form").reset();

        };


    };

    request.onerror = function(event){
        window.alert("Unable to delete game from your database.");
    };
    showGames();
}
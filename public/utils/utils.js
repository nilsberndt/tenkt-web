var i = 0;
var j = 0;
var loc = "bandnames";
var ref;
var change;


function getDB(wbl){
	if (ref != null){
		ref.off();
	}

	loc = wbl;
	
	var elem = document.getElementById("botStatus");

	ref = firebase.database().ref(loc + '/txt');
	
		
	ref.once('value').then(function(snapshot){
		dataSnap = snapshot.val();
		makeText(dataSnap);
		elem.style.visibility = "hidden";
	});
	ref.on('value', function(snapshot){
		dataSnap = snapshot.val();
		makeText(dataSnap);
		elem.style.visibility = "visible";
	});
	
	document.getElementById("dropButton").innerHTML = "{" + loc + "}";
	document.getElementById("dropButton").innerHTML += "<i></i>";
	elem.style.visibility = "hidden";
	

}

function makeText(db) {
	
	var str = "";
	var l = db.length;
    var i;
    for (i = 0; i < l; i++){
		if (i == 0){
		str = str + (db[i].substring(0,1).toUpperCase()) + (db[i].substring(1, db[i].length));
		}else if (db[i] == "." || db[i] == ","){
			if (db[i] == "." && i != (l - 1)){
				str = str + db[i] + " " + (db[i+1].substring(0,1).toUpperCase()) + (db[i+1].substring(1, db[i+1].length));
				i++;
			}else{
				str = str + db[i] + " ";
			}
		}else if (!(db.indexOf(".") > -1)){
			str = str + " " + (db[i].substring(0,1).toUpperCase()) + (db[i].substring(1, db[i].length));
		}else{
			str = str + " " + db[i];
		}					
	}
	document.getElementById("theText").innerHTML = str;
}

function saveText(){
	i++;
	var div = document.createElement('div');
	div.id = 'saveText_' + i;
	div.className = 'shadow container2 fastfadein';
	document.body.appendChild(div);
	
	var title = document.createElement('h5');
	title.innerHTML = "{" + loc + "}";
	div.appendChild(title);
	
	var txt1 = document.createElement('p');
	txt1.innerHTML = document.getElementById("theText").innerHTML;
	div.appendChild(txt1);
	
	var btn = document.createElement('button')
	btn.id = "deleteButton_" + i;
	btn.innerHTML = "Delete";
    btn.setAttribute("value", "delete");
    btn.setAttribute("text", "delete");
	btn.onclick = function () { removeSaveText(div.id) };
	div.appendChild(btn);
	
	var btn2 = document.createElement('button')
	btn2.id = "copyButton_" + i;
	btn2.innerHTML = "Copy to Clipboard";
	btn2.onclick = function () { copyText(txt1.innerHTML) };
	div.appendChild(btn2);
	
	var elem = document.getElementById('snapshot');
    elem.style.display = "none";
	

}

function removeSaveText(txtId) {
	var elem = document.getElementById(txtId);
    elem.parentNode.removeChild(elem);
}

function copyText(copyStr) {
	var copyTxt = document.getElementById("copytxt");
	copyTxt.value = copyStr;
	copyTxt.select();

	document.execCommand("copy");

	alert("Copied WordBlock to Clipboard...");
} 


function showAbout(){
	var elem = document.getElementById("about");
	elem.style.display = "block"; 
}

function closeAbout(){
	var elem = document.getElementById("about");
	elem.style.display = "none"; 
}

function setLoc(s) {
	loc = s;
}

function validateLoc(s){
	j++;
	var locdb = firebase.database().ref(s + '/txt');
	var strloc = s;
	
	locdb.once('value', function(snapshot) {
		if (snapshot.exists()) {
			var elem = document.getElementById("myDropdown");
			var alink = document.createElement('a');
			alink.id = 'userLink_' + j;
			alink.innerHTML="{" + s + "}";
			alink.onclick=function(){getDB(strloc)};
			elem.appendChild(alink);
			getDB(s);
		}else{
			alert('{' + s + '}  does not exist...');
		}
	});

}

function firebaseInit() {
    
	// Initialize Firebase
	var config = {
		apiKey: "AIzaSyCfKlxKSRh_49VVbYKOimOUrp329B_kgpU",
		authDomain: "tenkt-64a0f.firebaseapp.com",
		databaseURL: "https://tenkt-64a0f.firebaseio.com",
		projectId: "tenkt-64a0f",
		storageBucket: "tenkt-64a0f.appspot.com",
		messagingSenderId: "705356973592"
	};
	
	firebase.initializeApp(config);

	// Log in anonymously
	firebase.auth().signInAnonymously().catch(function(error) {
		// Print error to html display if need be
		var errorCode = error.code;
		var errorMessage = error.message;
		document.getElementById("theText").innerHTML = "Error " + errorCode + ": " + errorMessage;
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			getDB(loc);
			
		}else {
			document.getElementById("theText").innerHTML = "Trouble authenticating, try refreshing...";
		}
	});
	
	return false;
}


//Dropdown
/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function dropDown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

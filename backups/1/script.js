let btnNew = document.getElementById("btnNew");
let btnMenu = document.getElementById("btnMenu");
let submitButton = document.getElementById("submitButton");
let submitButtonEdit = document.getElementById("submitButtonEdit");

btnNew.addEventListener("click", function() {redirectTo("./add.html")});
btnMenu.addEventListener("click", function() {redirectTo("./index.html")});

if (submitButtonEdit != null) {
	submitButtonEdit.addEventListener("click", function() {editContact()});
}

if (submitButton != null) {
	submitButton.addEventListener("click", function() {addContact()});
}

var config = {
	apiKey: "AIzaSyDD5Gvsv2o0i9KKsQhmEqiCrqCkeVai6CM",
	authDomain: "is445prj.firebaseapp.com",
	databaseURL: "https://is445prj.firebaseio.com",
	projectId: "is445prj",
	storageBucket: "is445prj.appspot.com",
	messagingSenderId: "659329591456",
	appId: "1:659329591456:web:b1d2147f3d3638358101c5",
	measurementId: "G-BVZ1X0Z3KY"
  };
firebase.initializeApp(config);

function redirectTo(path) {

	location.href=path;
}

function blurButton(button) {
	button.style.opacity = 0.5;
}

function updateButton() {
	var path = location.href.split("/");
	path = path[path.length - 1];
	var id = null;

	if (path === "index.html") {
		chargeTable();
		blurButton(btnNew);
	}
	else if (path === "add.html")
		blurButton(btnMenu);
	else {
		blurButton(btnMenu);
		blurButton(btnNew);
		if (path === "edit.html")
			fillEditContactForm();
		else if (path === "details.html")
			addData();
	}	
}

function addContact() {
	var name = document.getElementById("nameInput").value;
	var email = document.getElementById("emailInput").value;
	var phone = document.getElementById("phoneInput").value;

	if (!validateEmail(email)) {
		alert("Email is incorrect");
		return ;
	}
	else if (!validatePhone(phone)) {
		alert("Phone number is incorrect");
		return ;
	}

	firebase.database().ref('users/' + name).set({
		name: name,
		email: email,
		phone : phone
	}, function(error) {
		if (error) {
			console.log(error);
		} else {
			location.href="./index.html"
		}
	});
}

function validateEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function validatePhone(phone) {
	if ((phone[0] != '0' && phone[0] != '1') && phone.length == 10)
		return /^\d+$/.test(phone);
	return 0;
}

function chargeTable() {
	var table = document.getElementById("contactTable");

	var ref = firebase.database().ref('users');
	ref.once("value", function(snapshot) {
		let tr;
		snapshot.forEach(function(data) {
			tr = document.createElement("TR");
			let i = 0;
			let name = data.val().name;
			let email = data.val().email;
			let phone = data.val().phone;

			let detailsButton = document.createElement("BUTTON");
			let editButton = document.createElement("BUTTON");
			let deleteButton = document.createElement("BUTTON");

			detailsButton.addEventListener("click", function() {contactDetails(name, email, phone)});
			editButton.addEventListener("click", function() {contactEdit(name, email, phone)});
			deleteButton.addEventListener("click", function() {contactDelete(name)});

			detailsButton.setAttribute("class", "details-button");
			editButton.setAttribute("class", "edit-button");
			deleteButton.setAttribute("class", "delete-button");
		   
			detailsButton.appendChild(document.createTextNode("Details"));
			editButton.appendChild(document.createTextNode("Edit"));
			deleteButton.appendChild(document.createTextNode("Delete"));

			let td = document.createElement("TD");
			td.appendChild(document.createTextNode(i));
			tr.appendChild(td);
			td = document.createElement("TD");
			td.appendChild(document.createTextNode(name));
			tr.appendChild(td);
			td = document.createElement("TD");
			td.appendChild(document.createTextNode(email));
			tr.appendChild(td);
			td = document.createElement("TD");
			td.appendChild(document.createTextNode(phone));
			tr.appendChild(td);
			td = document.createElement("TD");
			td.appendChild(detailsButton);
			td.appendChild(editButton);
			td.appendChild(deleteButton);
			tr.appendChild(td);
			table.appendChild(tr);
		});
	}, function (error) {
		console.log("Error: " + error.code);
	 });
}

function contactDelete(name) {
	var retVal = confirm("Are you sure you want to remove " + name +  " ?");
	if( retVal == true ) {
		firebase.database().ref('users/' + name).remove(
			function(error) {
			if (error) {
				console.log(error);
			} else {
				location.href="./index.html"
			}
		});
	}
}

function contactEdit(name, email, phone) {
	sessionStorage.setItem('name', name)
	sessionStorage.setItem('email', email)
	sessionStorage.setItem('phone', phone);
	location.href="./edit.html";
}

function fillEditContactForm() {
	let name = sessionStorage.getItem('name');
	let email = sessionStorage.getItem('email');
	let phone = sessionStorage.getItem('phone');

	document.getElementById("nameInput").value = name;
	document.getElementById("emailInput").value = email;
	document.getElementById("phoneInput").value = phone;
}

function editContact() {
	let name = document.getElementById("nameInput").value;
	let email = document.getElementById("emailInput").value;
	let phone = document.getElementById("phoneInput").value;

	if (!validateEmail(email)) {
		alert("Email is incorrect");
		return ;
	}
	else if (!validatePhone(phone)) {
		alert("Phone number is incorrect");
		return ;
	}

	if (name != sessionStorage.getItem('name'))
		firebase.database().ref('users/' + sessionStorage.getItem('name')).remove();
	firebase.database().ref('users/' + name).set({
		name: name,
		email: email,
		phone : phone
	  }, function(error) {
		if (error) {
			console.log(error);
		} else {
			location.href="./index.html"
		}
	  });
}

function contactDetails(name, email, phone) {
	sessionStorage.setItem('name', name);
	sessionStorage.setItem('email', email);
	sessionStorage.setItem('phone', phone);
	location.href="./details.html";
}

function addData() {
	let name = document.createElement("P");
	name.appendChild(document.createTextNode(sessionStorage.getItem("name")));

	let email = document.createElement("P");
	email.appendChild(document.createTextNode(sessionStorage.getItem("email")));

	let phone = document.createElement("P");
	phone.appendChild(document.createTextNode(sessionStorage.getItem("phone")));

	let nameId = document.getElementById("name-label");
	let emailId = document.getElementById("email-label");
	let phoneId = document.getElementById("phone-label");

	nameId.appendChild(name);
	emailId.appendChild(email);
	phoneId.appendChild(phone);

	document.getElementById("details-delete-button").addEventListener("click", function() {contactDelete(sessionStorage.getItem('name'))});
	document.getElementById("details-edit-button").addEventListener("click", function() {location.href="edit.html"});
}
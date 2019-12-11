let btnNew = document.getElementById("btnNew");
let btnMenu = document.getElementById("btnMenu");
let btnSubmit = document.getElementById("btnSubmit");
let btnSubmitEdit = document.getElementById("btnSubmitEdit");

btnNew.addEventListener("click", function() {redirectTo("./add.html")});
btnMenu.addEventListener("click", function() {redirectTo("./index.html")});

if (btnSubmitEdit != null) {
	btnSubmitEdit.addEventListener("click", function() {contactEdit()});
}

if (btnSubmit != null) {
	btnSubmit.addEventListener("click", function() {contactNew()});
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

function btnBlur(button) {
	button.style.opacity = 0.5;
}

function btnUpdate() {
	var path = location.href.split("/");
	path = path[path.length - 1];
	var id = null;

	if (path === "index.html") {
		renderTable();
		btnBlur(btnNew);
	}
	else if (path === "add.html")
		btnBlur(btnMenu);
	else {
		btnBlur(btnMenu);
		btnBlur(btnNew);
		if (path === "edit.html")
			inputContact();
		else if (path === "details.html")
			dataAdd();
	}	
}

function contactNew() {
	var name = document.getElementById("inputName").value;
	var email = document.getElementById("inputEmail").value;
	var phone = document.getElementById("inputPhone").value;

	if (!verifyEmail(email)) {
		alert("Email is incorrect");
		return ;
	}
	else if (!verifyPhone(phone)) {
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

function verifyEmail(email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

function verifyPhone(phone) {
	if ((phone[0] != '0' && phone[0] != '1') && phone.length == 10)
		return /^\d+$/.test(phone);
	return 0;
}

function renderTable() {
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

			let buttonDetails = document.createElement("button");
			let buttonEdit = document.createElement("button");
			let buttonDelete = document.createElement("button");

			buttonDetails.addEventListener("click", function() {retrieveContactDetail(name, email, phone)});
			buttonEdit.addEventListener("click", function() {retrieveContactEdit(name, email, phone)});
			buttonDelete.addEventListener("click", function() {contactRemove(name)});

			buttonDetails.setAttribute("class", "button-details");
			buttonEdit.setAttribute("class", "button-edit");
			buttonDelete.setAttribute("class", "button-delete");
		   
			buttonDetails.appendChild(document.createTextNode("Details"));
			buttonEdit.appendChild(document.createTextNode("Edit"));
			buttonDelete.appendChild(document.createTextNode("Delete"));

			let td = document.createElement("td");
			td.appendChild(document.createTextNode(i));
			tr.appendChild(td);
			td = document.createElement("td");
			td.appendChild(document.createTextNode(name));
			tr.appendChild(td);
			td = document.createElement("td");
			td.appendChild(document.createTextNode(email));
			tr.appendChild(td);
			td = document.createElement("td");
			td.appendChild(document.createTextNode(phone));
			tr.appendChild(td);
			td = document.createElement("td");
			td.appendChild(buttonDetails);
			td.appendChild(buttonEdit);
			td.appendChild(buttonDelete);
			tr.appendChild(td);
			table.appendChild(tr);
		});
	}, function (error) {
		console.log("Error: " + error.code);
	 });
}

function contactRemove(name) {
	var retVal = confirm("Are you sure you want to delete " + name +  "?");
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

function retrieveContactEdit(name, email, phone) {
	sessionStorage.setItem('name', name)
	sessionStorage.setItem('email', email)
	sessionStorage.setItem('phone', phone);
	location.href="./edit.html";
}

function inputContact() {
	let name = sessionStorage.getItem('name');
	let email = sessionStorage.getItem('email');
	let phone = sessionStorage.getItem('phone');

	document.getElementById("inputName").value = name;
	document.getElementById("inputEmail").value = email;
	document.getElementById("inputPhone").value = phone;
}

function contactEdit() {
	let name = document.getElementById("inputName").value;
	let email = document.getElementById("inputEmail").value;
	let phone = document.getElementById("inputPhone").value;

	if (!verifyEmail(email)) {
		alert("Invalid E-mail format");
		return ;
	}
	else if (!verifyPhone(phone)) {
		alert("Invalid phone number (10 digits)");
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

function retrieveContactDetail(name, email, phone) {
	sessionStorage.setItem('name', name);
	sessionStorage.setItem('email', email);
	sessionStorage.setItem('phone', phone);
	location.href="./details.html";
}

function dataAdd() {
	let name = document.createElement("p");
	name.appendChild(document.createTextNode(sessionStorage.getItem("name")));

	let email = document.createElement("p");
	email.appendChild(document.createTextNode(sessionStorage.getItem("email")));

	let phone = document.createElement("p");
	phone.appendChild(document.createTextNode(sessionStorage.getItem("phone")));

	let nameId = document.getElementById("labelName");
	let emailId = document.getElementById("labelEmail");
	let phoneId = document.getElementById("labelPhone");

	nameId.appendChild(name);
	emailId.appendChild(email);
	phoneId.appendChild(phone);

	document.getElementById("btnDetailsDelete").addEventListener("click", function() {contactRemove(sessionStorage.getItem('name'))});
	document.getElementById("btnDetailsEdit").addEventListener("click", function() {location.href="edit.html"});
}
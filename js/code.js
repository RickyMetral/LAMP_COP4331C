const urlBase = 'https://groupsixlampproject.app/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// Logging in an existing user (first page)
function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	// get login and password from text boxes
	let login = document.getElementById("loginName").value.trim();
	let password = document.getElementById("loginPassword").value.trim();
	
	
	document.getElementById("loginResult").innerHTML = "";

	// validate login and password
	let validationResult = validateLoginInfo(login, password);
	if (validationResult !== "") {
		document.getElementById("loginResult").innerHTML = validationResult;
		return;
	}

	var hash = md5( password );

	// create JSON payload and send to API
	let tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html"; // redirect to contacts page after successful login
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

// Registering a new user
function doRegister()
{
	// get login and password from text boxes
	let firstName = document.getElementById("firstName").value.trim();
	let lastName = document.getElementById("lastName").value.trim();
	let login = document.getElementById("login").value.trim();
	let password = document.getElementById("loginPassword").value.trim();
	let confirmPassword = document.getElementById("confirmPassword").value.trim();
	
	document.getElementById("registerResult").innerHTML = "";

	// Validate
	let validationResult = validateRegistrationInfo(firstName, lastName, login, password, confirmPassword);
	if (validationResult !== "") {
		document.getElementById("registerResult").innerHTML = validationResult;
		return;
	}

	var hash = md5( password );
	
	// create JSON payload and send to API
	let tmp = {
		firstName:firstName,
		lastName:lastName,
		login:login,
		password:hash
	};

	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/Register.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );

				if (jsonObject.error && jsonObject.error != "") {
					document.getElementById("registerResult").innerHTML = jsonObject.error;
				}
				else {
					document.getElementById("registerResult").innerHTML = "Account has been created";
					window.location.href = "index.html"; // redirect to login page after successful registration
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}
}

// redirects to create contact page
function doContact()
{
	window.location.href = "createContact.html";
}

// Adding a new contact to the contact list
function doCreateContact()
{
	// get contact info from text boxes
	let contactFirstName = document.getElementById("firstNameInput").value.trim();
	let contactLastName = document.getElementById("lastNameInput").value.trim();
	let phone = document.getElementById("phone").value.trim();
	let email = document.getElementById("email").value.trim();

	// Validate contact info
	let validationResult = validateContactInfo(contactFirstName, contactLastName, phone, email);
	if (validationResult !== "") {
		document.getElementById("contactAddResult").innerHTML = validationResult;
		return;
	}

	// Add contact info to API 
	let tmp = { 
		firstName: contactFirstName,
		lastName: contactLastName, 
		phone: phone,
		email: email,
		userId: userId
	};

	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactAddResult").innerHTML = "Contact has been added";
				window.location.href = "contacts.html"; // redirect to contacts page after adding contact
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
	}
}

// called in display contacts
function startEditContact(contactId)
{
	localStorage.setItem("editcontactID", contactId);
	window.location.href = "editContact.html"; // redirect to edit contact page
}

// load contact info into text boxes on edit contact page
function loadContactToEdit() 
{
	let contactID = localStorage.getItem("editcontactID");

	let tmp = { search :"", userId:userId };
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
			{
				let jsonObject = JSON.parse( xhr.responseText );

				for (let i=0; i<jsonObject.results.length; i++)
				{
					if (jsonObject.results[i].ID == contactID)
					{
						document.getElementById("firstNameInput").value = jsonObject.results[i].firstName;
						document.getElementById("lastNameInput").value = jsonObject.results[i].lastName;
						document.getElementById("phone").value = jsonObject.results[i].phone;
						document.getElementById("email").value = jsonObject.results[i].email;
						break;
					}
				}
			}
	};
	xhr.send(jsonPayload);

}

function editContact()
{	
	// Edit contact info in API Here
	let contactID = localStorage.getItem("editcontactID");
	
	let contactFirstName = document.getElementById("firstNameInput").value.trim();
	let contactLastName = document.getElementById("lastNameInput").value.trim();
	let phone = document.getElementById("phone").value.trim();
	let email = document.getElementById("email").value.trim();

	// Validate contact info
	let validationResult = validateContactInfo(contactFirstName, contactLastName, phone, email);
	if (validationResult !== "") {
		document.getElementById("contactEditResult").innerHTML = validationResult;
		return;
	}

	let tmp = {
		ID: contactID,
		firstName: contactFirstName,
		lastName: contactLastName,
		phone: phone,
		email: email,
		userId: userId
	};

	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/EditContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			localStorage.removeItem("editcontactID");
			window.location.href = "contacts.html"; // redirect to contacts page after editing contact
		}
	}
	xhr.send(jsonPayload);
}

// called in display contacts
function deleteContact(contactId)
{
	if (!confirm("Are you sure you want to delete this contact?"))
		return;

	let tmp = { ID: contactId, userId: userId };
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			let contactDiv = document.getElementById("contact-" + contactId);
			if (contactDiv) {
				contactDiv.remove(); // remove contact from display without reloading page
			}
		}
	};
	xhr.send(jsonPayload);
}

// display contact list on contacts page when it loads
function displayContacts()
{
	let tmp = { search:"", userId:userId };
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	xhr.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			let jsonObject = JSON.parse( xhr.responseText );
			let contactList = "";

			// if there are no contacts to display, show message
			if (jsonObject.results.length == 0)
			{
				document.getElementById("contactList").innerHTML = "No contacts to display";
				return;
			}
			else {
				for( let i=0; i < jsonObject.results.length; i++ )
				{
					let contact = jsonObject.results[i];
					contactList += `
						<div id="contact-${contact.ID}">
							${contact.firstName} ${contact.lastName} - ${contact.phone} - ${contact.email}
							<button onclick="startEditContact(${contact.ID})">Edit</button>
							<button onclick="deleteContact(${contact.ID})">Delete</button>
						</div>
					`;
				}
			}
			document.getElementById("contactList").innerHTML = contactList;
		}
	};
	xhr.send(jsonPayload);
}

function doContact()
{
	window.location.href = "createContact.html";
	
	

}

function doCreateContact()
{
	// Add contact info to API Here
	window.location.href = "contacts.html"
	
}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";          // DISABLED FOR TESTING PURPOSES
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				if (jsonObject.results.length == 0)
				{
					document.getElementById("contactList").innerHTML = "No contacts found";
					return;
				}
				else {
					for( let i=0; i<jsonObject.results.length; i++ )
					{
						let contact = jsonObject.results[i];
						contactList += `
							<div id="contact-${contact.ID}">
								${contact.firstName} ${contact.lastName} - ${contact.phone} - ${contact.email}
								<button onclick="startEditContact(${contact.ID})">Edit</button>
								<button onclick="deleteContact(${contact.ID})">Delete</button>
							</div>
						`;
					}
				}
				document.getElementById("contactList").innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function validateEmail(email) {
	let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailPattern.test(email);
}

function validatePhone(phone) {
	let phonePattern = /^[\d\s\-\(\)]+$/;
	return phonePattern.test(phone);
}

function validateContactInfo(firstName, lastName, phone, email) {
	if (firstName === "") {
		return "First name is required";
	}
	if (lastName === "") {
		return "Last name is required";
	}
	if (phone === "") {
		return "Phone number is required";
	}
	if (!validatePhone(phone)) {
		return "Please enter a valid 10-digit phone number";	
	}
	if (email === "") {
		return "Email is required";
	}
	if (!validateEmail(email)) {
		return "Please enter a valid email address";
	}
	return "";
}

function validateLoginInfo(login, password) {
	if (login === "") {
		return "Username is required";
	}
	if (password === "") {
		return "Password is required";
	}
	if (password.length < 6) {
		return "Password must be at least 6 characters long";
	}
	return "";
}

function validateRegistrationInfo(firstName, lastName, login, password, confirmPassword) {
	if (firstName === "") {
		return "First name is required";
	}
	if (lastName === "") {
		return "Last name is required";
	}
	if (login === "") {
		return "Username is required";
	}
	if (password === "") {
		return "Password is required";
	}
	if (password.length < 6) {
		return "Password must be at least 6 characters long";
	}
	if (password != confirmPassword)
	{
		return "Passwords do not match";
	}
	return "";
}
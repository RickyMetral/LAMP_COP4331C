const urlBase = 'https://groupsixlampproject.app/LAMPAPI';
const extension = 'php';

let currentUser = {
    userId: 0,
    firstName: "",
    lastName: ""
};


let currentContact = {
	id : "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    userId: 0
};

window.onload = function() {
    let data = localStorage.getItem("currentUser");
    if(data) {
        let user = JSON.parse(data);
        currentUser.userId = user.userId;
        currentUser.firstName = user.firstName;
        currentUser.lastName = user.lastName;
    } else {
		let currentPage = window.location.pathname;
        if (!currentPage.includes("index.html") && !currentPage.includes("register.html")) {
            window.location.href = "index.html";
        }
    }

    data = localStorage.getItem("selectedContact");
    if(data) {
        let contact = JSON.parse(data);
        currentContact.userId = contact.userId;
        currentContact.firstName = contact.firstName;
        currentContact.lastName = contact.lastName;
        currentContact.phone = contact.phone;
        currentContact.email = contact.email;
        currentContact.id = contact.id;
    }
};

// Logging in an existing user (first page)
function doLogin()
{
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	// let tmp = {login:login,password:password};
	var tmp = {login:login,password:hash};
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
				currentUser.userId = jsonObject.id;
				currentContact.userId = currentUser.userId;
		
				if( currentUser.userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				currentUser.firstName = jsonObject.firstName;
				currentUser.lastName = jsonObject.lastName;

    			localStorage.setItem("currentUser", JSON.stringify(currentUser));
	
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

function doRegisterUser() {
    let firstName = document.getElementById("regFirstName").value;
    let lastName = document.getElementById("regLastName").value;
    let login = document.getElementById("regLogin").value;
    let password = document.getElementById("regPassword").value;
	let hash = md5(password);

    document.getElementById("regResult").innerHTML = "";

    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: login,
        password: hash
    };
    
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/Registration.' + extension; 

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error != "" && jsonObject.error.length > 0) {
                    document.getElementById("regResult").innerHTML = jsonObject.error;
                } else {
                    document.getElementById("regResult").innerHTML = "Registration Successful!";
                    // Send them to the login page (index.html) after 1 second
                    setTimeout(function() {
                        window.location.href = "index.html";
                    }, 1200);
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        document.getElementById("regResult").innerHTML = err.message;
    }
}

function doRegister()
{
	window.location.href = "register.html";
}

function doReturn()
{
	let currPage = window.location.pathname;
	if (currPage.includes("register.html")) {
		window.location.href = "index.html";
	} else if (currPage.includes("createContact.html") || currPage.includes("editContact.html")) {
		window.location.href = "contacts.html";
	}
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
	document.cookie = "firstName=" + currentUser.firstName + ",lastName=" + currentUser.lastName + ",userId=" + currentUser.userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	currentUser.userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			currentUser.firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			currentUser.lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			currentUser.userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( currentUser.userId < 0 )
	{
		// window.location.href = "index.html";          DISABLED FOR TESTING PURPOSES
	}
	else
	{
		// document.getElementById("userName").innerHTML = "Logged in as " + currentUser.firstName + " " + currentUser.lastName;
	}
}

function doLogout()
{
	currentUser.userId = 0;
	currentUser.firstName = "";
	currentUser.lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	document.getElementById("createContactResult").innerHTML = "";

	let firstName = document.getElementsByClassName("firstNameField")[0].value;
	let lastName = document.getElementsByClassName("lastNameField")[0].value;
	let phone = (document.getElementsByClassName("phoneField")[0].value); 
	let email = document.getElementsByClassName("emailField")[0].value;

	let tmp = {"userId":currentUser.userId, "firstName": firstName, 
		"lastName": lastName, "phone": phone, "email": email};
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
				let jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.error == ""){
					document.getElementById("createContactResult").innerHTML = "Contact has been added";
					setTimeout(function() {
           				window.location.href = "contacts.html";
    				}, 500);
				}
				else{
					document.getElementById("createContactResult").innerHTML = "Contact could not be added";
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("createContactResult").innerHTML = err.message;
	}
	
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    let tableBody = document.getElementById("contactTableBody");
    let resultText = document.getElementById("contactSearchResult");

    tableBody.innerHTML = "";
    resultText.innerHTML = "";

    let tmp = { "search": srch, "userId": currentUser.userId };
    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/SearchContact.' + extension;
	console.log("Sending payload:", jsonPayload);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0) {
                    resultText.innerHTML = jsonObject.error;
                    return;
                }

                for (let i = 0; i < jsonObject.results.length; i++) {
                    let contact = jsonObject.results[i];
                    let row = tableBody.insertRow();
                    
                    row.insertCell(0).innerHTML = contact.FirstName + " " + contact.LastName;
                    row.insertCell(1).innerHTML = contact.Phone;
                    row.insertCell(2).innerHTML = contact.Email;
                    
                    // Added an Edit and Delete button to the row for functionality
                    let editCell = row.insertCell(3);
					let deleteCell = row.insertCell(4);
                    editCell.innerHTML = `<button class="editBtn" onclick="prepareEdit('${contact.FirstName}', '${contact.LastName}', '${contact.Phone}', '${contact.Email}', ${contact.ID})">Edit</button>`;
					deleteCell.innerHTML = `<button class="deleteBtn" onclick="askDeleteContact(${contact.ID}, '${contact.FirstName} ${contact.LastName}')">Delete</button>`;
                }
            }
        };
		
        xhr.send(jsonPayload);
    } catch (err) {
        resultText.innerHTML = err.message;
    }
}

function askDeleteContact(contactId, fullName) {
    if (confirm("Are you sure you want to delete " + fullName + "?")) {
        doDeleteContact(contactId);
    }
}

function doDeleteContact(contactId) {
    let tmp = {
        ID: contactId,
        userId: currentUser.userId
    };

    let jsonPayload = JSON.stringify(tmp);
    let url = urlBase + '/DeleteContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let jsonObject = JSON.parse(xhr.responseText);

                if (jsonObject.error && jsonObject.error.length > 0) {
                    alert("Error: " + jsonObject.error);
                } else {
                    // Success! Refresh the search to show the contact is gone
                    searchContact();
                }
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        alert(err.message);
    }
}

function prepareEdit(firstName, lastName, phone, email, contactId) {
    // We create a temporary object to hold the contact we clicked on
	currentContact.firstName = firstName;
	currentContact.lastName  = lastName;
	currentContact.phone = phone;
	currentContact.email = email;
	currentContact.id = contactId;

    // Save to LocalStorage so it's available on the next page
    localStorage.setItem("selectedContact", JSON.stringify(currentContact));

    // Move to the edit page
    window.location.href = "editContact.html";
	preFillContacts();
}

function preFillContacts() {
    // Grab the data we saved in prepareEdit
    let data = localStorage.getItem("selectedContact");

    if (data) {
        let contact = JSON.parse(data);

        // IMPORTANT: We must use [0] because getElementsByClassName returns an array
        document.getElementsByClassName("firstNameField")[0].value = contact.firstName;
        document.getElementsByClassName("lastNameField")[0].value = contact.lastName;
        document.getElementsByClassName("phoneField")[0].value = (contact.phone);
        document.getElementsByClassName("emailField")[0].value = contact.email;
        
        // Sync the global currentContact object so editContact() knows the ID
        currentContact.id = contact.id;
        currentContact.firstName = contact.firstName;
        currentContact.lastName = contact.lastName;
        currentContact.phone = contact.phone;
        currentContact.email = contact.email;
    }
}

//Reads all fields and makes API requeest to update contact
function editContact()
{
	document.getElementById("editResult").innerHTML = "";

	let first = document.getElementsByClassName("firstNameField")[0].value;
    let last = document.getElementsByClassName("lastNameField")[0].value;
    let phone = document.getElementsByClassName("phoneField")[0].value;
    let email = document.getElementsByClassName("emailField")[0].value;

	// Use the ID we stored during preFillContacts
    let tmp = {
        ID: currentContact.id, 
        userId: currentUser.userId, 
        firstName: first, 
        lastName: last, 
        phone: phone, 
        email: email
    }

	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/EditContact.' + extension;
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

				if(jsonObject.error == ""){
					document.getElementById("editResult").innerHTML = "Contact Successfully Updated";
					setTimeout(function() {
           				window.location.href = "contacts.html";
    				}, 500);
				}
				else{
					document.getElementById("editResult").innerHTML = jsonObject.error;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("editResult").innerHTML = err.message;
	}
}



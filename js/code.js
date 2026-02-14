const urlBase = 'https://groupsixlampproject.app/LAMPAPI';
const extension = 'php';

let currentUser = {
	id : "",
    firstName: "",
    lastName: "",
}
let currentContact = {
	id : "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    userId: 0
};

function doLogin()
{
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
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
		
				if( currentUser.userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				currentUser.firstName = jsonObject.firstName;
				currentUser.lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contacts.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function doRegister()
{
	window.location.href = "register.html";
	
	

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
		document.getElementById("userName").innerHTML = "Logged in as " + currentUser.firstName + " " + currentUser.lastName;
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
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {"color":newColor,"userId":currentUser.userId};
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
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchContact() {
    let srch = document.getElementById("searchText").value;
    let tableBody = document.getElementById("contactTableBody");
    let resultText = document.getElementById("contactSearchResult");

    tableBody.innerHTML = "";
    resultText.innerHTML = "";

    let tmp = { search: srch, userId: currentUser.userId };
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
                    
                    // Added an Edit button to the row for functionality
                    let editCell = row.insertCell(3);
                    editCell.innerHTML = `<button class="editBtn" onclick="prepareEdit('${contact.FirstName}', '${contact.LastName}', '${contact.Phone}', '${contact.Email}', ${contact.ID})">Edit</button>`;
                }
            }
        };
		
        xhr.send(jsonPayload);
    } catch (err) {
        resultText.innerHTML = err.message;
    }
}


//Reads all fields and makes API requeest to update contact
function editContact()
{
	let firstName = document.getElementsByClassName("firstNameField").value;
	let lastName = document.getElementsByClassName("lastNameField").value;
	let phone = document.getElementsByClassName("phoneField").value; 
	let email = document.getElementsByClassName("emailField").value;

	let tmp = {"ID":currentContact.id, "userId":currentContact.userId, "firstName": firstName, 
		"lastName": lastName, "phone": phone, "email": email};

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


function setCurrentContact(firstName, lastName, phone, email)
{
	currentContact.firstName = firstName;
	currentContact.lastName = lastName;
	currentContact.phone = phone;
	currentContact.email = email;
}

function preFillContacts()
{
	document.getElementsByClassName("firstNameField").value = currentContact.firstName;
	document.getElementsByClassName("lastNameField").value = currentContact.lastName; 
	document.getElementsByClassName("phoneField").value = currentContact.phone;
	document.getElementsByClassName("emailField").value = currentContact.email;

}

const urlBase = 'https://groupsixlampproject.app/LAMPAPI';
const extension = 'php';


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
				currentContact.userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				currentContact.firstName = jsonObject.firstName;
				currentContact.lastName = jsonObject.lastName;

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
//		window.location.href = "index.html";          DISABLED FOR TESTING PURPOSES
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

function addContact()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {"color":newColor,"userId":userId};
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

function searchContact()
{
    let srch = document.getElementById("searchText").value;
    // Clear previous results
    document.getElementById("contactSearchResult").innerHTML = "";

	let tableBody = document.getElementById("contactTableBody");
    let resultText = document.getElementById("contactSearchResult");
	
	resultText.innerHTML = "";
    tableBody.innerHTML = "";
    
    let fullList = ""; 
    let tmp = {"search":srch, "userId":userId};
    let jsonPayload = JSON.stringify( tmp );

    let url = urlBase + '/SearchContact.' + extension;
    
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

                // Loop through results and build table rows
                for (let i = 0; i < jsonObject.results.length; i++) {
                    let contact = jsonObject.results[i];

                    // Create a new row
                    let row = tableBody.insertRow();

                    // Insert cells for the row
                    let cell1 = row.insertCell(0);
                    let cell2 = row.insertCell(1);
                    let cell3 = row.insertCell(2);

                    // Add content to the cells
                    cell1.innerHTML = contact.FirstName + " " + contact.LastName;
                    cell2.innerHTML = contact.Phone;
                    cell3.innerHTML = contact.Email;
                }
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}


function editContact()
{
	let firstName = document.getElementsByClassName("firstNameField").value;
	let lastName = document.getElementsByClassName("lastNameField").value;
	let phone = document.getElementsByClassName("phoneField").value; 
	let email = document.getElementsByClassName("emailField").value;

	let tmp = {"ID":currentContact.id, "userID":currentContact.userId, "firstName": firstName, 
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
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

				if(jsonObject.error == ""){
					document.getElementById("loginResult").innerHTML = "Contact Successfully Updated";
				}
				else{
					document.getElementById("loginResult").innerHTML = jsonObject.error;
				}
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
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

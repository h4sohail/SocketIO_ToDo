const socket = io.connect("http://localhost:3000")

let highlightColor = "yellow";
let items = []

socket.on('item add', function(itemName) {
	addItem(itemName);
});

socket.on('item remove', function(newItems) {
	items = newItems;
	renderList();
});

function init(){
	getToDoList();
	document.getElementById("additem").addEventListener("click", addItemSocket);
	document.getElementById("removeitem").addEventListener("click", deleteItemSocket);
	document.getElementById("highlight").addEventListener("click", highlightItems);
	document.getElementById("sort").addEventListener("click", sortItems);
}

function addItemSocket() {
	let itemName = document.getElementById("itemname").value;
	if (isDuplicate(itemName)){
		alert("Item already exists!")
		return;
	}
	socket.emit('item add', itemName);
}

function deleteItemSocket() {
	newItems = removeItems()
	socket.emit('item remove', newItems);
}

function getToDoList() { 
	const xhr = new XMLHttpRequest();
	xhr.open( "GET", "/list", true );
	xhr.setRequestHeader( 'Access-Control-Allow-Origin', '*')
	xhr.responseType = 'json';
	xhr.send();
	xhr.onload = function () {
		if (xhr.status == 200) {
			res = xhr.response;
			res.forEach(item => {
                items.push(item);
			});
			renderList();
		}
	}
}

//Returns true if an item with that name exists
function isDuplicate(itemName){
	for(let i = 0; i < items.length; i++){
		if(items[i].name === itemName){
			return true;
		}
	}
	return false;
}

function addItem(itemName){
	//Add a new object to the items array and render
	items.push({name: itemName, light: false, checked: false});
	renderList();
}

//Removes selected items
//Strategy is actually to build a new array of items to keep
//Then re-assign the items array to this new array
function removeItems(){
	items = items.filter(item => !item.checked);
	renderList();
	return items;
}

//Toggles highlight of selected items
function highlightItems(){
	items.forEach(elem =>{
		//If the item is checked, toggle its light property
		if(elem.checked){
			elem.light = !elem.light;
		}
	});
	renderList();
}

//Sort the array, render the list again
function sortItems(){
	items.sort(function(a,b){
		if(a.name < b.name){
			return -1;
		}else if(a.name > b.name){
			return 1;
		}else{
			return 0;
		}
	})
	renderList();
}

function toggleCheck(){
	//'this' refers to the calling object
	//In this case, the checkbox that was clicked
	//We saved the 'value' property with the item name
	let itemName = this.value;
	items.forEach(elem => {
		if(elem.name === itemName){
			elem.checked = !elem.checked;
			renderList();
			return;
		}
	});
}

//Creates new items list HTML and replaces the old HTML
function renderList(){
	let highlightColor = "yellow";
	
	//Create a new div to hold the list
	//This will replace the old one
	let newList = document.createElement("div");
	newList.id = "list";
	
	//For each item in the array of items
	items.forEach(elem => {
		//Create a new div to be child of 'list' div
		//Set highlighting based on property of item
		let newDiv = document.createElement("div");
		if(elem.light){
			newDiv.style.backgroundColor = highlightColor
		}
		
		//Create and add the new checkbox
		let newItem = document.createElement("input");
		newItem.type = "checkbox";
		newItem.value = elem.name;
		newItem.id = elem.name;
		newItem.checked = elem.checked
		newItem.onclick = toggleCheck;
		newDiv.appendChild(newItem);
	
		//Create and add the new text node (the item name)
		let text = document.createTextNode(elem.name);
		newDiv.appendChild(text);
	
		//Add newly created div to children of list div
		newList.appendChild(newDiv);
	});
	
	let origList = document.getElementById("list");
	origList.parentNode.replaceChild(newList, origList);
}
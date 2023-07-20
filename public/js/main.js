// assigning a NodeList of span elements with the class of "fa-trash" from the DOM to a constant "deleteBtn"
const deleteBtn = document.querySelectorAll('.fa-trash')
// assigning a NodeList of span elements with the class of "item" from the DOM to a constant "item"
const item = document.querySelectorAll('.item span')
// assigning a NodeList of span elements with the class of "item" and "completed" from the DOM to a constant "itemCompleted"
const itemCompleted = document.querySelectorAll('.item span.completed')
// Getting an array copy of the "deleteBtn" Nodelist. Looping through every element in the array and adding a event listener of a click to each element, with a "deleteItem" callback
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})
// Getting an array copy of the "item" Nodelist. Looping through every element in the array and adding a event listener of a click to each element, with a "markComplete" callback 
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})
// Getting an array copy of the "itemCompleted" Nodelist. Looping through every element in the array and adding a event listener of a click to each element, with a "markUnComplete" callback
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})
// creating an async function
async function deleteItem(){
    // Assigning the 2nd child node text of this element's parent to a "itemText" constant
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // making a DELETE request to the /deleteItem route. Setting the type of data to JSON and passing in a JS object that is parsed as JSON in the body property. The body property is what to send to the server, to the request.body more specifically
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        // extracting the data responded by the server from their response object
        const data = await response.json()
        // logging the server's response
        console.log(data)
        // reloading the page, which triggers a GET request to the server
        location.reload()
        // checking for errors
    }catch(err){
        // logging error
        console.log(err)
    }
}
// creating an async funciton
async function markComplete() {
    // Assigning the 2nd child node text of this element's parent to a "itemText" constant
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // making a PUT request to the /markComplete route. Setting the type of data to JSON and passing in a JS object that is parsed as JSON in the body property. The body property is what to send to the server, to the request.body more specifically
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // extracting the data responded by the server from their response object
        const data = await response.json()
        // logging the server's response
        console.log(data)
        // reloading the page, which triggers a GET request to the server
        location.reload()
        // checking for errors
    }catch(err){
        // logging the error
        console.log(err)
    }
}
// creating an async function
async function markUnComplete(){
    // Assigning the 2nd child node text of this element's parent to a "itemText" constant
    const itemText = this.parentNode.childNodes[1].innerText
    try{
        // making a PUT request to the /markComplete route. Setting the type of data to JSON and passing in a JS object that is parsed as JSON in the body property. The body property is what to send to the server, to the request.body more specifically
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        // extracting the data responded by the server from their response object
        const data = await response.json()
        // logging the server's response
        console.log(data)
        // reloading the page, which triggers a GET request to the server
        location.reload()
        // checking for errors
    }catch(err){
        // logging the error
        console.log(err)
    }
}
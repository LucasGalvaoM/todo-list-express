// importing express package
const express = require('express')
// initiating your express app
const app = express()
// importing MongoDB Client
const MongoClient = require('mongodb').MongoClient
// setting a port for the server
const PORT = 2121
// importing dotenv package + allwing the use of environment variables
require('dotenv').config()

// creating 3 global variables, db (undefined), dbConnectionStr (environment variable), dbname, 'todo'

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'

// Connecting to MongoDB, with a connection string variable. This returns a promise with a "client" value.

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        // Logging out to see if everything works
        console.log(`Connected to ${dbName} Database`)
        // assigning the reference to the todo database to the db variable
        db = client.db(dbName)
    })

// setting view engine to ejs
app.set('view engine', 'ejs')
// Middleware that automatically serves up any requested static files in the "public" folder (JS, CSS, etc)
app.use(express.static('public'))
// Middleware that gets data from a <form> element and parses it as a JS object (keys = inputs names, values = inputs values), and appends it to the request.body
app.use(express.urlencoded({ extended: true }))
// Middleware that gets JSON sent from the fetch API, parses it as a regular JS object, and appends it to the request.body
app.use(express.json())

// Listening to a GET method for the root route
app.get('/',async (request, response)=>{
    // going to the "todos" collection in the "todo" database, going through each document and putting them into an array. Once the promise is fulfilled, its value is assigned to the todoItems constant
    const todoItems = await db.collection('todos').find().toArray()
    // going to the "todos" collection in the "todo" database and counting all the documents that have a completed property set to false. Once this promise is fulfilled, its value is assigned to the itemsLeft constant
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    // rendering index.ejs and passing an object containing the todoItems and itemsLeft variable to the ejs file. After the ejs file is done rendering, it will spit out an HTML file that will be sent as a response 
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})
// Listening to a  POST method to the /addTodo route
app.post('/addTodo', (request, response) => {
    // inserting an object to the "todos" collection in the "todo" database. The value of the "thing" property is equal to the value of the todoItem text input when the form with an action of "/addTodo" is submitted. Once this promise is fulfilled, it will log a message and redirect the user to the root route, which works just like a refresh to trigger a GET request so the user can see the update in place.
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        // Logging a message
        console.log('Todo Added')
        // Redirecting to the root route
        response.redirect('/')
    }) // checking for erros + logging those errors
    .catch(error => console.error(error))
})
// Listening to a PUT method in the "/markComplete" route.
app.put('/markComplete', (request, response) => {
    // Going through the "todos" collection in the "todo" database and updating an object that has a property of "thing" equal to the value of the itemFromJs property of the object sent by the Fetch API. 
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        // When that document/object is found, its "completed" property is set to "false". This performs the UPDATE operation.
        $set: {
            completed: true
          }
    },{
        // Sort documents from least id to greatest id and don't create a document if no documents are found
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        // Log two messages if promise is fulfilled
        console.log('Marked Complete')
        response.json('Marked Complete')
    }) // checking for erros + logging those errors
    .catch(error => console.error(error))

})
// Listening to a PUT method on the "/markUnComplete" route.

// Listening to a DELETE method on the "/deleteItem" route
app.delete('/deleteItem', (request, response) => {
    // Going through the "todos" collection in the "todo" databse and deleting a document that has a "thing" property equal to the value of the "itemFromJs" property of the request.body.
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        // Log
        console.log('Todo Deleted')
        // Send a string message as JSON to say everything went OK
        response.json('Todo Deleted')
    }) // checking for erros + logging those errors
    .catch(error => console.error(error))

})
// Make the server listen to an environment variable PORT if any, or the specified port
app.listen(process.env.PORT || PORT, ()=>{
    // Logging message
    console.log(`Server running on port ${PORT}`)
})
// mongo, express, dotenv, ejs
const express = require('express')
const app = express()
const cors = require('cors')
const dotenv = require('dotenv')
const MongoClient = require('mongodb').MongoClient
// set port, listen for requests
const PORT = process.env.PORT || 8080;

dotenv.config()

let db,
    dbCollection,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'database-test';

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})
    .then(client => {
        console.log(`connected to ${dbName} database`)
        db = client.db(dbName)
        dbCollection = db.collection('collection-test')
    })

/* MIDDLEWARES */
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/', (request, response) => {
    dbCollection.find().toArray()
    .then(data => {
        response.render('index.ejs', {books: data})
    })
})

app.post('/addItem', (request, response) => {
    console.log(request.body)
    dbCollection.insertOne({
        bookTitle: request.body.bookTitle,
        bookAuthor: request.body.bookAuthor,
        likes: 0,
    })
    .then(result => {
        console.log('book added')
        response.redirect('/')
    })
    .catch(err => console.error(err))
})

app.put('/addLike', (request, response) => {
    dbCollection.updateOne({
        bookTitle: request.body.bookTitleL,
        bookAuthor: request.body.bookAuthorL,
        likes: request.body.likesL
    }, {
        $set: {
            likes: request.body.likesL + 1
        }
    }, {
        // maybe i'll change the id, so far it's the default
        sort: {_id: -1},
        // Creates a new document if no documents match the query
        upsert: true
    })
    .then(result => {
        console.log('added one like')
        response.json('Like Added')
    })
    .catch(err => console.error(err))
})

app.delete('/deleteBook', (request, response) => {
    dbCollection.deleteOne({
        bookTitle: request.body.bookTitleD,
        bookAuthor: request.body.bookAuthorD
    })
    .then(result => {
        console.log('Book Deleted')
        response.json('Book Deleted')
    })
    .catch(err => console.error(err))
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
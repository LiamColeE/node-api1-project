const db = require("./data/db");

const express = require('express'); // import the express package

const server = express(); // creates the server

// handle requests to the root of the api, the / route
server.get('/', (req, res) => {
    res.send('Hello from Express');
});

server.post('/api/users', (req, res) => {
    if(req.headers.name != null && req.headers.bio != null)
    {
        let user = {
            name: req.headers.name,
            bio: req.headers.bio
        }
        let completedStatus = db.insert(user)
        .catch((err) => {
            res.status(500);
            res.send({ error: "There was an error while saving the user to the database" })
        })
        .then((userRes) => {
            console.log(userRes);
            res.status(201);
            res.send(userRes)
        })
    }
    else{
        res.status(400);
        res.send({ errorMessage: "Please provide name and bio for the user." })
    }
})

server.get('/api/users', (req, res) => {
    db.find()
    .catch((err) => {
        res.send({ error: "The users information could not be retrieved." });
        res.status(500);
    })
    .then((users) =>
    {
        res.send(users);
        res.status(201);
    });
})

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id)
    .catch((err) => {
        res.send({ error: "The user information could not be retrieved." });
        res.status(500);
    })
    .then((user) => {
        if(user == null){
            res.status(404);
            res.send({ message: "The user with the specified ID does not exist." });
        }
        else{
            res.send(user);
        }
    });
})

server.delete('/api/users/:id', (req,res) => {
    db.remove(req.params.id)
    .catch((err) => {
        res.send({ error: "The user information could not be retrieved." });
        res.status(500);
    })
    .then((removeRes) => {
        if(removeRes < 1){
            res.send({ message: "The user with the specified ID does not exist." });
            res.status(404);
        }
        else{
            res.send("deleted " + removeRes + " users")
        }
    });
})

// watch for connections on port 5000
server.listen(5000, () =>
    console.log('Server running on http://localhost:5000')
);


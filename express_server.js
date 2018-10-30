// Required Modules
const express = require("express"); 
const app = express();
const PORT = 8080; 
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true})); 

app.set("view engine", "ejs");

const urlDatabase = {
    "b2xVnZ": "http://www.lighthouselabs.ca",
    "9sm5xK": "http://www.google.com"
};

app.get("/hello", (request, response) => {
    response.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (request, response) => {
    response.send("Hello!");
});

app.get("/urls.json", (request, response) => {
    response.json(urlDatabase);
}); 

app.get("/urls", (request, response) => {
    let templateVars = { urls: urlDatabase };
    response.render("urls_index", templateVars);
}); 

app.get("/urls/new",(request, response) => {
    response.render("urls_new");
});

app.get("/urls/:id", (request, response) => {
    let templateVars = { shortURL:request.params.id };
    response.render("urls_show", templateVars);
}); 

app.get("/u/:shortURL", (request, response) => {
    response.redirect(longURL); 
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});

app.post("/urls", (request, response) => {
    console.log(request.body);
    response.send("Ok");
}); 

function generateRandomString() {
    let ranString = Math.random().toString(36).substring(7)
    console.log(ranString); 
}
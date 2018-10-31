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

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/", (req, res) => {
    res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
    res.json(urlDatabase);
}); 

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
}); 

app.get("/urls/new",(req, res) => {
    res.render("urls_new");
});

app.get("/urls/:id", (req, res) => {
    let templateVars = { shortURL:req.params.id };
    res.render("urls_show", templateVars);
}); 

app.get("/u/:shortURL", (req, res) => {
    res.redirect(longURL); 
});

app.post("/urls", (req, res) => {
    console.log(req.body);
    const newID = generateRandomString(); 
    urlDatabase[newID] = req.body.longURL;
    console.log(urlDatabase);
    res.redirect("/urls/");
}); 

app.post("/urls/:id/delete", (req, res) => {
    delete urlDatabase[req.params.id];
    res.redirect("/urls/");
    console.log("URL Deleted by User");
});

function generateRandomString() {
    let ranString = Math.random().toString(36).substring(7)
    console.log(ranString); 
    return ranString;
}

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}!`);
});
const express = require("express");
const {exec} = require("child_process");
const app = express();
const mysql = require('mysql');
const { stdout } = require("process");
const { error, dir } = require("console");
const port = 8080;
mykey="foobar";
    var mySqlConnection = mysql.createConnection({
        host: "localhost",
        user: "Nathan",
        password: "badpass", 
        database: "nscc",
        multipleStatements: true
    });

function ConnectToSQL(){
    mySqlConnection.connect((error) => {
        if (error) {
            console.log("Error connecting " + 
                "to SQL: " + error);
            return;
        }
    });
}

function GetSQL(){
    app.get('/', (req, res) => {
        res.sendFile('C:/Users/Administrator/Desktop/Lab Assignment/inject.html');
    });
    app.get('/sql', (req, res) => {
        const names = req.query.usrName
        if (req.query.apiKey !== mykey) return res.send("Nah man you aint doing it right");
        if (/delete|insert|use|into|password|database|nscc/i.test(req.query.usrName)) return res.send("that isnt allowed here"); //this is blocking the commands or words
        console.log("parms passed in are:" + JSON.stringify(req.query));

            const SQLQuery = `SELECT * FROM nscc.people WHERE name = '${names}'`;

            mySqlConnection.query(SQLQuery, [names], (error, results1) => {
                if (error) {
                    console.error("SQL error:", error);
                }
                console.log("Database response Name:", results1);
                    res.json({
                        Results: results1 });
                })}); 
}

function DIRS(){
    app.get('/cmd', (req, res) => {
        if (req.query.apiKey !== mykey) return res.send("Nah man you aint doing it right");
        if (/del|type|dir|cat|cmd/i.test(req.query.directory)) return res.send("that isnt allowed here"); //this is also blocking the commands or words
        console.log("parms passed in are:" + JSON.stringify(req.query));

        let dirs = req.query.directory;
        exec(`dir ${dirs}`, (error, stdout, stderr) => {
            if (error) {
                console.error("The Command Error:", error);
                return;
            }
            console.log("The Command Output:\n", stdout);
            res.send(`<pre>${stdout}</pre>`);
            if (stderr) {
                console.log("The end of the DIR tree! Happy days!!");
            }
        });
    });    
}

//Main calling of functions
ConnectToSQL() //For the connection to SQL database
GetSQL() //For the SQL stuff
DIRS()  //For the Dir Tree stuff
app.listen(port, () => {
  console.log('server started on port ' + port);
});
var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require("body-parser");
var mongo = require('mongoskin');
var db = mongo.db("mongodb://admin:admin@ds157187.mlab.com:57187/sergst", {native_parser: true});

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

app.use(function (req, res, next) {
    req.db = db;
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
    next();
});

app.get('/', function (req, res) {
    var data = {
        "Data": ""
    };
    data["Data"] = "Welcome to Time Track app using Mongodb...";
    res.json(data);
});

app.get('/employees', function (req, res) {
    var data = {
        "Data": ""
    };
    var db = req.db;
    db.collection('employees').find().toArray(function (err, items) {
        if (!!err) {
            data["Employees"] = "Error fetching data";
            res.json(data);
        } else {
            if (!!items && items.length != 0) {
                data["error"] = 0;
                data["Employees"] = items;
                res.json(data);
            } else {
                data["error"] = 1;
                data["Employees"] = 'No Employees Found..';
                res.json(data);
            }
        }
    });
});

app.post('/employees', function (req, res) {

    var lastName = req.body.lastName;
    var firstName = req.body.firstName;
    var middleName = req.body.middleName;
    var job = req.body.job;
    var department = req.body.department;
    var date = req.body.date;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;

    var data = {
        "error": 1,
        "Employees": ""
    };
    if (!!lastName && !!firstName && !!middleName && !!job && !!department && !!date && !!startTime && !!endTime) {
        db.collection('employees').insert(
            {
                lastName: lastName,
                firstName: firstName,
                middleName: middleName,
                job: job,
                department: department,
                date: date,
                startTime: startTime,
                endTime: endTime
            },
            function (err, result) {
                if (!!err) {
                    data["Employees"] = "Error Adding data";
                } else {
                    data["error"] = 0;
                    data["Employees"] = "Employee Added Successfully";
                }
                res.json(data);
            });
    } else {
        data["Employees"] = "Please provide all required data (i.e : First Name, Last Name)";
        res.json(data);
    }
});

app.put('/employees', function (req, res) {
    var Id = req.body.id;
    var date = req.body.date;
    var startTime = req.body.startTime;
    var endTime = req.body.endTime;
    var data = {
        "error": 1,
        "employees": ""
    };
    if (!!date && !!startTime && !!endTime) {
        db.collection('employees').update({_id: mongo.helper.toObjectID(Id)}, {
            $set: {
                date: date,
                startTime: startTime,
                endTime: endTime
            }
        }, function (err) {
            if (!!err) {
                data["Employees"] = "Error Updating data";
                console.log("second");
            } else {
                data["error"] = 0;
                data["Employees"] = "Updated Successfully";
            }
            res.json(data);
        });
    } else {
        data["Employees"] = "Please provide all required data (i.e : First Name, Last Name)";
        res.json(data);
    }
});

app.delete('/employees/:id', function (req, res) {
    var id = req.params.id;
    var data = {
        "error": 1,
        "employees": ""
    };
    if (!!id) {

        db.collection('employees').remove({_id: mongo.helper.toObjectID(id)}, function (err, result) {
            if (!!err) {
                data["Employees"] = "Error deleting data";
            } else {
                data["error"] = 0;
                data["Employees"] = "Delete Employee Successfully";
            }
            res.json(data);
        });
    } else {
        data["Employees"] = "Please provide all required data (i.e : First Name, Last Name)";
        res.json(data);
    }
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Connected & Listen to port " + port);
});
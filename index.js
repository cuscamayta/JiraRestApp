var express = require('express'),
    jiraApi = require('jira').JiraApi,
    jira = null;

var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// var app = express();

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/addLog', function(request, response) {


});

app.get('/', function(request, response) {    
    response.sendfile('./index.html');
});


//Convert second to hour and minutes
// var time = 27900
// var minutes = (time % 3600)/60;
// var hours = parseInt(time / 3600);

app.post('/login', function(req, resp) {
    try {
        var config = {
            "username": req.body.userName,
            "password": req.body.password,
            "port": 443,
            "host": "innovision.atlassian.net"
        };

        jira = new jiraApi('https', config.host, config.port, config.username, config.password, '2');

        jira.getCurrentUser(function(error, response, body) {          
            resp.send({ status: true, hasBeenLogged: response != null ? true : false, data: response });
        });
    } catch (ex) {
        resp.send({ error: ex });
    }
});



app.get('/test', function(request, response) {

    var config = {
        "username": "cuscamayta",
        "password": "Innsa1234",
        "port": 443,
        "host": "innovision.atlassian.net"
    }
    var jira = new jiraApi('https', config.host, config.port, config.username, config.password, '2');

    console.log(jira);


    var issueNumber = "MANRMTOOLS-819";



    var issue1 = {};

    var worklog = {
        "timeSpent": "1h 30m",
        "started": "2015-09-01T10:30:18.932+0530",
        "comment": "logging via nodejs"
    };

    jira.addWorklog('MANRMTOOLS-880', worklog, '2h', function(a, b) {
        console.log('a');
        console.log(a);
        console.log('b');
        console.log(b);
    });

    var jql = 'sprint in openSprints ()';
    //    jira.searchJira(jql, function (error, body) {
    //        console.log('body');
    //        console.log(body);
    //        //            response.send(body);
    //    });

    jira.getUsersIssues('cuscamayta', true, function(error, body) {
        response.send(body);
    });

    //    jira.findIssue(issueNumber, function (error, issue) {
    //        issue1 = issue;
    //
    //
    //        console.log('Status: ' + issue.fields.status.name);
    //        response.send(issue);
    //    });


    // response.sendfile('./index.html');

});


//app.get('/issues', function () {
//    var jira = new JiraApi('https', 'innovision.atlassian.net', 80, 'cuscamayta', 'Innsa1234', '2.0.alpha1');
//});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});

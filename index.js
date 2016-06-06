var express = require('express'),
    jiraApi = require('jira').JiraApi,
    session = require('express-session'),
    bodyParser = require('body-parser'),
    jira = null;



var app = express();
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// var app = express();

app.set('port', (process.env.PORT || 5000));
// app.use(checkAuthentication);
app.use(express.static(__dirname + '/public'));

// app.use(bodyParser.urlencoded({ extended: true }));

app.get('/addLog', function(request, response) {


});

app.get('/', function(request, response) {
    response.sendfile('./index.html');
});


app.post('/login', function(req, resp) {
    try {
        var config = {
            "username": req.body.userName,
            "password": req.body.password,
            "port": 443,
            "host": "innovision.atlassian.net"
        };

        jira = new jiraApi('https', config.host, config.port, config.username, config.password, '2');

        session.jiraInstance = jira;

        jira.getCurrentUser(function(error, response, body) {
            resp.send({ status: true, hasBeenLogged: response != null ? true : false, data: response });
        });
    } catch (ex) {
        resp.send({ error: ex });
    }
});

app.post('/saveLogWork', function(request, response) {
    var logWork = request.body.worklog,
        issueKey = request.body.issue;

    if (jira)
        jira.addWorklog(issueKey, worklog, '2h', function(a, b) {
            console.log('a');
            console.log(a);
            console.log('b');
            console.log(b);
        });

    // var worklog = {
    //     "timeSpent": "1h 30m",
    //     "started": "2015-09-01T10:30:18.932+0530",
    //     "comment": "logging via nodejs"
    // };

});

// function checkAuthentication(req, res, next) {
//     if (jira) {
//         next();
//     } else {
//         res.redirect("/login");
//     }
// }

// function existJiraObject(){
//     if(!jira)
//     return 
// }

app.post('/getWorkLogs', function(request, response) {
    var jql = 'worklogDate >="' + request.body.startDate + '" and worklogDate <="' + request.body.endDate + '" and project=' + request.body.projectName + ' and worklogAuthor=' + request.body.userName;

    if (!jira)
        jira = session.jiraInstance;

    if (!jira) response.send({ isLogged: false });

    jira.searchJira(jql, { fields: ['*all'] }, function(error, body) {
        body.isLogged = jira == null || jira == undefined ? false : true;
        response.send(body);
    });
})

app.get('/test', function(request, response) {


    var config = {
        "username": "cuscamayta",
        "password": "Innsa1234",
        "port": 443,
        "host": "innovision.atlassian.net"
    }
    var jira = new jiraApi('https', config.host, config.port, config.username, config.password, '2');

    var worklog = {
        // "timeSpent": "1h 15m",
        "started": "2016-05-05",
        "comment": "logging via nodejs"
    };

    // function(issueId, worklog, newEstimate, callback)

    // jira.addWorklog('MANRMTOOLS-1087', worklog, '2h', function(a, b) {
    //     console.log('a');
    //     console.log(a);
    //     console.log('b');
    //     console.log(b);
    // });

    var jql = 'worklogDate >="2016/05/03" and worklogDate >="2016/05/23" and project=MANRMTools and worklogAuthor=cuscamayta';
    jira.searchJira(jql, { fields: ['*all'] }, function(error, body) {
        response.send(body);
    });

    // jira.getUsersIssues('cuscamayta', true, function(error, body) {
    //     response.send(body);
    // });

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

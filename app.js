// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});

// Create chat bot and listen to messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var DialogLabels = {
    GetPendingApprovals: 'Get Pending Approvals',
    CreateRequest: 'Create Comp-Off Requests',
    HRPolicies: 'Find out about HR Policies'
};

var bot = new builder.UniversalBot(connector, [
    function (session) {
        // prompt for Menu options
        builder.Prompts.choice(
            session,
            'Hi, what are you looking for?',
            [DialogLabels.GetPendingApprovals, DialogLabels.CreateRequest,DialogLabels.HRPolicies],
            {
                maxRetries: 3,
                retryPrompt: 'Not a valid option'
            });
    },
    function (session, result) {
        if (!result.response) {
            // exhausted attemps and no selection, start over
            session.send('Ooops! Too many attemps :( But don\'t worry, I\'m handling that exception and you can try again!');
            return session.endDialog();
        }

        // on error, start over
        session.on('error', function (err) {
            session.send('Failed with message: %s', err.message);
            session.endDialog();
        });

        // continue on proper dialog
        var selection = result.response.entity;
        switch (selection) {
            case DialogLabels.GetPendingApprovals:
                return session.beginDialog('GetPendingApprovals');
            case DialogLabels.CreateRequest:
                return session.beginDialog('CreateRequest');
            case DialogLabels.HRPolicies:
                return session.beginDialog('HRPolicies');
        }
    }
]);

bot.dialog('GetPendingApprovals', require('./GetPendingApprovals'));
bot.dialog('CreateRequest', require('./CreateRequest'));
bot.dialog('HRPolicies', require('./HRPolicies'));

bot.beginDialogAction("ApproveLeave", "/ApproveLeave");
bot.beginDialogAction("RejectLeave", "/RejectLeave");

//Approving Leave
bot.dialog('/ApproveLeave', [
    function (session, args) {
        session.dialogData.leaveId = args.data;
        builder.Prompts.text(session, 'Any Comments about this approval (type N/A for nothing)');
    },
    function (session, results, next) {
        session.send("approving leave....");
        session.endDialog(session.dialogData.leaveId);
        session.beginDialog('GetPendingApprovals');
    }
]);
   
//Approving Leave
bot.dialog('/RejectLeave', [
   function (session, args) {
        session.dialogData.leaveId = args.data;
        builder.Prompts.text(session, 'Any Comments about this Rejection (type N/A for nothing)');
    },
    function (session, results, next) {
        session.send("Rejecting leave....");
        session.endDialog(session.dialogData.leaveId);
        session.beginDialog('GetPendingApprovals');
    }
]);


// log any bot errors into the console
bot.on('error', function (e) {
    console.log('And error ocurred', e);
});
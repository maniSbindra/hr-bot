var builder = require('botbuilder');

module.exports = [

    function (session) {
        // Add code for to check if user is authenticated and backend API authentication token in present session. If not invoke authentication flow
        session.send('Lets file your comp-off request!');
        builder.Prompts.text(session, 'Please enter Date of your Comp-off leave (dd/mm/yyyy)');
    },
    function (session, results, next) {
        session.dialogData.compOffDate = results.response;
        console.log(session.dialogData.compOffDate);
        next();
    },
    
    function (session) {
        builder.Prompts.text(session, 'Please enter Total In-Time in hours (For ex. if you have worked for 2 hours enter 2 or if you have worked for 4.5 hours then enter 4.5)');
    },
    function (session, results, next) {
        session.dialogData.inTime = results.response;
        next();
    },

    function (session) {
        builder.Prompts.text(session, 'Any Comments about this leave - ');
    },
    function (session, results, next) {
        session.dialogData.comments = results.response;
        //session.send('Applying for your leave.');
        next();
    },

    // Apply for leave
    function (session) {
        console.log(session.dialogData);

        var compOffDate = session.dialogData.compOffDate;
        var inTime = session.dialogData.inTime;
        var comments = session.dialogData.comments;

        session.send('Ok. Applying for your leave now for %s...',compOffDate);
        // Add code for backend API call Here
        session.send('Done! Have good time.');

        session.endDialog(); 
    }
];

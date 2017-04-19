var builder = require('botbuilder');

module.exports = [

    function (session) {
        session.send('Lets file your comp-off request!');
        builder.Prompts.text(session, 'Please enter Date of your Comp-off leave (dd/mm/yyyy)');
    },
    function (session, results, next) {
        session.dialogData.compOffDate = results.response;
        console.log(session.dialogData.compOffDate);
        next();
    },
    
    function (session) {
        builder.Prompts.text(session, 'Total In-Time in hours');
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
        session.send('Done! Have good time.');

        session.endDialog(); 
    }
];

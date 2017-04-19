var builder = require('botbuilder');
var https = require('https');
const util = require('util');

module.exports = [

    function (session) {
        builder.Prompts.text(session, 'Ok! Shoot what do you have in your mind.');
    },
    function (session, results) {
        session.dialogData.Qna = results.response;
        //@todo: go to qnamaker service and ask this question

        console.log(results.response);
        jsonObject = JSON.stringify({"question":results.response});

        var postheaders = {
        'Content-Type' : 'application/json',
        'Content-Length' : Buffer.byteLength(jsonObject, 'utf8'),
        'Ocp-Apim-Subscription-Key': process.env.QNA_KEY           
        };

       console.log("postheaders : " + util.inspect(postheaders, false, null));

        var options = {
            host: process.env.QNA_HOST,
            path: process.env.QNA_PATH,
            method: 'POST',
            headers : postheaders
            };

        console.log("options:" + util.inspect(options, false, null));    
        // do the POST call
        var reqPost = https.request(options, function(res) {
            console.log("statusCode: ", res.statusCode);
            // uncomment it for header details
           console.log("headers: ", res.headers);

            res.on('data', function(d) {
                console.info('POST result:\n');
                console.log(d);
                var resVal = d.toString('utf8');
                session.send('this is the response according to FAQs available.');
                session.send(JSON.parse(resVal).answer);
                session.endDialog();
                console.info('\n\nPOST completed');
                //session.beginDialog('/');
            });
        });

        // write the json data
        reqPost.write(jsonObject);
        reqPost.end();
        reqPost.on('error', function(e) {
            console.error(e);
        });

    }
];

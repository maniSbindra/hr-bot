var builder = require('botbuilder');


module.exports = [


function (session)
{
   session.send('Fetching your pending approvals....');
    

  //dummy object - get this from database
  //@todo: get pending approvals
  var leavesPending = [{"leaveid" : 345,"userName":"nishigandhas","comments":"i need leave"},{"leaveid":123,"userName":"brijraj singh","comments":"i need this leave"},{"leaveid":345,"userName":"Mani bindra","comments":"i need comp-off"}]

    
     var message = new builder.Message()
                    .attachmentLayout(builder.AttachmentLayout.carousel)
                    .attachments(leavesPending.map(leavesAsAttachments));
     session.send(message);
     session.endDialog(); 
}
    
];

// Helpers
function leavesAsAttachments(leave) {
    return new builder.HeroCard()
        .title(leave.userName)
        .subtitle(leave.comments)
        .buttons([
           builder.CardAction.dialogAction(null, "ApproveLeave", leave.leaveid, "Approve"),
           builder.CardAction.dialogAction(null, "RejectLeave", leave.leaveid, "Reject"), 
        ]);
}



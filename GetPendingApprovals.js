var builder = require('botbuilder');


module.exports = [


function (session)
{
  // Add code for to check if user is authenticated and backend API authentication token in present session. If not invoke authentication flow

   session.send('Fetching your pending approvals....');
    

  //stubbed object - Need to fetch from backend API
  // Add code to invoke API.
  
  var leavesPending = [{"leaveid" : 9132122,"userAlias":"nimitg","userName":"Nimit S Gandhi","comments":"Going on Vacation."},{"leaveid":9133257,"userAlias":"bsingh","userName":"brijraj singh","comments":"Need to go to passport office"},{"leaveid":9133893,"userAlias": "maniman","userName": "Mani bindra","comments":"comp-off for release over weekend "}]
    
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
        .title("Leave Id : " +leave.leaveid + ", Employee Name : " + leave.userName)
        .subtitle("Empoyee Comment: "+ leave.comments)
        .buttons([
           builder.CardAction.dialogAction(null, "ApproveLeave", leave.leaveid, "Approve"),
           builder.CardAction.dialogAction(null, "RejectLeave", leave.leaveid, "Reject"), 
        ]);
}



// TODO:
// 1) install a trigger at https://script.google.com to run emailOnEdit "From spreadsheet" and "On edit".
// 2) install a trigger at https://script.google.com to run resetEmailCount with a "Time-driven" trigger on a "Day timer".
// 3) set the counter cell address and the target email:
const counterCellAddress = "A1"; // <-- edit this!
const targetEmailAddress = "...@gmail.com"; // <-- edit this!

//// This function might not work with your permissions, so you might have to install a trigger instead anyways:
//function onEdit(event) {
//  if (!alreadySentEmailToday()) email();
//}

function emailOnEdit() {
  if (!alreadySentEmailToday()) email();
}

function email() {
  const emailTo = targetEmailAddress;
  const emailSubject = "test email";
  const emailBody = `Hi! 

This is an automated message: 

Someone edited the form or Google sheet today! 

See the Google sheet here: ...
`;
  GmailApp.sendEmail(emailTo, emailSubject, emailBody);
}

function alreadySentEmailToday() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Counter Sheet"
  );
  const counterCell = sheet.getRange(counterCellAddress);
  counterCell.setValue(counterCell.getValue() + 1);
  return counterCell.getValue() > 1;
}

// add a trigger to run this once a day:
function resetEmailCount() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    "Counter Sheet"
  );
  const counterCell = sheet.getRange(counterCellAddress);
  counterCell.setValue(0);
}
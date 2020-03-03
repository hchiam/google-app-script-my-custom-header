// modern ES6 syntax is available (as of Feb 2020): https://developers.google.com/apps-script/guides/v8-runtime

function onOpen() {
  addMenuItemToUi();
}

function addMenuItemToUi() {
  app()
  .getUi()
  .createMenu('PDF OCR Reader')
  .addItem('Read PDF', 'askUserForUrl') // 2nd parameter 'askUserForUrl' matches askUserForUrl()
  .addToUi();
}

function askUserForUrl() {
  inputBox(title='PDF OCR Reader',
           prompt='Enter the PDF URL:',
           callbackAcceptingInput=doWhatYouWantWithPdfText);
}

function doWhatYouWantWithPdfText(pdfUrl) {
  const pdfText = extractTextFromPdfUrl(pdfUrl);
  
  // further processing of PDF text:
  processPdfText(pdfText);
}

function extractTextFromPdfUrl(pdfUrl) {
  const blob = getPdfBlobDirectlyOrFromGoogleDocUrl(pdfUrl);
  const resource = getResourceFromBlob(blob);
  const processedDoc = createAndGetOcrProcessedDoc(resource, blob, 'en');
  const pdfText = processedDoc.getBody().getText();
  return pdfText;
}

function getPdfBlobDirectlyOrFromGoogleDocUrl(pdfUrl) {
  let blob = null;
  
  if (pdfUrl.endsWith('.pdf')) {
    blob = UrlFetchApp.fetch(pdfUrl).getBlob();
    return blob;
  }
  
  const googleDocIdRegex = /^https:\/\/drive.google.com\/.+?id=([^\/]+)\/?.*$/i;
  const googleDocId = googleDocIdRegex.exec(pdfUrl)[1];
  if (googleDocId) {
    blob = DriveApp.getFileById(googleDocId).getBlob();
  }
  
  return blob;
}

function getResourceFromBlob(blob) {
  const resource = {
    title: blob.getName(),
    mimeType: blob.getContentType(),
  };
  return resource;
}

function createAndGetOcrProcessedDoc(resource, blob, languageCode='en') {
  try {
    const file = Drive.Files.insert(resource, blob, {ocr: true, ocrLanguage: languageCode});
    const procesedDoc = DocumentApp.openById(file.id);
    return procesedDoc;
  } catch(e) {
    console.error(e);
    alert('Whoops! You likely need enable the Advanced Drive API Service: \n\n Resources > Advanced Google Services > Drive API: "ON"');
  }
}

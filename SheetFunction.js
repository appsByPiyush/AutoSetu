function SendUpdateOnAddorEdit(e) {
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  const lastRow = sheet.getLastRow();
  
  // Only run if the edited row is the last row (new data)
  if (range.getRow() !== lastRow) return;

  // Get the row data
  const rowData = sheet.getRange(lastRow, 1, 1, 4).getValues()[0]; // Assuming 4 columns: ID, Name, Email, Phone

  const [id, name, email, phone] = rowData;

  // Only proceed if all required fields are filled
  if (!id || !name || !email || !phone) return;

  const payload = {
    from: "demo123",
    tempName: "temp1",
    data: [
      {
        id: id,
        name: name,
        email: email,
        phone: phone
      }
    ]
  };

  const url = 'https://autosetu.onrender.com/send-whatsapp';
  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  };

  try {
    const resp = UrlFetchApp.fetch(url, options);
    console.log("Response Code:", resp.getResponseCode());
    console.log("Response Body:", resp.getContentText());
  } catch (error) {
    console.error("Error while sending request:", error);
  }
}

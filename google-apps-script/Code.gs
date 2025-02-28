// Configuration
const CONFIG = {
  MENU_URL: '', // Replace with your deployed menu webpage URL
  SHEET_NAME: 'Menu Items',
  EMAIL_SETTINGS: {
    SUBJECT: 'Menu Updated - QR Code Generated',
    SENDER_NAME: 'Digital Menu Maker'
  }
};

// Add menu to Google Sheets UI
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Menu Maker')
    .addItem('Initialize Sheet', 'initializeSheet')
    .addItem('Generate QR Codes', 'generateAllQRCodes')
    .addItem('Send Menu Update Email', 'sendMenuUpdateEmail')
    .addToUi();
}

// Initialize sheet with headers
function initializeSheet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  if (!sheet) {
    const newSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(CONFIG.SHEET_NAME);
    const headers = ['Dish Name', 'Description', 'Price', 'Category', 'Image URL', 'QR Code', 'Last Updated'];
    newSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    newSheet.setFrozenRows(1);
    createMenuCategories();
  }
}

// Create menu categories if they don't exist
function createMenuCategories() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const categories = ['Starter', 'Main', 'Dessert', 'Drinks'];
  
  // Add data validation for category column
  const range = sheet.getRange('D2:D1000'); // Adjust range as needed
  const rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(categories)
    .setAllowInvalid(false)
    .build();
  
  range.setDataValidation(rule);
}

// Generate QR codes for all menu items
function generateAllQRCodes() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const lastRow = sheet.getLastRow();
  
  if (lastRow > 1) { // If there are menu items
    const qrColumn = 6; // Column F
    const timestamp = new Date();
    
    // Generate QR code for the menu URL
    const qrCode = generateQRCode(CONFIG.MENU_URL);
    
    // Update all rows with QR code and timestamp
    for (let row = 2; row <= lastRow; row++) {
      sheet.getRange(row, qrColumn).setValue(qrCode);
      sheet.getRange(row, qrColumn + 1).setValue(timestamp);
    }
    
    // Send email notification
    sendMenuUpdateEmail();
  }
}

// Generate QR code using Google Charts API
function generateQRCode(url) {
  const qrSize = '200x200';
  return `https://chart.googleapis.com/chart?cht=qr&chs=${qrSize}&chl=${encodeURIComponent(url)}`;
}

// Send email notification with menu update and QR code
function sendMenuUpdateEmail() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const qrCode = generateQRCode(CONFIG.MENU_URL);
  const recipient = Session.getActiveUser().getEmail();
  
  // Get all menu items
  const lastRow = sheet.getLastRow();
  const menuData = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  
  // Create menu summary
  const menuSummary = createMenuSummary(menuData);
  
  // Create and send email
  const htmlBody = createEmailBody(menuSummary, qrCode);
  GmailApp.sendEmail(
    recipient,
    CONFIG.EMAIL_SETTINGS.SUBJECT,
    'Please view this email in HTML format.',
    {
      htmlBody: htmlBody,
      name: CONFIG.EMAIL_SETTINGS.SENDER_NAME
    }
  );
}

// Create menu summary by category
function createMenuSummary(menuData) {
  const categories = {};
  
  menuData.forEach(row => {
    const [name, description, price, category] = row;
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ name, description, price });
  });
  
  return categories;
}

// Create HTML email body
function createEmailBody(menuSummary, qrCode) {
  let categoriesHtml = '';
  
  for (const [category, items] of Object.entries(menuSummary)) {
    categoriesHtml += `
      <div style="margin: 20px 0;">
        <h3>${category}</h3>
        <ul>
          ${items.map(item => `
            <li>
              <strong>${item.name}</strong> - $${item.price}<br>
              <small>${item.description}</small>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }
  
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Menu Updated Successfully!</h2>
        
        <div style="margin: 20px 0;">
          <h3>Menu Summary:</h3>
          ${categoriesHtml}
        </div>
        
        <div style="margin: 20px 0;">
          <h3>QR Code for Your Digital Menu:</h3>
          <img src="${qrCode}" alt="Menu QR Code" style="width: 200px; height: 200px;">
        </div>
        
        <div style="margin: 20px 0;">
          <p>You can print this QR code and display it in your restaurant.</p>
          <p>Customers can scan it to view your digital menu.</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Digital Menu Maker.
            Please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

// Handle changes to the sheet
function onEdit(e) {
  const sheet = e.source.getActiveSheet();
  if (sheet.getName() === CONFIG.SHEET_NAME) {
    const row = e.range.getRow();
    if (row > 1) { // If not header row
      const timestamp = new Date();
      sheet.getRange(row, 7).setValue(timestamp); // Update timestamp in column G
    }
  }
}

// Triggered when form is submitted
function onFormSubmit(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
    const response = e.response;
    const itemData = response.getItemResponses();
    
    // Get form data
    const menuItem = {
      name: itemData[0].getResponse(),
      description: itemData[1].getResponse(),
      price: itemData[2].getResponse(),
      category: itemData[3].getResponse(),
      imageUrl: itemData[4].getResponse()
    };
    
    // Generate QR code
    const qrCode = generateQRCode(CONFIG.MENU_URL);
    
    // Add QR code to the last column
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 6).setValue(qrCode);
    
    // Send email notification
    sendEmailNotification(menuItem, qrCode);
    
  } catch (error) {
    Logger.log('Error in onFormSubmit: ' + error.toString());
    throw error;
  }
}

// Send email notification with QR code
function sendEmailNotification(menuItem, qrCode) {
  const recipient = Session.getActiveUser().getEmail();
  const htmlBody = createEmailBody(menuItem, qrCode);
  
  GmailApp.sendEmail(
    recipient,
    CONFIG.EMAIL_SETTINGS.SUBJECT,
    'Please view this email in HTML format.',
    {
      htmlBody: htmlBody,
      name: CONFIG.EMAIL_SETTINGS.SENDER_NAME
    }
  );
}

// Create HTML email body
function createEmailBody(menuItem, qrCode) {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>New Menu Item Added Successfully!</h2>
        <div style="margin: 20px 0;">
          <h3>Item Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${menuItem.name}</li>
            <li><strong>Description:</strong> ${menuItem.description}</li>
            <li><strong>Price:</strong> $${menuItem.price}</li>
            <li><strong>Category:</strong> ${menuItem.category}</li>
          </ul>
        </div>
        <div style="margin: 20px 0;">
          <h3>QR Code for Your Digital Menu:</h3>
          <img src="${qrCode}" alt="Menu QR Code" style="width: 200px; height: 200px;">
        </div>
        <div style="margin: 20px 0;">
          <p>You can print this QR code and display it in your restaurant.</p>
          <p>Customers can scan it to view your digital menu.</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ccc;">
          <p style="color: #666; font-size: 12px;">
            This is an automated message from Digital Menu Maker.
            Please do not reply to this email.
          </p>
        </div>
      </body>
    </html>
  `;
}

// Add menu item manually (for testing)
function addMenuItemManually(menuItem) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  const qrCode = generateQRCode(CONFIG.MENU_URL);
  const timestamp = new Date();
  
  const rowData = [
    menuItem.name,
    menuItem.description,
    menuItem.price,
    menuItem.category,
    menuItem.imageUrl,
    qrCode,
    timestamp
  ];
  
  sheet.appendRow(rowData);
  sendEmailNotification(menuItem, qrCode);
}

// Test function
function testAddMenuItem() {
  const testItem = {
    name: 'Test Dish',
    description: 'A delicious test dish',
    price: '9.99',
    category: 'Main',
    imageUrl: 'https://example.com/image.jpg'
  };
  
  addMenuItemManually(testItem);
} 
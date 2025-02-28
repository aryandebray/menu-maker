// Menu OCR processing using Google Cloud Vision API
function processMenuImage(imageFile) {
  // Convert image to base64
  const imageData = Utilities.base64Encode(imageFile.getBytes());
  
  // Prepare the request to Cloud Vision API
  const apiEndpoint = 'https://vision.googleapis.com/v1/images:annotate';
  const apiKey = CONFIG.VISION_API_KEY; // Add this to your CONFIG object
  
  const requestBody = {
    requests: [{
      image: {
        content: imageData
      },
      features: [{
        type: 'TEXT_DETECTION'
      }]
    }]
  };
  
  const options = {
    method: 'POST',
    contentType: 'application/json',
    payload: JSON.stringify(requestBody)
  };
  
  try {
    const response = UrlFetchApp.fetch(`${apiEndpoint}?key=${apiKey}`, options);
    const result = JSON.parse(response.getContentText());
    return extractMenuItems(result);
  } catch (error) {
    Logger.log('Error in OCR processing: ' + error.toString());
    throw error;
  }
}

// Extract menu items from OCR result
function extractMenuItems(ocrResult) {
  const text = ocrResult.responses[0].textAnnotations[0].description;
  const lines = text.split('\n');
  
  const items = [];
  let currentItem = {};
  
  // Regular expressions for matching
  const priceRegex = /\$?\d+\.?\d*/;
  const categoryRegex = /^(Starter|Main|Dessert|Drinks|Appetizer|Entree)/i;
  
  lines.forEach((line, index) => {
    // Check if line contains a price
    const priceMatch = line.match(priceRegex);
    
    if (priceMatch) {
      // Assume the text before the price is the item name
      const name = line.substring(0, priceMatch.index).trim();
      const price = priceMatch[0];
      
      // Look for description in the next line
      const description = (index < lines.length - 1 && !lines[index + 1].match(priceRegex))
        ? lines[index + 1].trim()
        : '';
      
      // Try to determine category
      let category = 'Main'; // default category
      if (name.toLowerCase().includes('salad') || name.toLowerCase().includes('soup')) {
        category = 'Starter';
      } else if (name.toLowerCase().includes('cake') || name.toLowerCase().includes('ice cream')) {
        category = 'Dessert';
      } else if (name.toLowerCase().includes('coffee') || name.toLowerCase().includes('juice')) {
        category = 'Drinks';
      }
      
      items.push({
        name: name,
        description: description,
        price: price.replace('$', ''),
        category: category
      });
    }
    
    // Check for category headers
    const categoryMatch = line.match(categoryRegex);
    if (categoryMatch) {
      currentCategory = categoryMatch[0];
    }
  });
  
  return items;
}

// Web app endpoint to handle image upload
function doPost(e) {
  if (!e.postData || !e.postData.contents) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'No image data received'
    })).setMimeType(ContentService.MimeType.JSON);
  }
  
  try {
    const imageBlob = e.postData.contents;
    const items = processMenuImage(imageBlob);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      items: items
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Save extracted menu items to sheet
function saveMenuItems(items) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);
  
  items.forEach(item => {
    const rowData = [
      item.name,
      item.description,
      item.price,
      item.category,
      '', // Image URL (empty for OCR-extracted items)
      generateQRCode(CONFIG.MENU_URL),
      new Date()
    ];
    
    sheet.appendRow(rowData);
  });
  
  // Send email notification
  sendMenuUpdateEmail();
} 
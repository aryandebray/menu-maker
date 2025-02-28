const CONFIG = {
    // Google Sheets configuration
    SHEET_ID: '1ttJPKVBugC6DdwZRBv-jeZcZneLkeAZBH9G0zWELywA', // You'll add this after setting up Google Sheet
    WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbzUiKzqFk-EeTcaXjo5BC-vVElBO7fdvfmeVzdK90OaXV9qo3FeudytzJ6BWQ7THVA/exec', // Add your Apps Script deployment URL here
    SHEET_NAME: 'Menu Items',
    
    // Menu categories
    CATEGORIES: ['Starter', 'Main', 'Dessert', 'Drinks'],
    
    // Update frequency (in milliseconds)
    UPDATE_INTERVAL: 5 * 60 * 1000, // 5 minutes
    
    // Column indices in Google Sheet (0-based)
    COLUMNS: {
        DISH_NAME: 0,
        DESCRIPTION: 1,
        PRICE: 2,
        CATEGORY: 3,
        IMAGE_URL: 4,
        QR_CODE: 5,
        TIMESTAMP: 6
    }
};
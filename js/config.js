const CONFIG = {
    // Google Sheets configuration
    SHEET_ID: '', // You'll add this after setting up Google Sheet
    WEBAPP_URL: '', // Add your Apps Script deployment URL here
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
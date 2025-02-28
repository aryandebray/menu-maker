const CONFIG = {
    // Google Sheets configuration
    SHEET_ID: '1ttJPKVBugC6DdwZRBv-jeZcZneLkeAZBH9G0zWELywA', // Replace with your actual Sheet ID
    WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbxP1PriPiq5D1xdcoWhoASOJtmtk33_dD2Ofd5e1JR4QKf3391d1KURBaT0SobBZho/exec', // Replace with your actual Web App URL
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
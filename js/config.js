const CONFIG = {
    // Google Sheets configuration
    SHEET_ID: '', // To be filled by user
    API_KEY: '', // To be filled by user
    SHEET_NAME: 'Menu Items',
    
    // API endpoints
    SHEETS_API_ENDPOINT: 'https://sheets.googleapis.com/v4/spreadsheets',
    QR_CODE_API: 'https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=',
    
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
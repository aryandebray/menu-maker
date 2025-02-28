# Restaurant Digital Menu Maker

A digital menu solution that allows restaurant owners to easily create and manage their menus through Google Forms, with automatic QR code generation and a responsive web interface for customers.

## Features

- 📝 Menu submission through Google Form
- 🔄 Automatic QR code generation
- 📱 Responsive web-based menu display
- 📧 Automated email notifications
- 🔄 Real-time menu updates via Google Sheets
- 📊 Category-based menu organization

## Tech Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Google Apps Script
- Database: Google Sheets
- QR Code Generation: Google Charts API
- Hosting: GitHub Pages/Firebase Hosting

## Setup Instructions

### 1. Google Form Setup

1. Create a new Google Form with the following fields:
   - Dish Name (Short Answer)
   - Description (Paragraph)
   - Price (Short Answer)
   - Category (Multiple Choice: Starter, Main, Dessert, Drinks)
   - Image URL (Short Answer)

2. Link the form to a Google Sheet

### 2. Google Apps Script Setup

1. Open the linked Google Sheet
2. Go to Extensions > Apps Script
3. Copy the contents of `google-apps-script/Code.gs` into the script editor
4. Set up the following triggers:
   - On Form Submit
   - Time-driven trigger for menu updates

### 3. Frontend Setup

1. Clone this repository
2. Update the `config.js` file with your Google Sheet ID
3. Deploy to GitHub Pages or Firebase Hosting

### 4. Configuration

1. Enable Google Sheets API in Google Cloud Console
2. Set up necessary API credentials
3. Update the configuration in `config.js` with your credentials

## Project Structure

```
├── frontend/
│   ├── index.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── config.js
│   │   └── menu.js
│   └── assets/
├── google-apps-script/
│   └── Code.gs
└── README.md
```

## Usage

1. Restaurant owners submit menu items through the Google Form
2. System automatically generates QR code and sends email notification
3. Customers scan QR code to view the digital menu
4. Menu updates in real-time when new items are added

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
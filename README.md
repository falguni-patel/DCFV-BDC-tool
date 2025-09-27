# DCFV BDC Dashboard - Bangalore Site

A Node.js web application that provides centralized access to all DCFV BDC portals and dashboards for the Bangalore site.

## Features

- **Portal Hub**: Central dashboard with links to all three DCFV BDC portals
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Quick Access**: Both short URLs (goto links) and direct IP addresses
- **Copy to Clipboard**: Easy URL copying functionality
- **Portal Status**: Visual indicators for portal availability
- **Bookmark Integration**: Browser bookmark support
- **Share Functionality**: Easy portal link sharing

## Portals Included

1. **DCFV BDC Innovation Dashboard** 🚀
   - Short URL: http://goto/dcfv-bdc-innovation
   - Direct URL: http://10.224.157.37:3000/view/DCFV_BDC_Innovation_Dashboard.html

2. **DCFV User Portal** 👥
   - Short URL: http://goto/dcfv-user-portal
   - Direct URL: http://10.224.157.37:5003/signin

3. **ESVBA Operations** 📊
   - Short URL: http://goto/esvbaops
   - Direct URL: http://10.224.157.37:5002/api/v1/head_count_ba/hc_summary

## Installation

1. **Clone or download the project**:
   ```powershell
   cd "c:\Users\falgunip\Downloads\DCFV_BDC_all_dashboards"
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

## Usage

### Development Mode
```powershell
npm run dev
```
This starts the server with nodemon for auto-reloading during development.

### Production Mode
```powershell
npm start
```
This starts the server in production mode.

The application will be available at: http://localhost:3001

## Project Structure

```
DCFV_BDC_all_dashboards/
├── server.js                 # Main Express server
├── package.json             # Dependencies and scripts
├── views/                   # EJS templates
│   ├── layout.ejs          # Main layout template
│   ├── index.ejs           # Dashboard home page
│   ├── portal.ejs          # Individual portal page
│   └── error.ejs           # Error page
├── public/                  # Static assets
│   ├── styles/
│   │   └── main.css        # Custom styles
│   └── scripts/
│       └── main.js         # Client-side JavaScript
└── README.md               # This file
```

## API Endpoints

- `GET /` - Main dashboard page
- `GET /portal/:id` - Individual portal details page
- `GET /api/portals` - JSON API for portal data
- `GET /health` - Health check endpoint

## Configuration

### Portal Configuration
Portals are configured in `server.js` in the `portals` array. Each portal has:
- `id`: Unique identifier
- `name`: Display name
- `description`: Portal description
- `shortUrl`: goto link
- `directUrl`: Direct IP address
- `icon`: Emoji icon
- `category`: Portal category

### Server Configuration
- **Port**: Default 3001 (configurable via PORT environment variable)
- **View Engine**: EJS
- **Static Files**: Served from `/public` directory

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Internet Explorer 11+ (limited features)

## Network Requirements

- **Internal Network Access**: Required for goto links
- **IP Access**: Direct IP addresses accessible from Bangalore site
- **VPN**: Required for external network access

## Troubleshooting

### Common Issues

1. **Portal links not working**:
   - Check network connectivity
   - Verify VPN connection if accessing externally
   - Try direct IP addresses

2. **Copy to clipboard not working**:
   - Ensure HTTPS (for production) or localhost
   - Check browser permissions
   - Use manual copy as fallback

3. **Server won't start**:
   - Check if port 3001 is available
   - Verify Node.js installation
   - Check for missing dependencies

### Support

- **Email**: dcfv-support@company.com
- **Phone**: +91-80-XXXX-XXXX
- **Hours**: 9 AM - 6 PM IST

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Internal use only - DCFV BDC Bangalore Site

## Changelog

### Version 1.0.0
- Initial release
- Three portal integration
- Responsive dashboard design
- Copy/bookmark/share functionality
- Portal status monitoring

---

**DCFV BDC Dashboard** - Streamlining access to all your essential portals from one central location.
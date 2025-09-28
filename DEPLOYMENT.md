# DCFV BDC Dashboard Tool 🚀

A comprehensive portal hub for accessing all DCFV BDC Bangalore site dashboards and services.

## 🌟 Features

- **Portal Hub**: Central access point for all DCFV BDC dashboards
- **Innovation Dashboard**: Track innovation metrics and analytics
- **User Portal**: Main DCFV user services
- **BA Operations**: Business analyst operations and head count tracking
- **EWS Dashboard**: Early warning system monitoring
- **Session Management**: Secure user authentication and sessions

## 🏗️ Architecture

- **Frontend**: EJS templates with responsive design
- **Backend**: Node.js with Express.js
- **Session Store**: In-memory sessions with express-session
- **Static Assets**: CSS and JavaScript served from public directory

## 📋 Prerequisites

- Node.js (v14+ recommended)
- npm or yarn
- Linux server (for production deployment)

## 🚀 Quick Start

### Local Development

```bash
# Clone the repository
git clone https://github.com/falguni-patel/DCFV-BDC-tool.git
cd DCFV-BDC-tool

# Install dependencies
npm install

# Start development server
npm run dev
# or
npm start
```

The application will be available at: `http://localhost:5001`

## 🐧 Linux Production Deployment

### Using the Automated Deploy Script

1. **Clone and setup**:
```bash
git clone https://github.com/falguni-patel/DCFV-BDC-tool.git
cd DCFV-BDC-tool
chmod +x deploy.sh
```

2. **Run deployment**:
```bash
./deploy.sh
```

The script will automatically:
- ✅ Check Node.js and npm installation
- ✅ Install project dependencies
- ✅ Install and configure PM2
- ✅ Create logs directory
- ✅ Start the application with PM2
- ✅ Set up PM2 startup scripts

### Manual PM2 Setup

```bash
# Install dependencies
npm install

# Install PM2 globally
sudo npm install -g pm2

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

## � Updating the Application

### Automated Update (Recommended)

For updates after initial deployment, use the automated update script:

```bash
# Download and run the update script
wget https://raw.githubusercontent.com/falguni-patel/DCFV-BDC-tool/main/update.sh
chmod +x update.sh
./update.sh
```

Or use the quick one-liner update:

```bash
# Quick update (less verbose)
wget https://raw.githubusercontent.com/falguni-patel/DCFV-BDC-tool/main/quick-update.sh
chmod +x quick-update.sh
./quick-update.sh
```

### What the update script does:
- ✅ Stops the current PM2 application
- ✅ Creates a backup of the current version
- ✅ Clones the latest version from GitHub
- ✅ Installs/updates dependencies
- ✅ Restarts the application with PM2
- ✅ Handles rollback if any step fails
- ✅ Cleans up and provides status information

## �📊 PM2 Management Commands

```bash
# Check application status
pm2 status

# View logs
pm2 logs dcfv-bdc-tool

# Restart application
pm2 restart dcfv-bdc-tool

# Stop application
pm2 stop dcfv-bdc-tool

# Monitor resources
pm2 monit

# View detailed info
pm2 show dcfv-bdc-tool
```

## 🌐 Access Points

- **Main Dashboard**: `http://your-server-ip:5001`
- **Portal Selection**: Choose from available DCFV BDC portals
- **Direct Links**: Access specific dashboards directly

## 📁 Project Structure

```
DCFV-BDC-tool/
├── server.js              # Main application server
├── package.json            # Dependencies and scripts
├── ecosystem.config.js     # PM2 configuration
├── deploy.sh              # Automated deployment script
├── public/                # Static assets
│   ├── scripts/
│   │   └── main.js
│   └── styles/
│       └── main.css
└── views/                 # EJS templates
    ├── index.ejs          # Main portal hub
    ├── portal.ejs         # Portal selection
    ├── signin.ejs         # Sign-in page
    ├── ba-operations.ejs  # BA operations dashboard
    └── error.ejs          # Error page
```

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment mode (development/production)

### PM2 Configuration

The `ecosystem.config.js` file contains:
- Process name: `dcfv-bdc-tool`
- Memory limit: 500MB
- Auto-restart: enabled
- Logging: comprehensive log files

## 📝 Available Portals

1. **Innovation Dashboard**: Analytics and tracking
2. **User Portal**: Main user services
3. **BA Operations**: Business operations summary
4. **EWS Dashboard**: Early warning system

## 🔐 Security Features

- Session-based authentication
- Secure cookie configuration
- Input validation and sanitization
- Error handling and logging

## 🛠️ Development

### Adding New Portals

1. Update the `portals` array in `server.js`
2. Add new EJS templates in `views/` if needed
3. Update styles in `public/styles/main.css`

### Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon

## 📊 Monitoring

The application includes comprehensive logging:
- Combined logs: `logs/dcfv-bdc-combined.log`
- Output logs: `logs/dcfv-bdc-out.log`
- Error logs: `logs/dcfv-bdc-error.log`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

ISC License - Internal Intel Corporation use.

## 👥 Team

**DCFV BDC Team** - Bangalore Site Operations

---

🎯 **Quick Deploy**: `chmod +x deploy.sh && ./deploy.sh`

📧 **Support**: Contact DCFV BDC Team for issues and feature requests
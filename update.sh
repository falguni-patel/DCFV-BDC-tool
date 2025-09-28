#!/bin/bash

# DCFV BDC Tool - Auto Update Script
# This script will update the application from GitHub and restart PM2

echo "🔄 DCFV BDC Tool - Auto Update Script"
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/falguni-patel/DCFV-BDC-tool.git"
APP_DIR="DCFV-BDC-tool"
BACKUP_DIR="DCFV-BDC-tool-backup-$(date +%Y%m%d-%H%M%S)"
PM2_APP_NAME="dcfv-bdc-tool"

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install git first."
    exit 1
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    print_error "PM2 is not installed. Please install PM2 first."
    exit 1
fi

print_status "Starting update process..."

# Step 0: Clean up port conflicts
print_status "Checking for port conflicts on port 5001..."
if command -v lsof &> /dev/null; then
    PORT_PROCESS=$(lsof -ti:5001)
    if [ ! -z "$PORT_PROCESS" ]; then
        print_warning "Port 5001 is in use, cleaning up..."
        lsof -ti:5001 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
fi

# Step 1: Stop PM2 application
print_status "Stopping PM2 application: $PM2_APP_NAME"
pm2 stop $PM2_APP_NAME 2>/dev/null || print_warning "Application was not running"

# Step 2: Create backup of current version (if exists)
if [ -d "$APP_DIR" ]; then
    print_status "Creating backup of current version..."
    mv "$APP_DIR" "$BACKUP_DIR"
    if [ $? -eq 0 ]; then
        print_success "Backup created: $BACKUP_DIR"
    else
        print_error "Failed to create backup"
        exit 1
    fi
else
    print_warning "No existing application directory found. This might be a fresh installation."
fi

# Step 3: Clone the latest version from GitHub
print_status "Cloning latest version from GitHub..."
git clone $REPO_URL

if [ $? -ne 0 ]; then
    print_error "Failed to clone repository from GitHub"
    
    # Restore backup if clone failed
    if [ -d "$BACKUP_DIR" ]; then
        print_status "Restoring backup..."
        mv "$BACKUP_DIR" "$APP_DIR"
        print_warning "Backup restored. Starting old version..."
        cd "$APP_DIR"
        pm2 start ecosystem.config.js
    fi
    exit 1
fi

print_success "Repository cloned successfully"

# Step 4: Navigate to application directory
cd "$APP_DIR"

# Step 5: Install/Update dependencies
print_status "Installing/updating dependencies..."
npm install

if [ $? -ne 0 ]; then
    print_error "Failed to install dependencies"
    
    # Restore backup if npm install failed
    cd ..
    if [ -d "$BACKUP_DIR" ]; then
        print_status "Restoring backup due to dependency installation failure..."
        rm -rf "$APP_DIR"
        mv "$BACKUP_DIR" "$APP_DIR"
        cd "$APP_DIR"
        print_warning "Backup restored. Starting old version..."
        pm2 start ecosystem.config.js
    fi
    exit 1
fi

print_success "Dependencies installed successfully"

# Step 6: Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Step 7: Delete old PM2 process and start new one
print_status "Cleaning up old PM2 processes..."
pm2 delete $PM2_APP_NAME 2>/dev/null || print_warning "No existing PM2 process to delete"

print_status "Starting updated application with PM2..."
pm2 start ecosystem.config.js

if [ $? -eq 0 ]; then
    print_success "Application started successfully with PM2"
    
    # Save PM2 configuration
    pm2 save
    print_success "PM2 configuration saved"
    
    # Show status
    print_status "Current PM2 status:"
    pm2 status
    
    print_success "======================================"
    print_success "🎉 Update completed successfully!"
    print_success "======================================"
    print_success "📊 Dashboard URL: http://$(hostname -I | awk '{print $1}'):5001"
    print_success "📊 Or: http://your-server-ip:5001"
    print_success "📝 PM2 Status: pm2 status"
    print_success "📄 View Logs: pm2 logs $PM2_APP_NAME"
    print_success "🔄 Restart: pm2 restart $PM2_APP_NAME"
    print_success "======================================"
    
    # Cleanup backup after successful update (optional)
    read -p "$(echo -e ${YELLOW}Delete backup folder $BACKUP_DIR? [y/N]: ${NC})" -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "../$BACKUP_DIR"
        print_success "Backup folder deleted"
    else
        print_status "Backup folder kept: ../$BACKUP_DIR"
    fi
    
else
    print_error "Failed to start application with PM2"
    
    # Restore backup if PM2 start failed
    cd ..
    if [ -d "$BACKUP_DIR" ]; then
        print_status "Restoring backup due to PM2 start failure..."
        rm -rf "$APP_DIR"
        mv "$BACKUP_DIR" "$APP_DIR"
        cd "$APP_DIR"
        print_warning "Backup restored. Starting old version..."
        pm2 start ecosystem.config.js
    fi
    exit 1
fi

print_success "Update process completed!"

# Show some useful post-update commands
echo ""
print_status "Useful commands:"
echo "  📊 Check status: pm2 status"
echo "  📄 View logs: pm2 logs $PM2_APP_NAME"
echo "  🔄 Restart app: pm2 restart $PM2_APP_NAME"
echo "  🛑 Stop app: pm2 stop $PM2_APP_NAME"
echo "  📈 Monitor: pm2 monit"
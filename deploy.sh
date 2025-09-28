#!/bin/bash

# DCFV BDC Tool - Simple PM2 Deployment Script
# Run this script on your Linux server

echo "🚀 DCFV BDC Dashboard Tool - PM2 Setup"
echo "==========================================="bash

# DCFV User Portal - Simple PM2 Deployment Script
# Run this script on your Linux server

echo "🚀 DCFV User Portal - PM2 Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    echo "   Visit: https://nodejs.org/ or use your package manager"
    echo "   Ubuntu/Debian: sudo apt install nodejs npm"
    echo "   CentOS/RHEL: sudo yum install nodejs npm"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js version: $(node --version)${NC}"
echo -e "${GREEN}✅ npm version: $(npm --version)${NC}"

# Note: This BDC Dashboard Tool is a portal hub - no database required
echo -e "${GREEN}✅ BDC Dashboard Tool - No database dependencies needed${NC}"

# Install dependencies
echo -e "${YELLOW}📦 Installing project dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2 globally...${NC}"
    sudo npm install -g pm2
    
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install PM2. Trying without sudo...${NC}"
        npm install -g pm2
        
        if [ $? -ne 0 ]; then
            echo -e "${RED}❌ Failed to install PM2. Please install it manually:${NC}"
            echo "   sudo npm install -g pm2"
            exit 1
        fi
    fi
else
    echo -e "${GREEN}✅ PM2 is already installed: $(pm2 --version)${NC}"
fi

# Create logs directory
echo -e "${YELLOW}📁 Creating logs directory...${NC}"
mkdir -p logs

# Clean up any existing PM2 processes
echo -e "${YELLOW}🛑 Cleaning up existing PM2 processes...${NC}"
pm2 stop dcfv-bdc-tool 2>/dev/null || echo "No running process found"
pm2 delete dcfv-bdc-tool 2>/dev/null || echo "No existing process to delete"

# Clean up any duplicate or orphaned processes
echo -e "${YELLOW}🧹 Removing any duplicate processes...${NC}"
pm2 list | grep -i dcfv-bdc-tool | awk '{print $2}' | xargs -r pm2 delete 2>/dev/null || true

# Start the application with PM2
echo -e "${YELLOW}🚀 Starting DCFV BDC Dashboard Tool with PM2...${NC}"
pm2 start ecosystem.config.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Application started successfully!${NC}"
    
    # Save PM2 configuration
    echo -e "${YELLOW}💾 Saving PM2 configuration...${NC}"
    pm2 save
    
    # Setup PM2 startup script (optional)
    echo -e "${YELLOW}🔄 Setting up PM2 startup script...${NC}"
    echo -e "${YELLOW}   (You may need to run the command that PM2 shows you)${NC}"
    pm2 startup
    
    echo -e "${GREEN}=========================================="
    echo -e "🎉 DCFV BDC Dashboard Tool is now running!"
    echo -e "=========================================="
    echo -e "📊 Dashboard URL: http://your-server-ip:3001"
    echo -e "🔗 Portal Hub: Access all DCFV BDC dashboards"
    echo -e "📝 PM2 Status: pm2 status"
    echo -e "📄 View Logs: pm2 logs dcfv-bdc-tool"
    echo -e "🔄 Restart: pm2 restart dcfv-bdc-tool"
    echo -e "🛑 Stop: pm2 stop dcfv-bdc-tool"
    echo -e "📈 Monitor: pm2 monit"
    echo -e "=========================================="
    
    # Show current PM2 status
    pm2 status
    
else
    echo -e "${RED}❌ Failed to start the application${NC}"
    echo -e "${YELLOW}Check the logs for more information:${NC}"
    echo -e "${YELLOW}  pm2 logs dcfv-bdc-tool${NC}"
    exit 1
fi
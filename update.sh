#!/bin/bash

# DCFV BDC Tool - Simple Update Script
# Handles: npm install, port conflicts, PM2 restart

echo "🔄 DCFV BDC Tool - Update & Deploy"
echo "=================================="

# Configuration
REPO_URL="https://github.com/falguni-patel/DCFV-BDC-tool.git"
APP_DIR="DCFV-BDC-tool"
PM2_APP_NAME="dcfv-bdc-tool"

# Step 1: Fix port conflicts (kill anything using port 5004)
echo "🔧 Fixing port conflicts..."
lsof -ti:5004 | xargs kill -9 2>/dev/null || true
pm2 stop $PM2_APP_NAME 2>/dev/null || true
pm2 delete $PM2_APP_NAME 2>/dev/null || true

# Step 2: Backup and update code
# Step 2: Backup and update code
echo "📦 Updating application..."
[ -d "$APP_DIR" ] && mv "$APP_DIR" "${APP_DIR}-old" 2>/dev/null
git clone $REPO_URL
cd "$APP_DIR"

# Step 3: Install dependencies
echo "📥 Installing dependencies..."
npm install

# Step 4: Fix file permissions for static assets (Linux)
echo "🔐 Setting proper file permissions..."
chmod -R 755 public/
chmod 644 public/styles/*.css 2>/dev/null || true
chmod 644 public/scripts/*.js 2>/dev/null || true

# Step 5: Start with PM2
echo "🚀 Starting with PM2..."
mkdir -p logs
pm2 start ecosystem.config.js
pm2 save

echo "✅ Update completed!"
echo "📊 Dashboard: http://$(hostname -I | awk '{print $1}'):5004"
echo "📝 Status: pm2 status"
echo "📄 Logs: pm2 logs $PM2_APP_NAME"
#!/bin/bash

# DCFV BDC Tool - Quick Update (One-liner)
# Usage: ./quick-update.sh

echo "🚀 Quick updating DCFV BDC Tool..."

# Stop PM2, backup old, clone new, install, restart
pm2 stop dcfv-bdc-tool 2>/dev/null
[ -d "DCFV-BDC-tool" ] && mv DCFV-BDC-tool DCFV-BDC-tool-backup-$(date +%Y%m%d-%H%M%S)
git clone https://github.com/falguni-patel/DCFV-BDC-tool.git
cd DCFV-BDC-tool
npm install
mkdir -p logs
pm2 delete dcfv-bdc-tool 2>/dev/null
pm2 start ecosystem.config.js
pm2 save

echo "✅ Update complete! Dashboard: http://$(hostname -I | awk '{print $1}'):5001"
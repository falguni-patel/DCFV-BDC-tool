#!/bin/bash

# DCFV BDC Tool - Port Cleanup Script
# This script helps resolve port conflicts before deployment

echo "🔧 DCFV BDC Tool - Port Cleanup"
echo "================================"

PORT=${1:-5001}  # Default to 5001, or use first argument

echo "🔍 Checking what's using port $PORT..."

# Check if lsof is available
if command -v lsof &> /dev/null; then
    PROCESS=$(lsof -ti:$PORT)
    if [ ! -z "$PROCESS" ]; then
        echo "📋 Process using port $PORT:"
        lsof -i:$PORT
        echo ""
        echo "🛑 Killing process(es) using port $PORT..."
        lsof -ti:$PORT | xargs kill -9
        echo "✅ Process(es) killed"
    else
        echo "✅ Port $PORT is free"
    fi
elif command -v netstat &> /dev/null; then
    # Fallback to netstat
    PROCESS=$(netstat -tlnp 2>/dev/null | grep ":$PORT ")
    if [ ! -z "$PROCESS" ]; then
        echo "📋 Process using port $PORT:"
        echo "$PROCESS"
        PID=$(echo "$PROCESS" | awk '{print $7}' | cut -d'/' -f1)
        if [ ! -z "$PID" ] && [ "$PID" != "-" ]; then
            echo "🛑 Killing process $PID..."
            kill -9 $PID
            echo "✅ Process killed"
        fi
    else
        echo "✅ Port $PORT is free"
    fi
elif command -v ss &> /dev/null; then
    # Another fallback to ss
    PROCESS=$(ss -tulpn | grep ":$PORT ")
    if [ ! -z "$PROCESS" ]; then
        echo "📋 Process using port $PORT:"
        echo "$PROCESS"
        echo "🛑 Please manually kill the process or use PM2:"
        echo "   pm2 stop dcfv-bdc-tool"
        echo "   pm2 delete dcfv-bdc-tool"
    else
        echo "✅ Port $PORT is free"
    fi
else
    echo "❌ Cannot detect port usage. Please manually check:"
    echo "   netstat -tulpn | grep :$PORT"
    echo "   Or try: pm2 stop dcfv-bdc-tool"
fi

# Also check for PM2 processes
echo ""
echo "🔍 Checking PM2 processes..."
if command -v pm2 &> /dev/null; then
    PM2_PROCESSES=$(pm2 list | grep dcfv-bdc-tool | wc -l)
    if [ $PM2_PROCESSES -gt 0 ]; then
        echo "📋 Found PM2 processes for dcfv-bdc-tool:"
        pm2 list | grep dcfv-bdc-tool
        echo ""
        echo "🛑 Stopping PM2 processes..."
        pm2 stop dcfv-bdc-tool
        pm2 delete dcfv-bdc-tool
        echo "✅ PM2 processes cleaned up"
    else
        echo "✅ No PM2 processes found for dcfv-bdc-tool"
    fi
else
    echo "ℹ️  PM2 not installed or not in PATH"
fi

echo ""
echo "🎯 Port $PORT should now be available for your application!"
echo "   You can now run: ./deploy.sh or ./update.sh"
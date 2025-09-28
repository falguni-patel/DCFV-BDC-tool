#!/bin/bash

# DCFV BDC Tool - CSS Debug Helper
# This script helps debug CSS loading issues on Linux

echo "🎨 DCFV BDC Tool - CSS Debug Helper"
echo "==================================="

APP_DIR="DCFV-BDC-tool"
CSS_FILE="$APP_DIR/public/styles/main.css"

# Check if we're in the right directory
if [ ! -d "$APP_DIR" ]; then
    echo "❌ DCFV-BDC-tool directory not found. Run this script from parent directory."
    echo "   Expected structure: ./DCFV-BDC-tool/public/styles/main.css"
    exit 1
fi

echo "📁 Checking file structure..."
echo "   App directory: $APP_DIR"
echo "   CSS file: $CSS_FILE"

# Check if CSS file exists
if [ -f "$CSS_FILE" ]; then
    echo "✅ CSS file exists"
    echo "   Size: $(du -h "$CSS_FILE" | cut -f1)"
    echo "   Permissions: $(ls -la "$CSS_FILE")"
else
    echo "❌ CSS file not found: $CSS_FILE"
    echo "   Creating basic CSS file..."
    
    # Create directories if they don't exist
    mkdir -p "$APP_DIR/public/styles"
    
    # Create basic CSS file
    cat > "$CSS_FILE" << 'EOF'
/* DCFV BDC Tool - Main CSS */
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    margin: 0;
}

.navbar {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.card {
    border: none;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.btn-primary {
    background: linear-gradient(45deg, #667eea, #764ba2);
    border: none;
    border-radius: 25px;
    padding: 10px 25px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: linear-gradient(45deg, #764ba2, #667eea);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.portal-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #667eea;
}

.container-fluid {
    padding: 2rem;
}

.main-content {
    padding: 3rem 0;
}

.text-muted {
    color: rgba(0, 0, 0, 0.6) !important;
}

.navbar-brand {
    font-weight: 700;
    color: #333 !important;
}

.footer {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    color: white;
    text-align: center;
    padding: 1rem;
    margin-top: 2rem;
}
EOF
    echo "✅ Basic CSS file created"
fi

# Check file permissions
echo ""
echo "🔐 Checking permissions..."
if [ -r "$CSS_FILE" ]; then
    echo "✅ CSS file is readable"
else
    echo "❌ CSS file is not readable, fixing permissions..."
    chmod 644 "$CSS_FILE"
fi

# Check if the server is running
echo ""
echo "🚀 Checking if server is running..."
if pgrep -f "node.*server.js" > /dev/null; then
    echo "✅ Node.js server is running"
    PID=$(pgrep -f "node.*server.js")
    echo "   PID: $PID"
else
    echo "❌ Node.js server is not running"
    echo "   Start with: pm2 start dcfv-bdc-tool"
fi

# Check if PM2 process exists
if command -v pm2 &> /dev/null; then
    echo ""
    echo "📊 PM2 Status:"
    pm2 list | grep dcfv-bdc-tool || echo "   No PM2 process found for dcfv-bdc-tool"
fi

# Test CSS file accessibility
echo ""
echo "🌐 Testing CSS file accessibility..."
if command -v curl &> /dev/null; then
    echo "   Testing: http://localhost:5004/styles/main.css"
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5004/styles/main.css)
    if [ "$RESPONSE" = "200" ]; then
        echo "✅ CSS file is accessible via HTTP"
    else
        echo "❌ CSS file returned HTTP $RESPONSE"
        echo "   Make sure the server is running on port 5004"
    fi
else
    echo "   curl not available, install with: sudo apt install curl"
fi

echo ""
echo "🎯 Debug complete! If CSS still not working:"
echo "   1. Restart the server: pm2 restart dcfv-bdc-tool"
echo "   2. Clear browser cache: Ctrl+Shift+R"
echo "   3. Check browser console for errors (F12)"
echo "   4. Check server logs: pm2 logs dcfv-bdc-tool"
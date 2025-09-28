const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 5004;

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

// Session configuration - Production optimized
const sessionConfig = {
  secret: process.env.SESSION_SECRET || 'dcfv-ba-operations-secret-' + Date.now(),
  resave: false,
  saveUninitialized: false,
  name: 'dcfv.sid', // Custom session name
  cookie: { 
    secure: process.env.NODE_ENV === 'production' ? false : false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
};

// Add session store warning suppression for development
if (process.env.NODE_ENV !== 'production') {
  console.log('⚠️  Using memory session store - suitable for development only');
} else {
  console.log('ℹ️  Production mode: Consider using a persistent session store (Redis/MongoDB)');
}

app.use(session(sessionConfig));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files with proper MIME types for Linux
app.use('/styles', express.static(path.join(__dirname, 'public', 'styles'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.set('Content-Type', 'text/css; charset=utf-8');
    }
  }
}));

app.use('/scripts', express.static(path.join(__dirname, 'public', 'scripts'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.set('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
}));

// General static files serving
app.use(express.static(path.join(__dirname, 'public')));

// Debug logging for static file requests
app.use((req, res, next) => {
  if (req.url.includes('/styles/') || req.url.includes('/scripts/')) {
    console.log(`📁 Static file request: ${req.method} ${req.url}`);
    console.log(`📂 Looking for file at: ${path.join(__dirname, 'public', req.url)}`);
  }
  next();
});

// Debug endpoint to list files
app.get('/debug/files', (req, res) => {
  const fs = require('fs');
  const publicDir = path.join(__dirname, 'public');
  const stylesDir = path.join(publicDir, 'styles');
  const scriptsDir = path.join(publicDir, 'scripts');
  
  const debug = {
    publicExists: fs.existsSync(publicDir),
    stylesExists: fs.existsSync(stylesDir),
    scriptsExists: fs.existsSync(scriptsDir),
    publicContents: fs.existsSync(publicDir) ? fs.readdirSync(publicDir) : [],
    stylesContents: fs.existsSync(stylesDir) ? fs.readdirSync(stylesDir) : [],
    scriptsContents: fs.existsSync(scriptsDir) ? fs.readdirSync(scriptsDir) : [],
    workingDirectory: __dirname
  };
  
  res.json(debug);
});

// Portal configuration
const portals = [
  {
    id: 'innovation',
    name: 'DCFV BDC Innovation Dashboard',
    description: 'Innovation tracking and analytics dashboard',
    shortUrl: 'http://goto/dcfv-bdc-innovation',
    directUrl: 'http://10.224.157.37:3000/view/DCFV_BDC_Innovation_Dashboard.html',
    icon: '🚀',
    category: 'Analytics'
  },
  {
    id: 'user-portal',
    name: 'DCFV User Portal',
    description: 'Main user portal for DCFV services',
    shortUrl: 'http://goto/dcfv-user-portal',
    directUrl: 'http://10.224.157.37:5003/signin',
    icon: '👥',
    category: 'Portal'
  },
  {
    id: 'esvbaops',
    name: 'DCFV BA Operations',
    description: 'Head count and BA operations summary',
    shortUrl: '/signin/ba-operations',
    directUrl: '/signin/ba-operations',
    icon: '📊',
    category: 'Operations'
  }
];

// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.authenticated) {
    next();
  } else {
    res.redirect('/signin/ba-operations');
  }
};

// Routes
app.get('/', (req, res) => {
  res.render('index', { 
    title: 'DCFV BDC Dashboard - Bangalore Site',
    portals: portals 
  });
});

// Signin page for BA Operations
app.get('/signin/ba-operations', (req, res) => {
  res.render('signin', {
    title: 'DCFV BA Operations - Sign In',
    error: null
  });
});

// Handle signin POST
app.post('/signin/ba-operations', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin@30') {
    req.session.authenticated = true;
    req.session.username = username;
    // Redirect directly to the head count summary API
    res.redirect('http://10.224.157.37:5002/api/v1/head_count_ba/hc_summary');
  } else {
    res.render('signin', {
      title: 'DCFV BA Operations - Sign In',
      error: 'Invalid username or password. Please try again.'
    });
  }
});

// BA Operations dashboard (protected)
app.get('/ba-operations', requireAuth, (req, res) => {
  res.render('ba-operations', {
    title: 'DCFV BA Operations Dashboard',
    username: req.session.username
  });
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

app.get('/portal/:id', (req, res) => {
  const portal = portals.find(p => p.id === req.params.id);
  if (!portal) {
    return res.status(404).render('error', { 
      title: 'Portal Not Found',
      message: 'The requested portal was not found.' 
    });
  }
  res.render('portal', { 
    title: `${portal.name} - DCFV BDC`,
    portal: portal 
  });
});

app.get('/api/portals', (req, res) => {
  res.json(portals);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime() 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render('error', {
    title: 'Page Not Found',
    message: 'The requested page was not found.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title: 'Server Error',
    message: 'An internal server error occurred.'
  });
});

// Start server with error handling
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
  console.log(`🚀 DCFV BDC Dashboard running on http://localhost:${PORT}`);
  console.log(`📍 Bangalore Site Portal Hub`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please:`);
    console.error(`   1. Kill the process using: sudo fuser -k ${PORT}/tcp`);
    console.error(`   2. Or use a different port: PORT=5005 npm start`);
    console.error(`   3. Or stop PM2 process: pm2 stop dcfv-bdc-tool`);
    process.exit(1);
  } else {
    console.error('❌ Server error:', err);
    process.exit(1);
  }
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

module.exports = app;
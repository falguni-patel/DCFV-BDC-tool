const express = require('express');
const path = require('path');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3001;

// Session configuration
app.use(session({
  secret: 'dcfv-ba-operations-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

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

app.listen(PORT, () => {
  console.log(`🚀 DCFV BDC Dashboard running on http://localhost:${PORT}`);
  console.log(`📍 Bangalore Site Portal Hub`);
  console.log(`⏰ Started at: ${new Date().toLocaleString()}`);
});

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path'); // For working with file paths

// routers 

const registerRoutes = require('./routes/register'); // Import the register router
const loginRoutes = require('./routes/login'); // Import the login router
const resetRoutes = require('./routes/reset'); // Import the reset router
const logoutRoutes = require('./routes/logout'); // Import the logout router
const retrive_TRoutes= require('./routes/retrive-transactions'); // Import the logout router
const update_TRoutes= require('./routes/update-transactions'); // Import the logout router
const update_BRoutes= require('./routes/insert-budget'); // Import the logout router
const retrive_BRoutes= require('./routes/retrive-bubgets'); // Import the logout router
const del_BRoutes= require('./routes/delete-budget'); // Import the logout router
const del_TRoutes= require('./routes/delete-transaction'); // Import the logout router
const imp_TRoutes= require('./routes/import-transactions'); // Import the logout router
const clear_ARoutes= require('./routes/clearAll'); // Import the logout router
const change_PRoutes= require('./routes/Change-Passward'); // Import the logout router
const profile_Routes= require('./routes/profie'); // Import the logout router




const app = express();


// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public folder


const sessionOptions = {
  secret: 'your-secret-key', // Replace with a secure secret
  resave: false,
  saveUninitialized: false,
};
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1); // Trust proxy when behind a load balancer
  sessionOptions.cookie = { secure: true }; // Use secure cookies in production
}
app.use(session(sessionOptions));


// Middleware to prevent caching to prevent dack to dashboard after logout 
function noCache(req, res, next) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
}


// Middleware to check if a user is authenticated for protected routes
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // Proceed to the requested route if user not authenticated
  }
  res.redirect('/');
}
// Middleware to check if a user is authenticated  and than user , redirect to the dashboards
function redirectIfAuthenticated(req, res, next) {
  if (req.session.user) {
    //  authenticated user is , redirect to the dashboard
    return res.redirect('/dashboard');                         
  }
  next(); 
}


// Use the auth router for authentication-related routes
app.use(registerRoutes);
app.use(loginRoutes);
app.use(logoutRoutes);
app.use(resetRoutes);
app.use(update_TRoutes);
app.use(retrive_TRoutes);
app.use(update_BRoutes);
app.use(retrive_BRoutes);
app.use(del_BRoutes);
app.use(del_TRoutes);
app.use(imp_TRoutes);
app.use(clear_ARoutes);
app.use(change_PRoutes);
app.use(profile_Routes);


const directoryPath = path.join(__dirname, 'public/html');
const homeroutes = ['dashboard', 'reports', 'settings']; // Define allowed sub-routes

// app.use('/html', fileRouter); // if needed

// Resolve the full directory path for index.html as landing page
app.get('/', redirectIfAuthenticated , (req, res) => {
  const filePath = path.join(directoryPath, 'index.html');
  res.sendFile(filePath); 
});


const routes = ['login', 'register','reset']; // Define allowed routes

routes.forEach((routeName) => {
  app.get(`/${routeName}`, redirectIfAuthenticated, (req, res) => {
    const filePath = path.join(directoryPath, `${routeName}.html`); // Construct the file path dynamically
    res.sendFile(filePath); // Serve the respective file
  });
});


// Resolve the full directory path for index.html as landing page
app.get('/:page', isAuthenticated, noCache , (req, res) => {
  const { page } = req.params; // Extract the route parameter

  if (homeroutes.includes(page)) {  // homeroutes define at first
    const filePath = path.join(directoryPath, `${page}.html`); // Construct the file path dynamically
    res.sendFile(filePath); // Serve home.html
   }  else {
    // Serve 404.html for invalid routes
    const errorFilePath = path.join(directoryPath, '404.html');
    res.status(404).sendFile(errorFilePath);
  }
});


app.get('/api/user/id/from/cookies', (req, res) => {
  if (req.session.user.id) {
    res.json({ userId: req.session.user.id });
  } else {
    res.status(401).json({ message: 'User not logged in' });
  }
});


// Catch-all middleware for unmatched routes and send 404.html file 
app.use( (req, res) => {
  const directoryPath = path.join(__dirname, 'public', 'html');
  const errorFilePath = path.join(directoryPath, '404.html');
    res.status(404).sendFile(errorFilePath, (err) => {
        if (err) {
            res.status(500).send('An error occurred while loading the 404 page.');
        }
    });
})


// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

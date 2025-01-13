const express = require('express');
const path = require('path');
const app = express();
const router = express.Router();


// // router.use(express.static('public'));  // Serve static files from the public folder
function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/');
  }

// Route to serve HTML page based on name in URL

router.get('/api/djfFGdgtdDth/%20ffD/%20/:page', isAuthenticated ,(req, res) => {
  const fileName = req.params.page;

  // Resolve the full directory path
  const directoryPath = path.join('C:\\Users\\Admin\\Desktop\\main project\\public\\html');

  // Construct the file path
  const filePath = path.join( directoryPath, `${fileName}.html`);

  // Send the requested file
  res.sendFile(filePath, (err) => {
    if (err) {
      // Log the error for debugging
    console.error('Error sending file:', err);

    // Send a plain-text response with a 404 status
    res.status(404).send('File not found.');
      
    }
  });
});

// Export the router
module.exports = router;






// const fs = require('fs');
// const path = require('path');
// const express = require('express');
// const router = express.Router();

// function isAuthenticated(req, res, next) {
//     if (req.session.user) {
//       return next();
//     }
//     res.redirect('/');
//   }
// // Route to serve file data based on name in URL
// router.get('/home/:page', isAuthenticated, (req, res) => {
//   const fileName = req.params.page;

//   // Resolve the full directory path
//   const directoryPath = path.join('C:\\Users\\Admin\\Desktop\\main project\\public\\html');

//   // Construct the file path
//   const filePath = path.join(directoryPath, `${fileName}.html`);

//   // Read the requested file
//   fs.readFile(filePath, 'utf8', (err, data) => {
//     if (err) {
//       // Handle file not found or other errors
//       const errorFilePath = path.join(directoryPath, '404.html');
//       fs.readFile(errorFilePath, 'utf8', (error, errorData) => {
//         if (error) {
//           return res.status(404).send('404 page not found and error file is also missing');
//         }
//         res.status(404).send(errorData);
//       });
//     } else {
//       // Send the file content as the response
//       res.status(200).send(data);
//     }
//   });
// });

// // Export the router
// module.exports = router;

// const express = require('express');
// const path = require('path');
// const app = express();
// const router = express.Router();


// router.use(express.static('public'));  // Serve static files from the public folder


// // Route to serve HTML page based on name in URL
// router.get('/:name',(req, res) => {
//   const fileName = req.params.name;

//   // Resolve the full directory path
//   const directoryPath = path.join('C:\\Users\\Admin\\Desktop\\main project\\public\\html');

//   // Construct the file path
//   // const filePath = path.join(directoryPath, fileName);
//   const filePath = path.join( directoryPath, `${fileName}.html`);

//   // Send the requested file
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       // Path to the 404.html file
//       const errorFilePath = path.join(directoryPath, '404.html');
//       res.status(404).sendFile(errorFilePath);
//     }
//   });
// });

// // Export the router
// module.exports = router;



// router.get('/:file', (req, res) => {
//   const fileName = req.params.file;

//   // Resolve the full directory path
//   const directoryPath = path.join('C:\\Users\\Admin\\Desktop\\main project\\public\\html');

//   // Construct the file path
//   const filePath = path.join(directoryPath, fileName);

//   // Send the requested file
//   res.sendFile(filePath, (err) => {
//     if (err) {
//       // Path to the 404.html file
//       const errorFilePath = path.join(directoryPath, '404.html');
//       res.status(404).sendFile(errorFilePath);
//     }
//   });
// });

// // Export the router
// module.exports = router;
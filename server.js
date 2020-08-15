const express = require('express');
const path = require('path')
const cookieParser = require('cookie-parser')
const staticFilesPath = path.resolve(__dirname, 'build')

const app = express();
app.use(cookieParser())
app.use(express.static(staticFilesPath))

app.listen(8000, () => {
  console.log('server started on port 8000')
})
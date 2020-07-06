const express = require('express');
const path = require('path')
const staticFilesPath = path.resolve(__dirname, 'build')
const app = express();
app.use(express.static(staticFilesPath))
app.get('/', (_, resp, err) => {
  if(err) {
    resp.status(500);
  }
  else
    resp.sendFile(path.resolve(staticFilesPath, 'index.html'))
})

app.listen(8000, () => {
    console.log('server started on port 8000')
})
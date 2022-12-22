const { app } = require('./app');
// const port = 3000;
const port = process.env['PORT'] ?? 3000;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

var path = require('path');

module.exports = (app) => {
  app.get('/meetingUrl', (req, res) => {
  });

  app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '../index.html'));
  });

  app.post('/subscriber', function(req, res) {
  });
};

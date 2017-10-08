'use strict';

module.exports = function(server) {
  // Install a `/server` route that returns server status
  var router = server.loopback.Router();
  router.get('/server', server.loopback.status());
  server.use(router);
};

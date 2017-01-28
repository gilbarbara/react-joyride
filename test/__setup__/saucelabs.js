/*eslint-disable no-console, prefer-arrow-callback, prefer-template */
const https = require('https');

module.exports = function sauce(client, callback) {
  const currentTest = client.currentTest;
  const username = client.options.username;
  const sessionId = client.capabilities['webdriver.remote.sessionid'];
  const accessKey = client.options.accessKey;

  if (!client.launch_url.match(/saucelabs/)) {
    console.log('Not saucelabs ...');
    callback();
    return;
  }

  if (!username || !accessKey || !sessionId) {
    console.log('No username, accessKey or sessionId');
    callback();
    return;
  }

  const passed = currentTest.results.passed === currentTest.results.tests;

  const data = JSON.stringify({
    passed,
  });

  const requestPath = `/rest/v1/${username}/jobs/${sessionId}`;

  function responseCallback(res) {
    res.setEncoding('utf8');
    // console.log('Response: ', res.statusCode, JSON.stringify(res.headers));
    /* res.on('data', function onData(chunk) {
      console.log('BODY: ' + chunk);
    });*/
    res.on('end', function onEnd() {
      console.info('Finished updating saucelabs');
      callback();
    });
  }

  try {
    console.log('Updating saucelabs', requestPath);

    const req = https.request({
      hostname: 'saucelabs.com',
      path: requestPath,
      method: 'PUT',
      auth: `${username}:${accessKey}`,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    }, responseCallback);

    req.on('error', function onError(e) {
      console.log('problem with request: ' + e.message);
    });
    req.write(data);
    req.end();
  }
  catch (error) {
    console.log('Error', error);
    callback();
  }
};

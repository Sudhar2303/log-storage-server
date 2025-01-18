const loadtest = require('loadtest');

const args = process.argv.slice(2);
const maxRequest = parseInt(args[0], 10) || 1000; 
const requestData = JSON.stringify({
  event_name: "login",
});

const options = {
  url: 'http://localhost:3500/api/v1/log', 
  maxRequests: maxRequest,             
  concurrency: 100,              
  method: 'POST',                
  body: requestData,            
  contentType: 'application/json', 
  statusCallback: function (error, result) {
    if (error) {
      console.error('Error occurred: ', error);
    } else {
      console.log('Test result:', result);
    }
  },
};

loadtest.loadTest(options, function (error, result) {
  if (error) {
    console.error('Error during load test:', error);
  } else {
    console.log('Load test completed successfully');
    console.log(result);
  }
});

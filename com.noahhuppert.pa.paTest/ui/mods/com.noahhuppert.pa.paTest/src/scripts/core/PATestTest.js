/* Setup "namespace" */
PATest.core.test = {};

PATest.core.test.test = function(testName, initiator, returner, flags){
  /*
  testName - Display Name of test in UI
  initiator - function to start the test
  returner - function to determine results of test and return pass or fail
  flags[optional]
    timeout - defaults to 20000 ms, time after which test automatically fails
    pollRate - defaults to 100ms, interval at which test checks for completion
  */

  var self = this;

  self.id = Date.now();
  self.name = testName;
  self.timeout = !!flags && !!flags.timeout ? flags.timeout : 20000;
  self.pollRate = !!flags && !!flags.pollRate ? flags.pollRate : 100;
  self.initiator = initiator;
  self.returner = returner;
};

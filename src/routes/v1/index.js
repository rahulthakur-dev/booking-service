const router = require('express').Router();
const { TestController } = require('../../controllers');
const { TestService } = require('../../services');

const testService = new TestService();
const testController = new TestController(testService);

router.post('/test', testController.test)

module.exports = router;
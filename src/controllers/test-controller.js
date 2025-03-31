const { StatusCodes } = require('http-status-codes');

class TestController {
    constructor(testService) {
        this.testService = testService;
    }

    test = (req, res) =>  {
        this.testService.test(req.body);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            success: true,
            message: 'API version 1.0.0',
            error: {},
            data: {}
        });
    }
}

module.exports = TestController;

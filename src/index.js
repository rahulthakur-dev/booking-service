const express = require('express');
const { ServerConfig, logger } = require('./config');
const apiRouter = require('./routes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);

app.listen(ServerConfig.PORT, () => {
    logger.info(`Server is running on http://localhost:${ServerConfig.PORT}`);
});
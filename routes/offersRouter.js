const express = require('express');
const offersRouter = express.Router();

offersRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end('Will send all the offers to you');
})
.post((req, res) => {
    res.end(`Will add the offer: ${req.body.name} with description: ${req.body.description}`);
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /offers');
})
.delete((req, res) => {
    res.end('Deleting all offers');
});

offersRouter.route('/:offersId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req, res) => {
    res.end(`Will send details of the offer: ${req.params.offersId} to you`);
})
.post((req, res) => {
    res.statusCode = 403;
    res.end(`POST operation not supported on /offers/${req.params.offersId}`);
})
.put((req, res) => {
    res.write(`Updating the offer: ${req.params.offersId}\n`);
    res.end(`Will update the offer: ${req.body.name}
        with description: ${req.body.description}`);
})
.delete((req, res) => {
    res.end(`Deleting offer: ${req.params.offersId}`);
});

module.exports = offersRouter;
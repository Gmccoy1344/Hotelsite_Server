const express = require('express');
const roomsRouter = express.Router();
const Rooms = require('../models/room');

// https://localhost:3000/rooms Route
roomsRouter.route('/')
.get((req, res, next) => {
    Rooms.find()
    .then(rooms => {
        res.sendStatus = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rooms);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Rooms.create(req.body)
    .then(room => {
        console.log('Room created ', room);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(room);
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /rooms');
})
.delete((req, res, next) => {
    Rooms.deleteMany()
    .then(response => {
        res.sendStatus = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// https://localhost:3000/rooms/roomsId Route
roomsRouter.route('/:roomsId')
.get((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(rooms => {
        res.sendStatus = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rooms);
    })
    .catch(err => next(err));
})
.post((req, res) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /rooms');
})
.put((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room) {
            if(req.body.name) {
                room.name = req.body.name;
            }
            if(req.body.description) {
                room.description = req.body.description;
            }
            if(req.body.guestsDescription) {
                room.guestsDescription = req.body.guestsDescription;
            }
            if(req.body.suiteDescription) {
                room.suiteDescription = req.body.suiteDescription;
            }
            if(req.body.accessibleDescription) {
                room.accessibleDescription = req.body.accessibleDescription;
            }
            room.save()
            .then(room => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err = next(err));
        }else {
            err = new Error(`Room ${req.params.roomsId} not found`);
            err.status = 404;
            return next(err);
        }
    })
})
.delete((req, res, next) => {
    Rooms.findByIdAndDelete(req.params.roomsId)
    .then(response => {
        res.sendStatus = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(response);
    })
    .catch(err => next(err));
});

// https://localhost:3000/rooms/:/roomsId/guests Route
roomsRouter.route('/:roomsId/guests')
.get((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(rooms => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rooms.guests);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room) {
            room.guests.push(req.body);
            room.save()
            .then( room => {
                console.log('Room created ', room);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else {
            err = new Error(`Room ${req.params.roomsId} could not be found`);
            err.status = 400;
            return next(err);
        }
        
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /rooms/${req.params.roomsId}/guests`);
})
.delete((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room) {
            for (let i = (room.guests.length-1); i >= 0; i--) {
                room.guests.id(room.guests[i]._id).remove();
            }
            room.save()
            .then(room => {
                console.log('Guest rooms deleted.');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else {
            err = new Error(`Guest Room ${req.params.campsiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

// https://localhost:3000/rooms/:/roomsId/guests:/guestsId Route
roomsRouter.route('/:roomsId/guests/:guestsId')
.get((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room && room.guests.id(req.params.guestsId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(room.guests.id(req.params.guestsId));
        } else if (!room) {
            err = new Error(`Room ${req.params.roomsId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Guest Room ${req.params.guestsId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`Post operation not supported on /rooms/${req.params.roomsId}/guests/${req.params.guestsId}`);
})
.put((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room && room.guests.id(req.params.guestsId)) {
            if(req.body.name) {
                room.guests.id(req.params.guestsId).name = req.body.name;
            }
            if(req.body.description) {
                room.guests.id(req.params.guestsId).description = req.body.description;
            }
            if(req.body.cost) {
                room.guests.id(req.params.guestsId).cost = req.body.cost;
            }
            room.save()
            .then(room => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err = next(err));

        }else if(!room) {
            err = new Error(`Room ${req.params.roomsId} not found`);
            err.status = 404;
            return next(err);
        }else {
            err = new Error(`Guest Room ${req.params.guestsId} not found`);
            err.status = 404;
            return next(err);
        }
        
    })
})
.delete((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room && room.guests.id(req.params.guestsId)) {
            room.guests.id(req.params.guestsId).remove();
            room.save()
            .then(room => {
                console.log('Guest room deleted.');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else if(!room){
            err = new Error(`Guest Room ${req.params.roomsId} not found`);
            err.status = 404;
            return next(err);
        }else {
            err = new Error(`Guest Room ${req.params.guestsId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

// https://localhost:3000/rooms/:/roomsId/suite Route
roomsRouter.route('/:roomsId/suite')
.get((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(rooms => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rooms.suite);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room) {
            room.suite.push(req.body);
            room.save()
            .then( room => {
                console.log('Room created ', room);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else {
            err = new Error(`Room ${req.params.roomsId} could not be found`);
            err.status = 400;
            return next(err);
        }
        
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /rooms/${req.params.roomsId}/suits`);
})
.delete((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room) {
            for (let i = (room.suite.length-1); i >= 0; i--) {
                room.suite.id(room.suite[i]._id).remove();
            }
            room.save()
            .then(room => {
                console.log('Suites deleted.');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else {
            err = new Error(`Suite ${req.params.roomsId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

// https://localhost:3000/rooms/:/roomsId/suite:/suiteId Route
roomsRouter.route('/:roomsId/suite/:suiteId')
.get((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room && room.suite.id(req.params.suiteId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(rooms.suite.id(req.params.suiteId));
        } else if (!room) {
            err = new Error(`Room ${req.params.roomId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Suite ${req.params.suiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`Post operation not supported on /rooms/${req.params.roomId}/suite/${req.params.suiteId}`);
})
.put((req, res, next) => {
    Rooms.findById(req.params.roomId)
    .then(room => {
        if(room && room.suite.id(req.params.suiteId)) {
            if(req.body.name) {
                room.suite.id(req.params.suiteId).name = req.body.name;
            }
            if(req.body.description) {
                room.suite.id(req.params.suiteId).description = req.body.description;
            }
            if(req.body.cost) {
                room.suite.id(req.params.suiteId).cost = req.body.cost;
            }
            room.save()
            .then(room => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err = next(err));

        }else if(!room) {
            err = new Error(`Room ${req.params.roomId} not found`);
            err.status = 404;
            return next(err);
        }else {
            err = new Error(`Suite ${req.params.suiteId} not found`);
            err.status = 404;
            return next(err);
        }
        
    })
})
.delete((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room && room.suite.id(req.params.suiteId)) {
            room.suite.id(req.params.suiteId).remove();
            room.save()
            .then(room => {
                console.log('Suite deleted.');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else if(!room){
            err = new Error(`Room ${req.params.roomId} not found`);
            err.status = 404;
            return next(err);
        }else {
            err = new Error(`Suite ${req.params.suiteId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

// https://localhost:3000/rooms/:/roomsId/accessible Route
roomsRouter.route('/:roomsId/accessible')
.get((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(rooms => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(rooms.accessible);
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room) {
            room.accessible.push(req.body);
            room.save()
            .then( room => {
                console.log('Room created ', room);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else {
            err = new Error(`Room ${req.params.roomsId} could not be found`);
            err.status = 400;
            return next(err);
        }
        
    })
    .catch(err => next(err));
})
.put((req, res) => {
    res.statusCode = 403;
    res.end(`PUT operation not supported on /rooms/${req.params.roomsId}/guests`);
})
.delete((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room) {
            for (let i = (room.accessible.length-1); i >= 0; i--) {
                room.accessible.id(room.accessible[i]._id).remove();
            }
            room.save()
            .then(room => {
                console.log('Accessible rooms deleted.');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else {
            err = new Error(`Guest Room ${req.params.roomId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

// https://localhost:3000/rooms/:/roomsId/accessible:/accessibleId Route
roomsRouter.route('/:roomsId/accessible/:accessibleId')
.get((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room && room.accessible.id(req.params.accessibleId)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(rooms.accessible.id(req.params.accessibleId));
        } else if (!room) {
            err = new Error(`Room ${req.params.roomId} not found`);
            err.status = 404;
            return next(err);
        } else {
            err = new Error(`Accessible Room ${req.params.accessibleId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end(`Post operation not supported on /rooms/${req.params.roomId}/accessible/${req.params.accessibleId}`);
})
.put((req, res, next) => {
    Rooms.findById(req.params.roomId)
    .then(room => {
        if(room && room.accessible.id(req.params.accessibleId)) {
            if(req.body.name) {
                room.accessible.id(req.params.accessibleId).name = req.body.name;
            }
            if(req.body.description) {
                room.accessible.id(req.params.accessibleId).description = req.body.description;
            }
            if(req.body.cost) {
                room.accessible.id(req.params.accessibleId).cost = req.body.cost;
            }
            room.save()
            .then(room => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err = next(err));

        }else if(!room) {
            err = new Error(`Room ${req.params.roomId} not found`);
            err.status = 404;
            return next(err);
        }else {
            err = new Error(`Accessible Room ${req.params.accessibleId} not found`);
            err.status = 404;
            return next(err);
        }
        
    })
})
.delete((req, res, next) => {
    Rooms.findById(req.params.roomsId)
    .then(room => {
        if(room && room.accessible.id(req.params.accessibleId)) {
            room.accessible.id(req.params.accessibleId).remove();
            room.save()
            .then(room => {
                console.log('Accessible Room deleted.');
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(room);
            })
            .catch(err => next(err));
        }else if(!room){
            err = new Error(`Room ${req.params.roomId} not found`);
            err.status = 404;
            return next(err);
        }else {
            err = new Error(`Accessible Room ${req.params.accessibleId} not found`);
            err.status = 404;
            return next(err);
        }
    })
    .catch(err => next(err));
});

module.exports = roomsRouter;
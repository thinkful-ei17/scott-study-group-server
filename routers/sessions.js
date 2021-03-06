'use strict';

const express = require('express');
const router = express.Router();
const {Session} = require('../models/models');


router.get('/', (req, res) => {
  
  Session
    .find()
    .then(sessions => {
      res.json({
        sessions: sessions.map(
          (session) => session.serialize())
      });
    })
    .catch(err =>{
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});


router.get('/:id', (req, res)=>{
  
  Session
    .findById(req.params.id)
    .then(session => res.json(session.serialize()))
    .catch(err =>{
      console.error(err);
      res.status(500).json({message: 'Internal server error'});
    });
});

router.post('/', (req, res) => {
  console.log('post req.body:', req.body);
  const requiredFields = ['startTime', 'endTime', 'location'];
  
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Session
    .create({
      title: req.body.title,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      location: req.body.location,
      description: req.body.description,
      notes:[...req.body.notes],
      attendees: [...req.body.attendees]
    })
    .then(session => res.status(201).json(session.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.put('/:id', (req, res)=>{
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['title','startTime', 'endTime', 'location','description','notes', 'attendees'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Session
  // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, { $set: toUpdate }, {new: true})
    .then(session => res.json(session.serialize()))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', (req, res) => {
  Session
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(200).json({mesage: 'Item was deleted'}))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});




module.exports = router;





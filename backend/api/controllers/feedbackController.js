'use strict';

const {auth} = require('./authController');
const roles = require('../../src/roles');

const mongoose = require('mongoose');
const Feedback = mongoose.model('feedback');


/**
* @description returns all feedback currently inside the database
* @param {request} req is the request received
* @param {res} res is the response object for making responses
*/
exports.listFeedback = function(req, res) {
  auth(req, roles.ADMIN).then((userId)=>{
    Feedback.find({}, function(err, feedback) {
      if (err) {
        res.send(err);
      } else {
        res.json(feedback);
      }
    });
  }).catch((err)=>res.status(401).send(String(err))); ;
};

/**
* @description creates and saves a new feedback entry
* @param {request} req is the request received
* @param {res} res is the response object for making responses
*/
exports.createFeedback = function(req, res) {
  const newFeedback = new Feedback(req.body);
  newFeedback.save(function(err, feedback) {
    if (err) {
      res.send(err);
    } else {
      res.json(feedback);
    }
  });
};

/**
* @description allows the reading of an individual feedback entry
* @param {request} req is the request received
* @param {res} res is the response object for making responses
*/
exports.readFeedback = function(req, res) {
  auth(req, roles.ADMIN).then((userId)=>{
    Feedback.findById(req.params.id, function(err, feedback) {
      if (err) {
        res.send(err);
      } else {
        res.json(feedback);
      }
    });
  }).catch((err)=>res.status(401).send(String(err)));
};

/**
* @description reads all feedback entries correlated
*         with a specific entranceId
* @param {request} req is the request received
* @param {res} res is the response object for making responses
*/
exports.readFeedbackByEntranceId = function(req, res) {
  auth(req, roles.ADMIN).then((userId)=>{
    Feedback.find({entranceId: req.params.entranceId}, function(err, feedback) {
      if (err) {
        res.send(err);
      } else {
        res.json(feedback);
      }
    });
  }).catch((err)=>res.status(401).send(String(err)));
};

/**
* @description reads all feedback entries of a specific type
* @param {request} req is the request received
* @param {res} res is the response object for making responses
*/
exports.readFeedbackByType = function(req, res) {
  auth(req, roles.ADMIN).then((userId)=>{
    Feedback.find({type: req.params.type}, function(err, feedback) {
      if (err) {
        res.send(err);
      } else {
        res.json(feedback);
      }
    });
  }).catch((err)=>res.status(401).send(String(err)));
};

/**
* @description update a specific feedback entry
* @param {request} req is the request received
* @param {res} res is the response object for making responses
*/
exports.updateFeedback = function(req, res) {
  auth(req, roles.ADMIN).then((userId)=> {
    Feedback.findOneAndUpdate(
        {_id: req.params.id}, req.body, {new: true},
        function(err, feedback) {
          if (err) {
            res.send(err);
          } else {
            res.json(feedback);
          }
        });
  }).catch((err)=>res.status(401).send(String(err)));
};

/**
* @description deletes a specific feedback entry
* @param {request} req is the request received
* @param {res} res is the response object for making responses
*/
exports.deleteFeedback = function(req, res) {
  auth(req, roles.ADMIN).then((userId)=> {
    Feedback.deleteOne({_id: req.params.id}, function(err, task) {
      if (err) {
        res.send(err);
      } else {
        res.json({message: 'Feedback successfully deleted'});
      }
    });
  }).catch((err)=>res.status(401).send(String(err)));
};

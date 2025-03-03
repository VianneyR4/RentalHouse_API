var models = require('../models');
var asyncLib = require('async');

module.exports = {
  updateRole: function (req, res) {
    // if (!req.isAuthenticated()) {
    //   return res.status(401).json({ error: 'User not authenticated' });
    // }
  
    // console.log("===", req.user);
    // const userId = req.user.id;

    // // const propertyId = parseInt(req.params.propertyId);

    // if (propertyId <= 0) {
    //   return res.status(400).json({ 'error': 'invalid parameters' });
    // }
  
    // asyncLib.waterfall(
    //   [
    //     function(done) {
    //       models.User.findOne({
    //         attributes: ['id', 'bio'],
    //         where: { id: userId }
    //       }).then(function (user) {
    //         done(null, userFound);
    //       })
    //       .catch(function(err) {
    //         return res.status(500).json({ 'error': 'unable to verify user' });
    //       });
    //     },
    //     function(userFound, done) {
    //       if(userFound) {
    //         userFound.update({
    //           bio: (bio ? bio : userFound.bio)
    //         }).then(function() {
    //           done(userFound);
    //         }).catch(function(err) {
    //           res.status(500).json({ 'error': 'cannot update user' });
    //         });
    //       } else {
    //         res.status(404).json({ 'error': 'user not found' });
    //       }
    //     },
    //   ],
    //   function(userFound) {
    //     if (userFound) {
    //       return res.status(201).json(userFound);
    //     } else {
    //       return res.status(500).json({ 'error': 'cannot update user profile' });
    //     }
    //   }
    // );
  },

  changeRole: function (req, res) {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.params.userId;
    const newRole = req.body.role;

    if (!newRole || !['hoster', 'renter'].includes(newRole)) {
        return res.status(400).json({ error: 'Invalid role provided' });
    }

    models.User.findOne({
        where: { id: userId }
    })
    .then(userFound => {
      console.log("Userfound: ", userFound.User);
        if (userFound) {
            return userFound.update({ role: newRole });
        } else {
            return res.status(404).json({ error: 'User not found' });
        }
    })
    .then(updatedUser => {
        return res.status(200).json(updatedUser);
    })
    .catch(err => {
      console.log("Userfound: ", err);
        return res.status(500).json({ error: 'Unable to update user role', details: err });
    });
  }
};
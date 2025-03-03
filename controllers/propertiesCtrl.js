var models = require('../models');
var asyncLib = require('async');

module.exports = {
  createProperty: function (req, res) {
    console.log("=====User isAuthenticated: ", req.isAuthenticated());

    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'User not authenticated' });
    } else if (req.user.role === "renter") {
        return res.status(401).json({ error: 'You mast be a Hoster to create a property!' });
    }

    // Params
    const {
      title,
      description,
      beds,
      baths,
      size,
      pricePerNight,
      location,
      images,
      purpose,
      type,
    } = req.body;

    // Validate required fields
    if (
      title == null ||
      description == null ||
      beds == null ||
      baths == null ||
      size == null ||
      pricePerNight == null ||
      location == null ||
      purpose == null ||
      type == null
    ) {
      return res.status(400).json({ error: 'missing parameters' });
    }

    // Use async.waterfall to handle asynchronous operations
    asyncLib.waterfall(
      [
        function (done) {
          // Find the user in the database
          models.User.findOne({
            where: { id: req.user.id }, // Use the user ID from the session
          })
            .then(function (userFound) {
              done(null, userFound);
            })
            .catch(function (err) {
              return res.status(500).json({ error: 'unable to verify user' });
            });
        },
        function (userFound, done) {
          if (userFound) {
            // Create the property and associate it with the user
            models.Property.create({
              title,
              description,
              beds,
              baths,
              size,
              pricePerNight,
              location,
              images,
              purpose,
              type,
              hostId: userFound.id, // Associate property with the host (user)
            })
              .then(function (newProperty) {
                done(null, newProperty);
              })
              .catch(function (err) {

                console.log("=====User not found: ", err);
                return res.status(500).json({ error: `unable to create property ${err}` });
              });
          } else {
            res.status(404).json({ error: 'user not found' });
          }
        },
      ],
      function (err, newProperty) {
        if (err) {
          return res.status(500).json({ error: 'internal server error' });
        }
        if (newProperty) {
          return res.status(201).json(newProperty);
        } else {
          return res.status(500).json({ error: 'cannot create property' });
        }
      }
    );
  },
  getAllProperties: function (req, res){
    asyncLib.waterfall(
        [
            function (done) {
                models.Property.findAll()
                    .then(function (properties){
                        done(null, properties)
                    })
                    .catch(function (err){
                        return res.status(500).json({ error: `Unable to get properties: ${err}` });
                    })
            }   
        ],
        function (err, properties) {
            if (err) {
                return res.status(500).json({ error: "internal server error" });
            }
            
            if (properties) {
                return res.status(200).json(properties);
            }else {
                return res.status(500).json({ error: 'cannot get properties' });
            }
        }
    );
  },
  getPropertiesByHoster: function (req, res) {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
  
    console.log("===", req.user);
    if (req.user.role !== "hoster") {
      return res.status(401).json({ error: 'You must be a Hoster to view your properties!' });
    }
  
    const userId = req.user.id;
  
    asyncLib.waterfall(
      [
        function (done) {
          models.Property.findAll({
            where: { hostId: userId }
          })
            .then(function (properties) {
              done(null, properties);
            })
            .catch(function (err) {
              return res.status(500).json({ error: `Unable to get properties: ${err}` });
            });
        }
      ],
      function (err, properties) {
        if (err) {
          return res.status(500).json({ error: "Internal server error" });
        }
  
        if (properties) {
          return res.status(200).json(properties);
        } else {
          return res.status(404).json({ error: 'No properties found for this hoster' });
        }
      }
    );
  },
  updateProperty: function (req, res) {
    const propertyId = req.params.propertyId;

    const {
        title,
        description,
        beds,
        baths,
        size,
        pricePerNight,
        location,
        images,
        purpose,
        type,
    } = req.body;

    if (
        title == null ||
        description == null ||
        beds == null ||
        baths == null ||
        size == null ||
        pricePerNight == null ||
        location == null ||
        purpose == null ||
        type == null
    ) {
        return res.status(400).json({ error: 'missing parameters' });
    }

    models.Property.findOne({
        where: { id: propertyId }
    })
    .then(propertyFound => {
        if (propertyFound) {
            return propertyFound.update({
                title,
                description,
                beds,
                baths,
                size,
                pricePerNight,
                location,
                images,
                purpose,
                type,
            });
        } else {
            return res.status(404).json({ error: 'Property not found' });
        }
    })
    .then(updatedProperty => {
        return res.status(200).json(updatedProperty);
    })
    .catch(err => {
        return res.status(500).json({ error: 'Unable to update property', details: err });
    });
  },
  deleteProperty: function (req, res) {
    const propertyId = req.params.propertyId;

    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (req.user.role !== "hoster") {
      return res.status(401).json({ error: 'You must be a Hoster to delete a property!' });
    }

    models.Property.findOne({
      where: { id: propertyId, hostId: req.user.id }
    })
      .then(propertyFound => {
        if (!propertyFound) {
          return res.status(404).json({ error: 'Property not found or unauthorized' });
        }

        return propertyFound.destroy();
      })
      .then(() => {
        return res.status(200).json({ message: 'Property deleted successfully' });
      })
      .catch(err => {
        return res.status(500).json({ error: 'Unable to delete property', details: err });
      });
  }
};
const express = require('express');
const propertiesCtrl = require('../controllers/propertiesCtrl');
const bookingCtrl = require('../controllers/bookingCtrl');
const roleCtrl = require("../controllers/roleCtrl");

const apiRouter = express.Router();

apiRouter.post('/property/create/', propertiesCtrl.createProperty);
apiRouter.get('/properties/all/', propertiesCtrl.getAllProperties);
apiRouter.get('/properties/mine/', propertiesCtrl.getPropertiesByHoster);
apiRouter.put('/property/update/:propertyId', propertiesCtrl.updateProperty);
apiRouter.delete('/property/delete/:propertyId', propertiesCtrl.deleteProperty);

apiRouter.put('/user/changeRole/:userId', roleCtrl.changeRole);

apiRouter.post('/booking/create/', bookingCtrl.createBooking);
apiRouter.get('/booking/mine/', bookingCtrl.getBookingsByHost);
apiRouter.put('/booking/confirm/:bookingId', bookingCtrl.confirmBooking);
apiRouter.put('/booking/cancel/:bookingId', bookingCtrl.cancelBooking);


module.exports = apiRouter;
/**
 * Created by Buwaneka on 8/31/17.
 */
var mongoose = require('mongoose');

var promotionSchema = mongoose.Schema({
    name: {type: String, required: true},
    createddate: {type: String, required: true},
    startdate: {type: String, required: true},
    enddate: {type: String, required: true},
    description: {type: String, required: true},
    latitude: {type: Number, required: true},
    longitude: {type: Number, required: true},
    imageurl: {type: String, required: false}
});

var Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;

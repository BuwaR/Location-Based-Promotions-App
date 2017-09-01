/**
 * Created by Buwaneka on 8/31/17.
 */
var express = require('express');
var formidable = require('formidable');
var math = require('mathjs');
var googleMaps = require('@google/maps').createClient({
    key:'AIzaSyBLeHKqQqDjjVP6lNtGFklkaQddQT--K1E'
});

var User = require('./user');
var Admin = require('./admin');
var Promotion = require('./promotion');

var router = express.Router();

router.get('/', function (request, response) {
    console.log('Request');
    response.send('Hello');
});

router.post('/adminsignup', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;

    if(!username || !password) {
        console.log('Username or password not provided');
        response.send('Username or password not provided');
    } else {
        Admin.findOne({username: username}, function (err, admin) {
            if(err) {
                response.send('Internal Server Error');
            } else if(admin) {
                response.send('Admin Already Exists');
            } else {
                var newAdmin = new Admin({
                    username: username,
                    password: password
                });
                newAdmin.save(function (err) {
                    if(err) {
                        response.send('Internal Server Error');
                    } else {
                        response.send('Successfully Registered');
                    }
                });
            }
        });
    }
});

router.post('/adminlogin', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;

    if(!username || !password) {
        console.log('Username or password not provided');
        response.send('Username or password not provided');
    } else {
        Admin.findOne({username: username}, function (err, admin) {
            if(err) {
                respone.send('Internal Server Error');
            } else if(!admin) {
                reponse.send('No admin found');
            } else {
                admin.checkPassword(password, function (isAuthenticated) {
                    if(!isAuthenticated) {
                        response.send('Incorrect Password');
                    } else {
                        response.send('Logged in Successfully');
                    }
                });
            }
        });
    }
});

router.post('/usersignup', function (request, response) {
    console.log(request.body);
    var username = request.body.username;
    var password = request.body.password;

    if(!username || !password) {
        console.log('Username or password not provided');
        response.send('Username or password not provided');
    } else {
        User.findOne({username: username}, function (err, user) {
            if(err) {
                response.send('Internal Server Error');
            } else if(user) {
                response.send('User Already Exists');
            } else {
                var newUser = new User({
                    username: username,
                    password: password
                });
                newUser.save(function (err) {
                    if(err) {
                        response.send('Internal Server Error');
                    } else {
                        response.send('Successfully Registered');
                    }
                });
            }
        });
    }
});

router.post('/userlogin', function (request, response) {
    var username = request.body.username;
    var password = request.body.password;

    if(!username || !password) {
        console.log('Username or password not provided');
        response.send('Username or password not provided');
    } else {
        User.findOne({username: username}, function (err, user) {
            if(err) {
                respone.send('Internal Server Error');
            } else if(!user) {
                reponse.send('No user found');
            } else {
                user.checkPassword(password, function (isAuthenticated) {
                    if(!isAuthenticated) {
                        response.send('Incorrect Password');
                    } else {
                        response.send('Logged in Successfully');
                    }
                });
            }
        });
    }
});

//create promotion
router.post('/createpromotion', function (request, response) {
    var name = request.body.name;
    var createddate = request.body.createddate;
    var startdate = request.body.startdate;
    var enddate = request.body.enddate;
    var description = request.body.description;
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    if(!name || !createddate || !startdate || !enddate || !description || !latitude || !longitude){
        response.send('Some data are missing');
    } else {
        var newPromotion = new Promotion({
            name: name,
            createddate: createddate,
            startdate: startdate,
            enddate: enddate,
            description: description,
            latitude: latitude,
            longitude: longitude
        });
        newPromotion.save(function (err) {
            if(err) {
                console.log(err);
                response.send('Error while saving...');
            } else {
                response.send('Successfully Created Promotion');
            }
        });
    }
});

//update promotion
router.post('/updatepromotion', function (request, response) {
  var name = request.body.name;
  var createddate = request.body.createddate;
  var startdate = request.body.startdate;
  var enddate = request.body.enddate;
  var description = request.body.description;
  var latitude = request.body.latitude;
  var longitude = request.body.longitude;
    if(!latitude || !longitude){
        response.send('Some data are missing');
    } else {
        Promotion.update({latitude:latitude, longitude:longitude}, { $set: {name:name, createddate:createddate, startdate:startdate, enddate:enddate, description:description}}, function(err, numAffected){
          if(err){
            response.send('Internal Server Error');
          }else{
            response.send('Successfully updated');
          }
        });
    }
});

//delete promotion
router.post('/deletepromotion', function (request, response) {
  var latitude = request.body.latitude;
  var longitude = request.body.longitude;
    if(!latitude || !longitude){
        response.send('Some data are missing');
    } else {
        Promotion.remove({latitude:latitude, longitude:longitude}, function(err, removed){
          if(err){
            response.send('Internal Server Error');
          }else{
            response.send('Successfully deleted');
          }
        });
    }
});

router.post('/uploadimage', function (request, response) {
    var latitude = request.body.latitude;
    var longitude = request.body.longitude;
    var filename = "";
    var form = new formidable.IncomingForm();
    form.multiples = false;
    form.uploadDir = path.join(__dirname, '/images');
    form.on('file', function(field, file) {
        fileName = file.name;
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
      Promotion.update({latitude:latitude, longitude:longitude}, { $set: {imageurl:file.path}}, function(err, numAffected){
        if(err){
          response.send('Internal Server Error');
        }else{
          response.send('Successfully uploaded image');
        }
      });
    });

    // parse the incoming request containing the form data
    form.parse(req);
});

router.get('/getpromotions/:latitude/:longitude', function (request, response) {
    console.log(request.params.latitude + " ---> " + request.params.longitude);
    var latitude = request.params.latitude;
    var longitude = request.params.longitude;

    Promotion.find({}, function(err, docs){
      if(err){
        respone.send('Internal Server Error');
      } else if(!docs) {
          reponse.send('No promotions found');
      } else {
          console.log(docs);
          var inRange = [];
          docs.forEach(function(promo){
            const RAD = 0.000008998719243599958;
            var x = promo.longitude-longitude;
            var y = promo.latitude-latitude;
            var d_sqre = (math.square(x))+(math.square(y));
            var d = math.sqrt(d_sqre);
            if(d<=100*RAD){
              inRange.push(promo);
            }
          });
          response.send(inRange);
      }
    });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var User = require("../model/user")
/* GET home page. */
var restful = require('node-restful');
var mongoose = restful.mongoose;
const uri = "mongodb+srv://tal:asrkpvg7@cluster0-dmhml.gcp.mongodb.net/ngochoang?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
  console.log("DATABASE: ROUTER");
});
var Group = router.group = restful.model('group', mongoose.Schema({
    name: String,
    info: String,
    cameras: Array,
    alias: String
  }))
  .methods(['get', 'post', 'put', 'delete']);
 
Group.register(router, '/groups');

var Camera = router.camera = restful.model('camera', mongoose.Schema({
    url: String,    //link RTSP
    title: String,
    info: String,
    alias: String
})).methods(['get', 'post', 'put', 'delete']);
Camera.register(router, '/cameras');

router.get('/', function (req, res, next) {
    res.render('login');
});

// router.get("/camera", function (req, res, next) {
//     res.render("camera");
// })

router.get("/register", function (req, res, next) {
    res.render("register")
})

router.post("/register", function (req, res, next) {
    console.log(req.body);
    if (req.body.username && req.body.password && req.body.re_password) {
        var userData = {
            username: req.body.username,
            password: req.body.password,
            room: req.body.room,
            name: req.body.name,
            phone: req.body.phone
        }

        User.create(userData, function (error, user) {
            if (error) {
                return next(error);
            } else {
                // req.session.userId = user._id;
                // return res.redirect('/login');
                res.send({
                    success: "OK"
                })
            }
        });
    } else {
        res.send({
            error: "Input not empty"
        });
    }

})

router.get("/suser/:room", function(req, res){
    console.log(req.params.room);
    Group.find({alias: req.params.room}, function(err, data){
        if(err){
            res.send([]);
            console.log(err);
            return;
        }
        console.log("FIND:",data);
        if(data.length == 0){
            res.send([]);
            // console.log(err);
            return;
        }
        User.find({room: data[0]._id}, function(er, da){
            if(er){
                res.send([]);
                console.log(er);
                return;
            }
            console.log("DATA:",da);
            res.send(da);
        })
    })

});

router.get("/login", function (req, res, next) {
    res.render("login")
})

router.get("/manager", function(req, res){
    res.render("manager/index");
})

router.get("/manager/:group", function(req, res){
    res.render("manager/index");
})

router.post("/login", function (req, res, next) {
    console.log(req.body.username)
    if (req.body.username && req.body.password) {
        User.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error('Wrong email or password.');
                err.status = 401;
                return next(err);
            } else {
                console.log(user);
                req.session.userId = user._id;
                return res.redirect('/vcamera');
            }
        });
    }
})

router.get("/vcamera", function (req, res, next) {
    console.log(req.session.userId);
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.render("camera");
                }
            }
        });
})

router.post("/remove", function(req, res){
    console.log(req.body);
    User.remove({_id: req.body._id}, function(e, d){
        if(e){
            res.send({
                error: "ok"
            })
            return;
        }
        res.send({
            success: "ok"
        })
    })
})
router.get("/group", function(req, res){
    res.render("group/group");
})
router.get("/ccamera", function(req, res){
    res.render("camera/camera");
})
router.get("/info", function(req, res, next){
    console.log(req.session.userId);
    User.findById(req.session.userId)
        .exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error('Not authorized! Go back!');
                    err.status = 400;
                    return next(err);
                } else {
                    return res.send(user);
                }
            }
        });
})

//  Logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/login');
            }
        });
    }
});
module.exports = router;
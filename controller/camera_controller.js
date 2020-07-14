var express = require('express');
var router = express.Router();
var ModelHandle = require("../model/camera");
// require one model to here
//Controller
router.get("/search", function(req, res){
    ModelHandle.find(req.query, function(e,r){
        if(e){
            res.send([]);
            return;
        };
        res.send(r);
    })
})
router.get("/", function(req, res){
    ModelHandle.find({}, function(e,r){
        if(e){
            res.send(e);
            return;
        };
        res.send(r);
    })
})

router.get("/:id", function(req, res){
    ModelHandle.find({_id: req.params.id}, function(e,r){
        if(e){
            res.send(e);
            return;
        };
        res.send(r);
    })
})

router.post("/", function(req, res){
    var ar = new ModelHandle(req.body);
    ar.save(function(err, r){
        if(err){
            console.log(err);
            res.send(err);
            return;
        }
        res.send(r);
    })
})

router.put("/:id", function(req, res){
    ModelHandle.findOneAndUpdate({_id: req.params.id}, req.body, function(err, r){
        if(err){
            console.log("PUT:", err);
            res.send({
                error: ""
            });
            return;
        }
        res.send(r);
    })
})

router.delete("/:id", function(req, res){
    ModelHandle.findOneAndDelete({_id: req.params.id}, function(e,r){
        if(e){
            res.send(e);
        } else {
            res.send(r);
        }
    })
})
module.exports = router;
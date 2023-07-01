const {
    thought,
    user

} = require ("../models");
const thoughtController = {
    getAllThoughts(request,response){
        thought.find({}).then(thoughtData=>response.json(thoughtData))
        .catch(error=>{
            console.log(error);
            response.status(500).json(error);
        });
    },
    getThoughtByID({
        parameters
    },response){
        thought.findOne({
            _ID: parameters.id
        }).select("-__v").sort({
            _ID: -1
        }).then(thoughtData=>{
            if(!thoughtData){
                response.status(404).json({
                    message: "no thought with that ID"
                });
                return
            }
            response.json(thoughtData);
        }).catch(error=>{
            console.log(error);
            response.status(400).json(error);
        });
    },
    addThought({
        body
    },response){
        thought.create(body).then((thoughtData)=>{
            return user.findOneAndUpdate(
                {
                    _ID:body.userID
                },
                {
                    $addToSet:{
                        thoughts:thoughtData._ID
                    }
                },
                {
                    new: true
                }
            );
        }).then(userData=>{
            if(!userData){
                response.status(404).json({
                    message: "no user with that ID"
                });
                return
            }
            response.json(userData);
        }).catch(error=>{
            console.log(error);
            response.status(400).json(error);
        });
    },
    updateThought({
        parameters,
        body
    },response){
        thought.findOneAndUpdate({
            _ID:parameters.thoughtID
        },
        {
            $set:body
        },
        {
            runValidators: true,
            new: true
        }).then(updateData=>{
            if(!updaterData){
                response.status(404).json({
                    message: "no thought with that ID"
                });
                return
            }
            return response.json({
                message: "Succesfully updated"
            });
        }).catch(error=>
            response.json(error)
            );
    },
    removeThought({
        parameters
    },response){
        thought.findOneAndDelete({
            _ID: parameters.thoughtID
        }).then(deletedThought=>{
            if(!deletedThought){
                return response.status(404).json({
                    message: "No thought by that ID"
                });
            }
        })
    }
    
}
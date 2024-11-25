
const mongoose = require('mongoose')


const messageSchema = new mongoose.Schema({

    content:{
        type:String,
        required:true
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    room:{
        type:String,
        default:'public'
    },
    timestamp: {
        type: Date,
        default: Date.now
     }
})

const Messages = mongoose.model('Messages',messageSchema)

exports.default = Messages
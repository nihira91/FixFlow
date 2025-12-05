const mongoose=require('mongoose');
const feedbackSchema=new mongoose.Schema(
    {
        technicianId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true

        },
        employeeId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true

        },
        issueId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            index:true

        },
        rating:{
            type:Number,
            required:true,
            min:1,
            max:5
        },
        comment:{
            type:String,
            default:''
        },
        tags:[
            {
            type:String
            }

        ],
        isPublic: {
            type: Boolean,
            default: true
        }
    },
 { timestamps: true }

    
);

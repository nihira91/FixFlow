const mongoose=require('mongoose');
const ratingBreakdownSchema=new mongoose.Schema(
    {
        '1':{type:Number,default:0},
        '2':{type:Number,default:0},
        '3':{type:Number,default:0},
        '4':{type:Number,default:0},
        '5':{type:Number,default:0}
    },
    {_id:false}
);
const technicianStatsSchema=new mongoose.Schema(
    {
        technicianId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
            unique:'true',
            index:'true'
        },
        averageRating:{
            type:Number,
            default:0
        },
        totalRatings:{
            type:Number,
            default:0
        },
        positiveCount:{
            type:Number,
            default:0
        },
        negativeCount:{
            type:Number,
            default:0
        },
        ratingBreakdown: {
            type: ratingBreakdownSchema,
            default: () => ({})
        },
        lastUpdatedAt: {
            type: Date,
            default: Date.now
        }
    },
        {timestamps:true}


    


);
module.exports = mongoose.model('TechnicianStats', technicianStatsSchema);
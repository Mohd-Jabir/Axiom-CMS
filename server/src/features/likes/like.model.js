import mongoose, { Schema,model } from "mongoose";

const likeSchema=new Schema({

        ownership:{
            userId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                required:true
            },
            postId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'Post',
                required:true
            }
        }
},{timestamps:true})
//indexes
likeSchema.index({"ownership.userId":1,"ownership.postId":1},{unique:true});
likeSchema.index({"ownership.postId":1});

export const Like=model('Like',likeSchema)
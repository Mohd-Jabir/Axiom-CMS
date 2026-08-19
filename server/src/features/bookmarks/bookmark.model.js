import mongoose ,{ Schema,model } from "mongoose";

const bookmarkSchema=new Schema({
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
bookmarkSchema.index({"ownership.userId":1,"ownership.postId":1},{unique:true});
bookmarkSchema.index({"ownership.userId":1});
export const Bookmark=model('Bookmark',bookmarkSchema);
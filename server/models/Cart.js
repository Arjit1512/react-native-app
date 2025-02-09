import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
    {
                product_name:{
                    type:String,
                    required:true
                },
                product_quantity:{
                    type:Number,
                    required:true,
                    default:0
                },
                product_price:{
                    type:Number,
                    required:true
                },
                product_id:{
                    type:String,
                    required:true
                },
                imagePath:{
                    type:String,
                    required:true
                },
                size:{
                    type:String,
                    required:true
                },
                totalBill:{
                    type:Number,
                    required:true,
                    default:0
                },
                userId:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'2.0-User',
                    required:true
                }
          
    }
)

const Cart = mongoose.model('2.0-Cart',CartSchema);
export default Cart;
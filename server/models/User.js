import mongoose from "mongoose";


const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique:true
        },
        password: {
            type: String,
            required: true
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        cart: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: '2.0-Cart'
            }
        ],
        orders: [
            {
                totalBill: {
                    type: Number,
                    required: true
                },
                date:{
                    type: Date
                },
                items: [
                    {
                        productId: {
                            type: String,
                            required: true
                        },
                        productQuantity: {
                            type: Number,
                            required: true
                        },
                        productEntirePrice: {
                            type: Number,
                            required: true
                        },
                        productName: {
                            type: String,
                            required: true
                        },
                        productImagePath: {
                            type: String,
                            required: true
                        },
                        productSize: {
                            type: String,
                            required: true
                        },
                    }
                ]
            }
        ],
        address: [
            {
                street: {
                    type: String,
                    required: true
                },
                city: {
                    type: String,
                    required: true
                },
                state: {
                    type: String,
                    required: true
                },
                pincode: {
                    type: Number,
                    required: true
                },
            }
        ],
        feedback: [
            {
                fName: {
                    type: String
                },
                lName: {
                    type: String
                },
                subject: {
                    type: String
                },
                message: {
                    type: String,
                    required: true
                },
            }
        ]
    }
)


const User = mongoose.model('2.0-User', UserSchema);
export default User;
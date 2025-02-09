import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import Cart from './models/Cart.js';
import crypto from 'crypto';
import products from './products.js';
import axios from 'axios';

dotenv.config();
const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://2-0-ochre.vercel.app"
];

// Remove the duplicate cors() middleware
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
};
app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: "true" }));
app.all('', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", allowedOrigins);
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    //Auth Each API Request created by user.
    next();
});
const secret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

app.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body; // Amount in the smallest currency unit (e.g., paise for INR)
        if (!amount) {
            return res.status(200).json({ message: "Amount required!" });
        }
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: amount,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        };

        const order = await razorpay.orders.create(options);
        res.status(200).json({
            success: true,
            orderId: order.id,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});


app.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(200).json({ success: false, message: "Missing required payment details!" });
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature === razorpay_signature) {
        // Payment is verified
        return res.status(200).json({ success: true, message: "Payment verified!" });
    } else {
        return res.status(200).json({ success: false, message: "Invalid payment signature!" });
    }
});

// Webhook endpoint
// app.post("/webhook", (req, res) => {
//     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

//     const receivedSignature = req.headers["x-razorpay-signature"];
//     const generatedSignature = crypto
//         .createHmac("sha256", webhookSecret)
//         .update(JSON.stringify(req.body))
//         .digest("hex");

//     if (receivedSignature === generatedSignature) {
//         console.log("Webhook verified successfully!");

//         const event = req.body.event;
//         const payload = req.body.payload;

//         if (event === "payment.captured") {
//             const paymentId = payload.payment.entity.id;
//             const orderId = payload.payment.entity.order_id;
//             console.log("Payment captured:", paymentId);

//             // Process order based on orderId or paymentId
//             // Update your database, notify the user, etc.
//         }

//         res.status(200).json({ status: "success" });
//     } else {
//         console.error("Invalid webhook signature!");
//         res.status(400).json({ error: "Invalid signature" });
//     }
// });
const generateShiprocketToken = async () => {
    try {
        const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
            email: "hemanth.a21@iiits.in",
            password: "Hemanth#2003"
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.data.token) {
            throw new Error('Failed to generate Shiprocket token');
        }

        return response.data.token;
    } catch (error) {
        console.error('Shiprocket Token Generation Error:', error.response ? error.response.data : error.message);
        throw new Error('Failed to generate Shiprocket authentication token');
    }
};
app.post('/api/shiprocket/create-order', async (req, res) => {
    try {

        const shiprocketToken = await generateShiprocketToken();


        const response = await fetch('https://apiv2.shiprocket.in/v1/external/orders/create/adhoc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${shiprocketToken}`
            },
            body: JSON.stringify(req.body)
        });

        const responseData = await response.json();


        if (!response.ok) {
            return res.status(response.status).json({
                error: responseData.message || "Unknown Shiprocket API error"
            });
        }

        res.json(responseData);
    } catch (error) {
        console.error("Detailed Shiprocket Order Creation Error:", error);
        res.status(500).json({ error: error.message });
    }
});



app.post('/:userId/checkout', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        console.log('User ID:', userId);
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const user = await User.findById(userId).populate('cart');
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }
        const bill = user.cart.reduce((acc, item) => acc + item.totalBill, 0);
        if (bill == 0) {
            return res.status(200).json({ message: "No items in the cart!" });
        }
        const cartItemIds = user.cart.map(item => item._id);
        await Cart.deleteMany({ _id: { $in: cartItemIds } });

        user.orders.push({
            totalBill: bill,
            date: new Date(),
            items: user.cart.map((item) => ({
                productId: item.product_id,
                productQuantity: item.product_quantity,
                productEntirePrice: item.product_quantity * item.product_price,
                productName: item.product_name,
                productImagePath: item.imagePath,
                productSize: item.size,
                _id: item._id
            }))
        })

        user.cart = [];
        await user.save();
        return res.status(200).json({ message: "Checkout successful!", totalBill: bill });
    } catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/register', async (req, res) => {
    try {
        const { userName, email, password } = req.body;
        if (!email || !userName || !password) {
            return res.status(200).json({ message: "Email, username, and password are required" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).json({ message: "User already exists!" });
        }
        const newUser = new User({
            userName, email, password, tokens: []
        })
        const token = jwt.sign({ userId: newUser._id }, secret, { expiresIn: '30d' });
        newUser.tokens.push({ token });
        await newUser.save();
        return res.status(200).json({ token: token, message: "Registration successfull!", userID: newUser._id, userName: userName });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})



app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(200).json({ message: "Email, username, and password are required" });
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(200).json({ message: "User does not exists!" });
        }
        const isMatch = existingUser.password === password;
        if (!isMatch) {
            return res.status(200).json({ message: "Incorrect password!" });
        }
        const token = jwt.sign({ userId: existingUser._id }, secret, { expiresIn: '30d' });
        existingUser.tokens.push({ token });
        await existingUser.save();
        return res.status(200).json({ token: token, message: "Login successfull!", userID: existingUser._id, userName: existingUser.userName });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})

app.get('/:userId/get-user-details', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ message: "User does not exisits!" });
        }
        return res.status(200).json({ name: user.userName, email: user.email, message: "success" });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})


app.get('/:userId/get-cart', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        if (userId) {
            const user = await User.findById(userId).populate('cart');
            if (!user) {
                return res.status(400).json({ message: "User does not exists!" });
            }
            const items = await Cart.find({ userId: userId });
            const orders = user.orders;
            if (items.length === 0) {
                return res.status(200).json({ message: "Cart is empty!", items, orders: orders });
            }
            return res.status(200).json({ message: "Cart items fetched!", items, orders: orders });
        }
        return res.status(400).json({ error: "userID is required" });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})


app.post('/:userId/add-item/:productId', verifyToken, async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        console.log('User ID:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const { size } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }

        const product = products.find((item) => item.id === Number(productId));
        if (!product) {
            return res.status(400).json({ message: "Such product does not exists!" });
        }
        if (!size) {
            return res.status(400).json({ message: "Size of the product is required!" });
        }
        const existingCartItem = await Cart.findOne({ product_id: productId, userId: userId, size: size });
        if (existingCartItem) {
            existingCartItem.product_quantity += 1;
            existingCartItem.totalBill = existingCartItem.product_price * existingCartItem.product_quantity;
            await existingCartItem.save();
            return res.status(200).json({ message: "Quantity updated!" });
        }

        const newProduct = new Cart({
            product_id: productId,
            product_name: product.name,
            product_quantity: 1,
            product_price: product.price,
            imagePath: product.imgURL,
            totalBill: product.price,
            size: size,
            userId: userId
        })
        await newProduct.save();
        user.cart.push(newProduct._id);
        await user.save();
        return res.status(200).json({ message: "Item added to cart successfully!" });
    }
    catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/:userId/remove-item/:productId', verifyToken, async (req, res) => {
    try {
        const { userId, productId } = req.params;
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        console.log('User ID:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const { size } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }

        const product = products.find((item) => item.id === Number(productId));
        if (!product) {
            return res.status(400).json({ message: "Such product does not exists!" });
        }
        if (!size) {
            return res.status(400).json({ message: "Size of the product is required!" });
        }
        const existingCartItem = await Cart.findOne({ product_id: productId, userId: userId, size: size });
        if (!existingCartItem) {
            return res.status(400).json({ message: "Product not found in cart!" });
        }
        if (existingCartItem.product_quantity === 1) {
            await Cart.findByIdAndDelete(existingCartItem._id);
            await User.findByIdAndUpdate(userId, { $pull: { cart: existingCartItem._id } });
            return res.status(200).json({ message: "Quantity deleted!" });
        }



        existingCartItem.product_quantity -= 1;
        existingCartItem.totalBill = existingCartItem.product_price * existingCartItem.product_quantity;
        await existingCartItem.save();
        return res.status(200).json({ message: "Quantity updated!" });



    }
    catch (error) {
        console.log('Error: ', error);
    }
})



app.post('/:userId/add-address', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        const { street, city, state, pincode } = req.body;
        console.log('User ID:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        // Regex for validating Indian pincode (6 digits)
        const pincodeRegex = /^[1-9][0-9]{5}$/;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).json({ message: "User does not exists!" });
        }
        if (!street || !city || !state || !pincode) {
            return res.status(200).json({ message: "Please enter all the address details!" });
        }
        if (!pincodeRegex.test(pincode)) {
            return res.status(200).json({ message: "Invalid pincode format!" });
        }
        user.address.push({ street: street, city: city, state: state, pincode: pincode });
        await user.save();
        return res.status(200).json({ message: "Address added successfully!" });

    } catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/:userId/remove-address/:addressId', verifyToken, async (req, res) => {
    try {
        const { userId, addressId } = req.params;
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        console.log('User ID:', userId);
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }
        const addressExists = user.address.some(address => address._id.toString() === addressId);
        if (!addressExists) {
            return res.status(400).json({ message: "Address not exists!" });
        }
        user.address = user.address.filter((address) => address._id.toString() !== addressId);


        await user.save();
        return res.status(200).json({ message: "Address removed successfully!" });

    } catch (error) {
        console.log('Error: ', error);
    }
})

app.post('/:userId/feedback', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { fName, lName, subject, message } = req.body;
        if (req.userId !== userId) {
            return res.status(403).json({ message: "You are not authorized to perform this action" });
        }
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User does not exists!" });
        }
        if (!message) {
            return res.status(200).json({ message: "Message is required!" });
        }
        user.feedback.push({
            fName, lName, subject, message
        });
        await user.save();
        return res.status(200).json({ message: 'Feedback taken succesfully' });

    } catch (error) {
        console.log('Error: ', error);
    }
})

const PORT = process.env.PORT || 5001;
console.log(process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    })
    .catch((error) => console.log(`${error} did not connect`));

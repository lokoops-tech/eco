const port = process.env.PORT || 4000; 
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require('fs');
const http = require('http');
const socketIo = require('socket.io');
const sharp = require('sharp');
require("dotenv").config(); // Load environment variables
const cloudinary = require('cloudinary').v2;

// Create HTTP server for Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO
const io = socketIo(server, {
    cors: {
        origin: ["https://eco-pirg.onrender.com", "https://ecommerce-3-93bn.onrender.com",],
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Import routes
const authUsersRoutes = require("./routes/authUsers");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/order");
const adminRoutes = require("./routes/Admin");
const newslettersRoutes = require("./routes/newsletters");
const stockUpdateRoutes = require("./routes/stockUpdate");
const cartRoutes = require("./routes/cart");
const resetPasswordRoutes = require("./routes/resetPassword");
const Analytics = require("./routes/Analytics");

// Middleware
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = ["http://localhost:5173","http://localhost:5174", "https://ecommerce-3-93bn.onrender.com","https://eco-pirg.onrender.com", "https://ecommerce-axdj.onrender.com"];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
app.use(express.json()); // Parse JSON request bodies

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit the process if MongoDB connection fails
    });
    
// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'upload/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Image storage configuration
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Serving static images
app.use('/images', express.static(path.join(__dirname, 'upload/images')));

// API root endpoint
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Enhanced upload endpoint with image compression
app.post("/upload", upload.single('product'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: "No file uploaded"
            });
        }
        
        // Get the uploaded file path
        const filePath = req.file.path;
        
        // Create output path for compressed image
        const compressedFilePath = filePath.replace(/\.[^/.]+$/, "") + "_compressed" + path.extname(filePath);
        
        // Process and compress the image
        await sharp(filePath)
            .resize({ 
                width: 1200,      // Resize width to maximum 1200px
                withoutEnlargement: true  // Don't enlarge small images
            })
            .jpeg({ quality: 80 }) // Set JPEG quality to 80%
            .toFile(compressedFilePath);
            
        // Upload the compressed file to Cloudinary
        const result = await cloudinary.uploader.upload(compressedFilePath);
        
        // Return the Cloudinary URL
        res.json({
            success: true,
            image_url: result.secure_url
        });
        
        // Clean up local files
        fs.unlinkSync(filePath); // Delete original file
        fs.unlinkSync(compressedFilePath); // Delete compressed file
        
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Register Routes
app.use("/auth", authUsersRoutes); // Authentication routes (signup, login, etc.)
app.use("/product", productRoutes); // Product-related routes
app.use("/order", orderRoutes); // Order-related routes
app.use("/admin", adminRoutes); // Admin-related routes
app.use("/newsletter", newslettersRoutes); // Newsletter-related routes
app.use("/stockUpdate", stockUpdateRoutes); // Stock-related routes
app.use("/cart", cartRoutes); // Cart-related routes
app.use("/reset-password", resetPasswordRoutes);
app.use("/analytics", Analytics);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('New client connected', socket.id);
    
    // Handle product data requests
    socket.on('getProducts', async (filters) => {
        try {
            // Import the Product model
            const Product = require('./Models/Product');
            
            // Build query based on filters
            let query = {};
            if (filters) {
                if (filters.category) query.category = filters.category;
                if (filters.priceRange) {
                    query.price = { 
                        $gte: filters.priceRange.min, 
                        $lte: filters.priceRange.max 
                    };
                }
                // Add more filter conditions as needed
            }
            
            // Fetch products from database
            const products = await Product.find(query);
            
            // Send products back to client
            socket.emit('productsData', products);
        } catch (error) {
            console.error('Error fetching products:', error);
            socket.emit('error', { message: 'Failed to fetch products' });
        }
    });
    
    // Handle real-time order updates
    socket.on('newOrder', (orderData) => {
        // Broadcast to admin clients or specific user rooms
        io.emit('orderNotification', {
            message: 'New order received',
            orderId: orderData._id
        });
    });
    
    // Handle stock updates
    socket.on('stockUpdate', (data) => {
        // Broadcast the stock update to all connected clients
        io.emit('stockChanged', data);
    });
    
    // Real-time cart synchronization
    socket.on('updateCart', (data) => {
        if (data.userId) {
            socket.join(`user-${data.userId}`);
            io.to(`user-${data.userId}`).emit('cartUpdated', data.cart);
        }
    });
    
    // Join admin room for admin-specific updates
    socket.on('joinAdminRoom', (adminData) => {
        if (adminData && adminData.isAdmin) {
            socket.join('adminRoom');
            console.log('Admin joined admin room', socket.id);
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected', socket.id);
    });
});

// Start Server with Socket.IO
server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

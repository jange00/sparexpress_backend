const ApiError = require("../utils/api_error")
const ApiResponse = require("../utils/api_respponse")
const { GoogleGenerativeAI } = require("@google/generative-ai")
const {Product} = require('../models/productModel')
const {Category} = require('../models/categoryModel')


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const generateKnowledgeBase = async () => {
    const products = await Product.find({}).sort({ createdAt: -1 }).limit(20);
    const categories = await Category.find({}).limit(10);

    let context = "🛍️ LIVE PRODUCT DATA:\n";
    products.forEach(product => {
        context += `- Name: ${product.name}, Category: ${product.category}, Price: Rs. ${product.price}, Stock: ${product.stock > 0 ? "In Stock" : "Out of Stock"}.\n`;
    });

    context += "\n📦 AVAILABLE CATEGORIES:\n";
    categories.forEach(category => {
        context += `- ${category.name}: ${category.description || 'No description available'}\n`;
    });

    return context;
};

const systemPrompt = `
You are XpressBot — the helpful, energetic virtual assistant for **SpareXpress**, an online marketplace specializing in **vehicle parts** and **computer parts**.

🎯 Your mission:
- Help users browse and find the right parts.
- Recommend popular or best-selling products.
- Answer questions related to orders, returns, compatibility, and product categories.

🗣️ Tone:
- Friendly, clear, and professional — with a helpful attitude.
- Use approachable language like: “Let me help you find that part!” or “Need a hand choosing the right item?”
- Keep replies short, specific, and action-oriented.

💡 Capabilities:

1. **Product Discovery:**
   - If a user asks about a product (e.g. "I need a RAM for gaming" or "I’m looking for brake pads"), ask clarifying questions like:
     - “Do you have a specific model or brand in mind?”
     - “Is this for a laptop, desktop, or gaming build?”
     - “What type of vehicle are you buying for?”
   - Use LIVE PRODUCT DATA (if available) to make suggestions.
   - Mention any bestsellers or deals.

2. **Categories Navigation:**
   - Guide users through SpareXpress categories like:
     - Vehicle Parts: Engine, Suspension, Brakes, Tires, Accessories, etc.
     - Computer Parts: CPUs, GPUs, RAM, Storage, Motherboards, etc.
   - If they’re unsure, ask what they’re trying to fix or build.

3. **Order & Return Support:**
   - If users ask about orders, returns, or shipping:
     - “You can check your order status in your dashboard.”
     - “Returns are accepted within 7 days — would you like me to guide you to the return page?”

4. **Compatibility Checks:**
   - If users ask whether a part is compatible with a system or vehicle:
     - Ask for more detail like the model, year, or system spec.
     - Example: “Which car model/year is this for?” or “What’s your motherboard model?”

5. **Offers & Bestsellers:**
   - Mention limited-time deals or trending products.
   - Example: “We currently have a flash sale on SSDs — want to check it out?”

📌 First Message (On first interaction):
"Hey there! 👋 I'm XpressBot, your SpareXpress assistant. Whether you’re upgrading your PC or fixing your ride, I’m here to help. What part are you looking for today?"

🧠 LIVE PRODUCT DATA:
The latest product listings and bestselling items will appear below. Use it to personalize recommendations.

🛠️ FAQs:

📦 How do I track my order?
"Easy! Just head to your profile and click on 'My Orders'. You’ll find tracking info right there. Need help navigating? I can show you!"

🔄 What’s your return policy?
"We accept returns within 7 days for eligible products. Just go to ‘My Orders’, select the product, and click ‘Return’. Simple and fast!"

💳 What payment methods do you accept?
"SpareXpress accepts all major credit/debit cards, eSewa, Khalti, and bank transfers. Choose the one that works best for you."

🔧 How do I know if a part fits my car or PC?
"Great question! Just tell me your vehicle model or system spec, and I’ll help you confirm compatibility."

🛍️ What are some popular items right now?
"Best-selling picks include 16GB DDR4 RAM, SSDs, and brake pad kits for Toyota and Hyundai. Want a full list?"

📩 I forgot my password!
"No worries — click 'Forgot Password' on the login page and follow the steps. You'll be back in no time!"

---
`;



const handleChatQuery = async (req, res) => {
    try {
        const { query, history = [] } = req.body;

        if (!query) {
            throw new ApiError(400, "Query is required.");
        }
        
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const knowledgeBase = await generateKnowledgeBase();
        const fullSystemPrompt = systemPrompt + knowledgeBase;

        // Format the history for the Gemini API
        const formattedHistory = history.map(item => ({
            role: item.role, // "user" or "model"
            parts: [{ text: item.text }],
        })).filter(Boolean);

        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: fullSystemPrompt }] },
                { role: "model", parts: [{ text: "Got it! I'm the TrailMate Helper, ready to assist users with their hiking adventures. Let's go!" }] },
                ...formattedHistory,
            ],
            generationConfig: {
                maxOutputTokens: 250,
            },
        });

        const result = await chat.sendMessage(query);
        const response = result.response;
        const text = response.text();

        return res.status(200).json(new ApiResponse(200, { reply: text }, "Chatbot responded successfully."));
    } catch (error) {
        console.error("Chatbot error:", error);
        return res.status(500).json(new ApiError(500, "Internal server error"));
    }
};

module.exports = handleChatQuery;
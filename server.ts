import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = 3000;

// Middleware for parsing JSON JSON and urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Google Gen AI
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. AI features might fail.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Catch-all for API to debug 405/404
app.all("/api/*", (req, res, next) => {
  console.log(`[API Debug] ${req.method} ${req.url}`);
  next();
});

// API Test route
app.get("/api/test", (req, res) => {
  res.json({ status: "ok", message: "API is working" });
});

// API endpoint for AI Moc Chau Itinerary Planner
app.post("/api/generate-itinerary", async (req, res) => {
  console.log(`[AI Planner] Received POST request from ${req.ip}`);
  try {
    const { duration, style, budget, groupType, notes } = req.body;
    console.log("[AI Planner] Request params:", { duration, style, budget, groupType });

    const ai = getAiClient();
    const modelName = "gemini-3.5-flash"; 

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("[AI Planner] Warning: GEMINI_API_KEY is missing. Returning template response.");
      return res.json({
        success: true,
        itinerary: `### Lịch trình Mầm Đá Mộc Châu Gợi Ý (Chế độ chạy thử)
\n**Thời lượng:** ${duration || "3 ngày 2 đêm"} | **Phong cách:** ${style || "Khám phá"} | **Ngân sách:** ${budget || "Tầm trung"} | **Nhóm:** ${groupType || "Cặp đôi"}
\nHiện tại hệ thống AI đang ở chế độ chờ (Chưa có API Key), mời bạn tham khảo lịch trình chuẩn:
\n* **Ngày 1:** Hà Nội - Mộc Châu - Đồi Chè Trái Tim - Thưởng thức Bê Chao nóng hổi.
\n* **Ngày 2:** Khám phá Thác Dải Yếm - Cầu kính Bạch Long (Kỷ lục thế giới) - Rừng thông bản Áng lãng mạn.
\n* **Ngày 3:** Chợ phiên - Mua sắm đặc sản mận hậu, bánh sữa - Trở về Hà Nội.
\n*Hãy cung cấp khóa API trong phần cài đặt để trải nghiệm AI đầy đủ nhất!*`
      });
    }

    const systemInstruction = `Bạn là chuyên gia du lịch am hiểu nhất về Mộc Châu. 
Hãy đóng vai Đại sứ Du lịch của hệ thống 'Xe Đi Mộc Châu', viết lịch trình bằng tiếng Việt, giọng điệu chuyên nghiệp, mến khách và đầy cảm hứng.
Kết hợp các địa danh: Đồi chè Trái Tim, Thung lũng Nà Ka, Thác Dải Yếm, Cầu kính Bạch Long, Rừng thông bản Áng...
Tặng lời khuyên về ẩm thực bản địa: Bê Chao, Cá suối, Trâu gác bếp.`;

    const prompt = `Lập lịch trình chi tiết đi Mộc Châu:
- Thời gian: ${duration}
- Phong cách: ${style}
- Ngân sách: ${budget}
- Đối tượng: ${groupType}
- Lưu ý: ${notes || "Không có"}
Vui lòng trình bày bằng Markdown, sử dụng emoji sinh động.`;

    console.log("[AI Planner] Calling Gemini API...");
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        systemInstruction: systemInstruction,
        maxOutputTokens: 2000,
        temperature: 0.7,
      }
    });

    const text = response.text;
    
    console.log("[AI Planner] Generation successful. Sending response.");
    res.json({
      success: true,
      itinerary: text
    });

  } catch (error: any) {
    console.error("[AI Planner] ERROR:", error.message);
    res.status(500).json({
      success: false,
      message: "Trợ lý AI đang bận hoặc gặp sự cố kỹ thuật. Vui lòng thử lại sau 30 giây.",
      error: error.message
    });
  }
});

// Serve frontend build static files and setup Vite configuration in development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Xe Di Moc Chau Server] Running on http://localhost:${PORT}`);
  });
}

startServer();

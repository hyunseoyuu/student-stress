import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const PORT = 3000;
const app = express();

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// API endpoint for diagnostic analysis
app.post("/api/diagnose", async (req, res): Promise<any> => {
  const { category, context, scores } = req.body;

  if (!scores) {
    return res.status(400).json({ error: "Scores data is required." });
  }

  const prompt = `
[사용자 학업 진단 프로필]
- 대상 유형: ${category || "일반 학생/학습자"}
- 사용자 서술 상황 (어려움): ${context || "작성하지 않음"}
- 자가진단 하위 영역별 점수 (각 영역 25점 만점):
   1) 학업 소진 (Exhaustion): ${scores.exhaustion}점
   2) 학업 냉소 (Cynicism): ${scores.cynicism}점
   3) 학업 효능감 저하 (Reduced Efficacy): ${scores.efficacy}점
   4) 스트레스 신체 증상 (Physical Symptoms): ${scores.physical}점

이 사람의 학업 스트레스 및 번아웃 위험도 분포를 분석하고, 실질적이고 학구적인 조언과 마인드 케어 솔루션을 제공해주세요.
대상 유형별 특성(${category})과 작성한 구체적 어려움(${context})을 한 치의 양함 없이 밀도 높고 감성적인 어조로 녹여내어, 정말 심도 있는 맞춤형 솔루션을 설계해주세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `학습 심리학자와 전문 임상 심리상담사의 눈높이를 융합한 따뜻하고 전문적인 심리 분석가입니다. 
대한민국의 혹독한 입시, 학업, 논문 작성, 고시 준비 문화에서 상처받고 소진된 학습자에게 '감성적 위로와 구체적인 지각적 행동 솔루션'을 전달해야 합니다. 
반드시 정형화된 정형 지침에서 벗어나, 상투적이지 않고 마음에 와닿는 격조 높은 우리말로 한국어 맞춤형 분석을 설계하세요.
상냥하지만 지적이면서 깊이 있는 어조를 채택하세요. 소진, 냉소, 효능감 저하가 주는 발달학적 의미를 짚어주세요.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "summary",
            "exhaustionAnalysis",
            "cynicismAnalysis",
            "efficacyAnalysis",
            "physicalAnalysis",
            "actionSteps",
            "longTermTips",
            "categorySpecificAdvice",
            "dailySlogan"
          ],
          properties: {
            summary: {
              type: Type.STRING,
              description: "종합적인 평가 및 현상 깊이 파악, 따뜻하고 공감 가득한 문학적·치유적 총평 (4-5문장)",
            },
            exhaustionAnalysis: {
              type: Type.STRING,
              description: "사용자의 '학업 소진(Exhaustion)' 점수에 맞춰 감성 및 현상 기제를 분석한 격로와 조언 (3-4문장). 소진 점수가 높을 경우 뇌의 누적 피로와 휴식의 정당성을 강조하십시오.",
            },
            cynicismAnalysis: {
              type: Type.STRING,
              description: "사용자의 '학업 냉소(Cynicism)' 점수에 부합하는 심리학적 심층 원인 진단 (공부가 허망하게 느껴지거나 무가치하게 느껴지는 마음 상태를 치유해줄 수 있게 학업의 방향성 관점에서 작성).",
            },
            efficacyAnalysis: {
              type: Type.STRING,
              description: "사용자의 '효능감 저하(Reduced Efficacy)' 점수에 대한 분석. 현재 상황이 개인의 능력 부족이 아닌 일시적인 환경적 침체임을 명확히 각인시키는 멘토링.",
            },
            physicalAnalysis: {
              type: Type.STRING,
              description: "사용자가 호소 중인 신체적 스트레스 증상 해석과 뇌-신체 연결을 달래주는 웰니스 분석 조언.",
            },
            actionSteps: {
              type: Type.ARRAY,
              description: "즉시 실행해볼 수 있는 구체적인 단기 회복 전술 행동 카드 3종",
              items: {
                type: Type.OBJECT,
                required: ["title", "description", "category"],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: "행동 카드의 감각적이고 매력적인 제목 (예: '60초 백색소음 호흡', '스마트폰 90분 마인드 프리존')",
                  },
                  description: {
                    type: Type.STRING,
                    description: "체계적인 실천 방법론 및 뇌과학 기반의 심리학적 기대효과 (상세히)",
                  },
                  category: {
                    type: Type.STRING,
                    description: "어떤 성격의 솔루션인지 (예: '휴식/소진방지', '의미재발견', '작은공간감축', '신체이완')",
                  },
                },
              },
            },
            longTermTips: {
              type: Type.ARRAY,
              description: "장기적으로 라이프 및 공부 시스템을 구축해가기 위한 행동 루틴 팁 (최소 3개 성실하게 작성)",
              items: { type: Type.STRING },
            },
            categorySpecificAdvice: {
              type: Type.STRING,
              description: "그 유형에 딱 들어맞는 디테일한 상황 제언 (학업 난이도와 사회화 측면 고려).",
            },
            dailySlogan: {
              type: Type.STRING,
              description: "가슴을 울리는 따뜻하고 지혜로운 한 줄 응원 문장",
            },
          },
        },
      },
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("No response string from Gemini API");
    }

    const diagnosisResult = JSON.parse(textOutput.trim());
    return res.json(diagnosisResult);
  } catch (error: any) {
    console.error("Gemini Diagnosis API Error:", error);
    return res.status(500).json({
      error: "진단 분석을 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      details: error.message,
    });
  }
});

// Configure Vite or Static Files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in DEVELOPMENT mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in PRODUCTION mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();

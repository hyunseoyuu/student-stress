import React, { useState, useEffect } from "react";
import { CategoryType, QuizScores, DiagnosisResult, HistoryRecord, JournalEntry } from "./types";
import { QUESTIONS } from "./data";
import IntroStep from "./components/IntroStep";
import DiagnosticQuiz from "./components/DiagnosticQuiz";
import BreathingExercise from "./components/BreathingExercise";
import SelfCareLogs from "./components/SelfCareLogs";
import MindJournal from "./components/MindJournal";
import ReportDashboard from "./components/ReportDashboard";
import { 
  Heart, ClipboardCheck, Wind, Calendar, PenTool, Sparkles, Sprout,
  Activity, CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck, HelpCircle
} from "lucide-react";

const LOADING_MESSAGES = [
  "AI 학습 심리학자가 세부 분석 데이터를 읽어내고 있습니다...",
  "사용자의 학업 소진 및 냉소 점수를 정신 분석 기설에 맞추어 연산 중입니다...",
  "오늘 독서실을 퇴실하며 바로 시도할 행동 카드를 엄선하고 있습니다...",
  "완벽하지 않아도 가치 있는 당신에게 부칠 은은한 응원 메시지를 빚어내고 있습니다...",
  "누적된 뇌 회백질의 과각성 상태를 달래줄 인지 치유 조언을 정립 중입니다..."
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<"home" | "breathing" | "journal" | "history">("home");

  // Diagnostic states
  const [diagnosticStage, setDiagnosticStage] = useState<"intro" | "quiz" | "analyzing" | "result">("intro");
  const [category, setCategory] = useState<CategoryType | null>(null);
  const [context, setContext] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<DiagnosisResult | null>(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState<number>(0);

  // Local Storage Data
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem("care_burnout_history");
      const storedJournals = localStorage.getItem("care_burnout_journals");
      
      if (storedHistory) {
        setHistoryRecords(JSON.parse(storedHistory));
      }
      if (storedJournals) {
        setJournalEntries(JSON.parse(storedJournals));
      }
    } catch (err) {
      console.error("Local storage retrieval failed:", err);
    }
  }, []);

  // Sync utilities
  const syncHistory = (newRecords: HistoryRecord[]) => {
    setHistoryRecords(newRecords);
    localStorage.setItem("care_burnout_history", JSON.stringify(newRecords));
  };

  const syncJournals = (newEntries: JournalEntry[]) => {
    setJournalEntries(newEntries);
    localStorage.setItem("care_burnout_journals", JSON.stringify(newEntries));
  };

  // Switch loading messages while fetching
  useEffect(() => {
    let interval: any;
    if (diagnosticStage === "analyzing") {
      interval = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [diagnosticStage]);

  // Scoring calculator
  const calculateScores = (): QuizScores => {
    const categories = { exhaustion: 0, cynicism: 0, efficacy: 0, physical: 0 };
    QUESTIONS.forEach((q) => {
      const score = answers[q.id] || 3; // Default to neutral if somehow unanswered
      categories[q.category] += score;
    });
    return categories;
  };

  // Submit test to API
  const handleQuizSubmit = async () => {
    setDiagnosticStage("analyzing");
    setLoadingMsgIdx(0);

    const scoreDistribution = calculateScores();
    const totalScore = Object.values(scoreDistribution).reduce((a, b) => a + b, 0);

    try {
      const response = await fetch("/api/diagnose", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category,
          context: context.trim(),
          scores: scoreDistribution,
        }),
      });

      if (!response.ok) {
        throw new Error("Diagnosis API responded with an error");
      }

      const rawResult = await response.json();
      setAnalysisResult(rawResult);

      // Save to History Records
      const newRecord: HistoryRecord = {
        id: `rec_${Date.now()}`,
        date: new Date().toISOString(),
        category: category!,
        context: context.trim(),
        scores: scoreDistribution,
        totalScore,
        result: rawResult,
      };

      const updatedHistory = [newRecord, ...historyRecords];
      syncHistory(updatedHistory);

      setDiagnosticStage("result");
    } catch (error) {
      console.error("Failed to generate diagnostic evaluation:", error);
      alert("진단을 완료하는 도중 일시적인 네트워크 지연이 발생했거나, 서버 응답 오류가 생겼습니다. 다시 격려하며 제출을 부탁드립니다.");
      setDiagnosticStage("quiz");
    }
  };

  // Reset diagnostic questionnaire
  const handleResetDiagnostic = () => {
    setCategory(null);
    setContext("");
    setAnswers({});
    setAnalysisResult(null);
    setDiagnosticStage("intro");
    setActiveTab("home");
  };

  // Answer selections
  const handleAnswerSelected = (qId: number, score: number) => {
    setAnswers((prev) => ({ ...prev, [qId]: score }));
  };

  // Add journaling
  const handleAddJournal = (entryData: Omit<JournalEntry, "id" | "date">) => {
    const newEntry: JournalEntry = {
      id: `j_${Date.now()}`,
      date: new Date().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric"
      }),
      ...entryData,
    };
    const updatedEntries = [newEntry, ...journalEntries];
    syncJournals(updatedEntries);
  };

  // Delete journaling
  const handleDeleteJournal = (id: string) => {
    if (window.confirm("이 소중한 자각 일기 기록을 지우시겠습니까?")) {
      const filtered = journalEntries.filter((j) => j.id !== id);
      syncJournals(filtered);
    }
  };

  // Clear histories
  const handleClearHistory = () => {
    syncHistory([]);
  };

  const handleSelectHistoryRecord = (record: HistoryRecord) => {
    setCategory(record.category);
    setContext(record.context);
    setAnswers(record.scores); // Approximate
    setAnalysisResult(record.result);
    setDiagnosticStage("result");
    setActiveTab("home"); // Show it in the home view wrapper
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary antialiased font-sans flex flex-col selection:bg-brand-green/20 selection:text-text-primary">
      {/* Visual Top Accent bar using Sage Green */}
      <div className="h-0.5 bg-brand-green w-full" />

      {/* Modern Peaceful Header Navigation - Natural Tones Style */}
      <header className="sticky top-0 z-50 bg-bg-base/80 backdrop-blur-md border-b border-border-warm px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo Branding - Warm & Serif style */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={handleResetDiagnostic}>
            <div className="w-8 h-8 bg-brand-green rounded-full flex items-center justify-center text-white shadow-xs">
              <Sprout className="w-4.5 h-4.5" />
            </div>
            <div>
              <h1 className="text-xl font-serif italic font-bold tracking-tight text-text-primary leading-none">MindCare</h1>
              <span className="text-[10px] text-text-muted font-sans uppercase tracking-widest font-semibold block mt-1">학업 소진 & 스트레스 백신</span>
            </div>
          </div>

          {/* Navigation Links - Warm Tones */}
          <nav className="flex items-center gap-1.5 bg-bg-warm-tint p-1 rounded-xl border border-border-warm-light">
            <button
              onClick={() => { setActiveTab("home"); if (diagnosticStage === "quiz" || diagnosticStage === "analyzing") { handleResetDiagnostic(); } }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                activeTab === "home"
                  ? "bg-white text-text-primary shadow-xs font-bold border border-border-warm-light"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              id="tab-diagnostic"
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-brand-green" />
              <span>자가진단</span>
            </button>

            <button
              onClick={() => { setActiveTab("breathing"); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                activeTab === "breathing"
                  ? "bg-white text-text-primary shadow-xs font-bold border border-border-warm-light"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              id="tab-breathing"
            >
              <Wind className="w-3.5 h-3.5 text-brand-green" />
              <span>뇌 휴식 브리딩</span>
            </button>

            <button
              onClick={() => { setActiveTab("journal"); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                activeTab === "journal"
                  ? "bg-white text-text-primary shadow-xs font-bold border border-border-warm-light"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              id="tab-journal"
            >
              <PenTool className="w-3.5 h-3.5 text-brand-green" />
              <span>마음 성찰</span>
            </button>

            <button
              onClick={() => { setActiveTab("history"); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-tight transition-all flex items-center gap-1.5 ${
                activeTab === "history"
                  ? "bg-white text-text-primary shadow-xs font-bold border border-border-warm-light"
                  : "text-text-secondary hover:text-text-primary"
              }`}
              id="tab-history"
            >
              <Calendar className="w-3.5 h-3.5 text-brand-green" />
              <span>돌봄 이력</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-12">
        {/* VIEW 1: Home / Diagnostic Scales */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* STAGE: Intro Welcome Screen */}
            {diagnosticStage === "intro" && (
              <div className="space-y-8">
                {/* Immersive Welcome Hero - Natural Tones style */}
                <div className="text-center max-w-2xl mx-auto py-4 sm:py-6">
                  <div className="inline-flex items-center gap-2 bg-white border border-[#E8E2D6] rounded-full px-3 py-1.5 text-[11px] text-text-muted font-semibold tracking-wider uppercase mb-4 shadow-3xs">
                    <Heart className="w-3 h-3 text-brand-green fill-brand-green/30" />
                    마음을 달래는 마인드풀 캠퍼스
                  </div>
                  <h2 className="text-3xl sm:text-5xl font-serif text-text-primary tracking-tight leading-tight">
                    오늘 당신의 마음 날씨는<br />
                    어떤가요?
                  </h2>
                  <p className="text-xs sm:text-sm text-text-secondary mt-4 max-w-lg mx-auto leading-relaxed">
                    대학학습 심리학회의 다차원 탈진 척도를 정교하게 조율하여 설계한 자가 평가입니다. 
                    소진, 학업 회의감, 효능감을 치밀하게 측정하여, 차분한 휴식을 위한 힐링 기법과 AI 정서 처방을 경험하세요.
                  </p>
                </div>

                <IntroStep
                  category={category}
                  setCategory={setCategory}
                  context={context}
                  setContext={setContext}
                  onNext={() => setDiagnosticStage("quiz")}
                />
              </div>
            )}

            {/* STAGE: Quiz Running Screen */}
            {diagnosticStage === "quiz" && (
              <DiagnosticQuiz
                answers={answers}
                onAnswerSelected={handleAnswerSelected}
                onSubmit={handleQuizSubmit}
                onGoBackIntro={() => setDiagnosticStage("intro")}
              />
            )}

            {/* STAGE: Loading AI Therapist Analysis */}
            {diagnosticStage === "analyzing" && (
              <div className="bg-white rounded-[32px] border border-border-warm-light p-12 text-center max-w-md mx-auto space-y-6 shadow-sm min-h-[400px] flex flex-col justify-center items-center relative overflow-hidden">
                {/* Visual calming pulsing circles in Sage theme */}
                <div className="relative w-24 h-24 flex items-center justify-center mb-2">
                  <div className="absolute inset-0 rounded-full border-4 border-brand-green/10 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-2 rounded-full border-4 border-brand-green/20 animate-pulse" />
                  <div className="w-12 h-12 rounded-full bg-brand-green flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-serif font-bold text-text-primary">
                    AI 분석 상담사의 임상 리포트 조제 중
                  </h3>
                  <div className="h-10 flex items-center justify-center max-w-xs mx-auto">
                    <p className="text-xs text-text-secondary leading-relaxed animate-pulse">
                      {LOADING_MESSAGES[loadingMsgIdx]}
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-text-muted max-w-xs border-t border-border-warm-light pt-4 leading-relaxed">
                  마음의 템포를 잠시 늦추어 보세요. 들이쉬고 내쉬며 눈의 피로를 풀어봅니다.
                </p>
              </div>
            )}

            {/* STAGE: Report Results Dashboard */}
            {diagnosticStage === "result" && analysisResult && (
              <ReportDashboard
                category={category!}
                context={context}
                scores={calculateScores()}
                result={analysisResult}
                onReset={handleResetDiagnostic}
                onGoToBreathing={() => { setActiveTab("breathing"); }}
              />
            )}
          </div>
        )}

        {/* VIEW 2: Breathing Exercises Space */}
        {activeTab === "breathing" && <BreathingExercise />}

        {/* VIEW 3: Venting journal with CBT structures */}
        {activeTab === "journal" && (
          <MindJournal
            entries={journalEntries}
            onAddEntry={handleAddJournal}
            onDeleteEntry={handleDeleteJournal}
          />
        )}

        {/* VIEW 4: Historic Reports Trend */}
        {activeTab === "history" && (
          <SelfCareLogs
            records={historyRecords}
            onSelectRecord={handleSelectHistoryRecord}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>

      {/* Modern footer */}
      <footer className="bg-white border-t border-border-warm py-8 px-6 text-center mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-text-muted select-none">
          <div className="flex items-center gap-1.5">
            <Sprout className="w-4.5 h-4.5 text-brand-green" />
            <span className="font-semibold text-text-primary">마인드풀 캠퍼스 &middot; MindCare</span>
          </div>
          <p className="leading-snug font-serif italic text-right sm:text-left">
            &copy; 2026 Mindful Campus. 당신의 학업 여정이 조금 더 따뜻해질 수 있도록.
          </p>
        </div>
      </footer>
    </div>
  );
}

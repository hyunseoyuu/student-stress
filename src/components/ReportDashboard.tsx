import React, { useState } from "react";
import { DiagnosisResult, QuizScores, CategoryType } from "../types";
import { 
  Heart, Sparkles, Smile, Flame, CheckSquare, Activity, Compass, 
  RotateCcw, Wind, BookOpen, AlertCircle, RefreshCcw, HelpCircle, FileText, CheckCircle2 
} from "lucide-react";

interface ReportDashboardProps {
  category: CategoryType;
  context: string;
  scores: QuizScores;
  result: DiagnosisResult;
  onReset: () => void;
  onGoToBreathing: () => void;
}

export default function ReportDashboard({ category, context, scores, result, onReset, onGoToBreathing }: ReportDashboardProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const calculateTotalScore = () => {
    return scores.exhaustion + scores.cynicism + scores.efficacy + scores.physical;
  };

  const totalScore = calculateTotalScore();

  const getRiskMetadata = (score: number) => {
    if (score <= 40) {
      return {
        label: "원만형 (Low Risk)",
        description: "전체 신체 조작과 인지 상태가 안락하고 평안합니다. 학업 능률을 지켜내며 건강한 일상의 균형을 아주 훌륭히 유지하고 계십니다.",
        colorClass: "bg-[#E8F0E4]/70 text-[#3E362E] border-[#7D8F69]/30",
        badgeClass: "bg-[#7D8F69] text-white",
        glowClass: "shadow-xs",
        icon: <Smile className="w-8 h-8 text-[#7D8F69]" />,
      };
    } else if (score <= 60) {
      return {
        label: "주의 단계 (Mild Burnout)",
        description: "학업 피로가 마모되지 않고 조금씩 누적 중인 환기 상태입니다. 회의감과 일시적 나태가 올라올 수 있으니 내 마음의 템포를 자각해 주세요.",
        colorClass: "bg-[#F5F1E9] text-[#3E362E] border-[#E8E2D6]",
        badgeClass: "bg-[#A4907C] text-white",
        glowClass: "shadow-xs",
        icon: <Activity className="w-8 h-8 text-[#A4907C]" />,
      };
    } else if (score <= 80) {
      return {
        label: "소진 누적 경고 (Moderate Burnout)",
        description: "만성 피로와 미약한 우울감, 과업 학업 회의가 몰려와 정서적 늪에 갇히기 직전입니다. 지금 당장 인위적인 연차 브레이크를 동반해야 할 시점입니다.",
        colorClass: "bg-[#F2EDE4] text-[#3E362E] border-[#E8E2D6]",
        badgeClass: "bg-[#7A7167] text-white",
        glowClass: "shadow-xs",
        icon: <AlertCircle className="w-8 h-8 text-[#7A7167]" />,
      };
    } else {
      return {
        label: "고위험 정서적 빈곤군 (Severe Burnout)",
        description: "체력과 정신력이 완전 마모에 달해 다수의 신체 불균형 신호를 수반하고 있습니다. 일단 공부를 무조건 멈추고 며칠 동안 절대적인 휴식 수면에 전념하시기를 간청합니다.",
        colorClass: "bg-[#F5F1E9]/80 border-t-4 border-t-[#7D8F69] text-[#3E362E] border-[#E8E2D6]",
        badgeClass: "bg-[#3E362E] text-white",
        glowClass: "shadow-xs",
        icon: <Flame className="w-8 h-8 text-[#7D8F69] animate-pulse" />,
      };
    }
  };

  const risk = getRiskMetadata(totalScore);

  const handleCopySlogan = () => {
    navigator.clipboard.writeText(result.dailySlogan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Risk Header Overview Banner */}
      <div className={`p-8 rounded-[32px] border ${risk.colorClass} shadow-3xs flex flex-col md:flex-row items-center md:items-start gap-6`}>
        <div className="p-4 bg-white rounded-full shadow-3xs shrink-0">{risk.icon}</div>
        <div className="space-y-3.5 text-center md:text-left flex-1">
          <div className="flex flex-wrap gap-2 items-center justify-center md:justify-start">
            <span className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${risk.badgeClass} font-mono`}>
              Burnout Risk Index: {totalScore} / 100
            </span>
            <span className="text-[11px] bg-white text-text-primary font-semibold px-3 py-1 rounded-full border border-border-warm-light">
              대상: {category}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-serif text-text-primary leading-tight font-bold">{risk.label}</h2>
          <p className="text-xs md:text-sm leading-relaxed text-text-secondary max-w-2xl">{risk.description}</p>
        </div>
      </div>

      {/* Grid of Scores Section */}
      <div className="bg-white p-8 rounded-[32px] border border-border-warm-light shadow-3xs">
        <h3 className="text-sm font-bold text-[#3E362E] mb-6 flex items-center gap-1.5 border-b border-border-warmpb-3 pb-3">
          <FileText className="w-4.5 h-4.5 text-[#7D8F69]" />
          자가진단 세부 지표 분석 (영역별 25점 만점)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
          {/* Exhaustion Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary flex items-center gap-1">학업 소진 (Emotional Exhaustion)</span>
              <span className="font-bold text-[#A4907C] font-mono">{scores.exhaustion} / 25</span>
            </div>
            <div className="w-full h-2.5 bg-bg-warm-tint rounded-full overflow-hidden border border-border-warm-light/20">
              <div className="h-full bg-[#A4907C] rounded-full" style={{ width: `${(scores.exhaustion / 25) * 100}%` }} />
            </div>
          </div>

          {/* Cynicism Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary flex items-center gap-1">학업 냉소 (Cynicism)</span>
              <span className="font-bold text-[#7A7167] font-mono">{scores.cynicism} / 25</span>
            </div>
            <div className="w-full h-2.5 bg-bg-warm-tint rounded-full overflow-hidden border border-border-warm-light/20">
              <div className="h-full bg-[#7A7167] rounded-full" style={{ width: `${(scores.cynicism / 25) * 100}%` }} />
            </div>
          </div>

          {/* Efficacy Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary flex items-center gap-1">효능감 저하 (Reduced Efficacy)</span>
              <span className="font-bold text-[#7D8F69] font-mono">{scores.efficacy} / 25</span>
            </div>
            <div className="w-full h-2.5 bg-bg-warm-tint rounded-full overflow-hidden border border-border-warm-light/20">
              <div className="h-full bg-[#7D8F69] rounded-full" style={{ width: `${(scores.efficacy / 25) * 100}%` }} />
            </div>
          </div>

          {/* Physical Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary flex items-center gap-1">스트레스 신체 증상 (Physical Symptoms)</span>
              <span className="font-bold text-[#6B7B59] font-mono">{scores.physical} / 25</span>
            </div>
            <div className="w-full h-2.5 bg-bg-warm-tint rounded-full overflow-hidden border border-border-warm-light/20">
              <div className="h-full bg-[#6B7B59] rounded-full" style={{ width: `${(scores.physical / 25) * 100}%` }} />
            </div>
          </div>
        </div>

        {context && (
          <div className="mt-6 bg-bg-warm-tint p-4 rounded-xl border border-border-warm-light">
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest block mb-1">사용자가 직접 서술한 일상 애로사항</span>
            <p className="text-xs text-text-secondary leading-relaxed italic">&ldquo;{context}&rdquo;</p>
          </div>
        )}
      </div>

      {/* AI Clinical Diagnosis Summary */}
      <div className="bg-white p-8 rounded-[32px] border border-border-warm-light shadow-3xs relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="w-5 h-5 text-brand-green/70 opacity-60 animate-pulse" />
        </div>
        <h3 className="text-sm font-bold text-[#3E362E] mb-1 flex items-center gap-1.5 font-serif italic">
          AI 심동케어 심리학자의 종합 평가
        </h3>
        <p className="text-[11px] text-[#A4907C] mb-5 uppercase tracking-wide">공개된 심층 인지 행동 기법에 조응하는 맞춤 분석 보고</p>

        <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-sans whitespace-pre-line bg-[#F5F1E9] p-6 rounded-2xl border border-border-warm-light">
          {result.summary}
        </p>
      </div>

      {/* AI Sub-Score Deep Dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exhaustion Card */}
        <div className="bg-white border border-border-warm-light rounded-2xl p-6 shadow-3xs hover:border-brand-green/30 transition-all">
          <span className="text-[9px] bg-[#F5F1E9] text-[#A4907C] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">Emotional Exhaustion</span>
          <h4 className="text-sm font-bold text-text-primary mt-3 mb-1.5">소진 상태 정밀 분석</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{result.exhaustionAnalysis}</p>
        </div>

        {/* Cynicism Card */}
        <div className="bg-white border border-border-warm-light rounded-2xl p-6 shadow-3xs hover:border-brand-green/30 transition-all">
          <span className="text-[9px] bg-[#F2EDE4] text-[#7A7167] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">Cynicism & Scepticism</span>
          <h4 className="text-sm font-bold text-text-primary mt-3 mb-1.5">회의감과 냉소 발생 원인</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{result.cynicismAnalysis}</p>
        </div>

        {/* Efficacy Card */}
        <div className="bg-white border border-border-warm-light rounded-2xl p-6 shadow-3xs hover:border-brand-green/30 transition-all">
          <span className="text-[9px] bg-[#E8F0E4] text-[#7D8F69] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">Academic Self-Efficacy</span>
          <h4 className="text-sm font-bold text-text-primary mt-3 mb-1.5">성취 효능감 마모 분석</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{result.efficacyAnalysis}</p>
        </div>

        {/* Physical Card */}
        <div className="bg-white border border-border-warm-light rounded-2xl p-6 shadow-3xs hover:border-brand-green/30 transition-all">
          <span className="text-[9px] bg-[#E8F0E4] text-[#6B7B59] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider font-mono">Somatic Symptoms</span>
          <h4 className="text-sm font-bold text-text-primary mt-3 mb-1.5">신체 긴장 완화 기제</h4>
          <p className="text-xs text-text-secondary leading-relaxed">{result.physicalAnalysis}</p>
        </div>
      </div>

      {/* Target Category Advice Block - Forest Sage theme match! */}
      <div className="bg-[#7D8F69] text-white p-8 rounded-[32px] relative shadow-lg shadow-[#7d8f6920] overflow-hidden">
        <BookOpen className="w-24 h-24 text-white absolute -bottom-5 -right-5 rotate-12 opacity-15 pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <span className="text-[10px] uppercase font-mono font-bold text-[#E8F0E4] tracking-widest block">
            {category} 환경 수강생 특화 전략 (Target Strategy)
          </span>
          <h3 className="text-lg sm:text-xl font-serif text-white font-bold">
            안도와 환기를 선사하는 인지 기조 조언
          </h3>
          <p className="text-xs text-[#E8F0E4] leading-relaxed max-w-xl">
            {result.categorySpecificAdvice}
          </p>
        </div>
      </div>

      {/* Clickable Immediate Solution Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-[#3E362E] flex items-center gap-1.5 font-serif italic">
          <Wind className="w-4.5 h-4.5 text-brand-green" />
          AI 추천 즉각 전실 마인드 웰니스 기법
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.actionSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white border border-border-warm-light hover:border-brand-green p-6 rounded-2xl text-left transition-all hover:bg-bg-base/40 flex flex-col justify-between hover:shadow-3xs"
            >
              <div>
                <span className="text-[9px] uppercase font-bold text-brand-green bg-[#E8F0E4] px-2.5 py-1 rounded-md">
                  {step.category || "자가 마인드 셋"}
                </span>
                <h4 className="text-sm font-semibold text-text-primary mt-3 leading-snug">
                  {step.title}
                </h4>
                <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Long Term Systems List */}
      <div className="bg-white p-8 rounded-[32px] border border-border-warm-light shadow-3xs">
        <h3 className="text-sm font-bold text-[#3E362E] mb-5 flex items-center gap-1.5 pb-2 border-b border-border-warm-light">
          <CheckSquare className="w-4.5 h-4.5 text-brand-green" />
          습관 재설정을 위한 중장기 인지 균형 가이드라인
        </h3>

        <ul className="space-y-4 text-xs text-text-secondary">
          {result.longTermTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <CheckCircle2 className="w-4.5 h-4.5 text-brand-green shrink-0 mt-0.5" />
              <p className="leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Encouragement Slogan shareable block */}
      <div className="bg-[#F5F1E9] border border-border-warm/65 rounded-[24px] p-8 text-center flex flex-col items-center">
        <Heart className="w-6 h-6 text-brand-green fill-brand-green/30 mb-2 animate-pulse" />
        <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest mb-2 block">오늘 하루 나를 견뎌낼 응원의 한 마디</span>
        <h4 className="text-base sm:text-lg font-serif italic text-text-primary leading-relaxed max-w-lg mb-5 font-bold">
          &ldquo;{result.dailySlogan}&rdquo;
        </h4>

        <div className="flex gap-2">
          <button
            onClick={handleCopySlogan}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold select-none transition-all outline-none cursor-pointer ${
              copied ? "bg-text-primary text-white" : "bg-white border border-border-warm text-text-secondary hover:text-text-primary hover:bg-bg-warm-tint/50 shadow-3xs"
            }`}
          >
            {copied ? "복사되었습니다 ✓" : "한마디 복사하기"}
          </button>
        </div>
      </div>

      {/* Bottom Nav Links */}
      <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center py-4">
        <button
          onClick={onGoToBreathing}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl bg-brand-green hover:bg-brand-green-hover text-white font-semibold text-xs transition-colors shadow-xs cursor-pointer"
        >
          <Wind className="w-4 h-4" /> 60초 브리딩 타이머로 머리 비우기
        </button>

        <button
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 rounded-xl border border-border-warm bg-white hover:bg-[#F2EDE4]/30 text-text-secondary hover:text-text-primary font-semibold text-xs transition-colors shadow-3xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> 대시보드로 돌아가 새 진단하기
        </button>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Question } from "../types";
import { QUESTIONS, LIKERT_OPTIONS } from "../data";
import { ArrowLeft, ArrowRight, HelpCircle, ChevronRight, Activity, Smile, Frown, Check } from "lucide-react";

interface DiagnosticQuizProps {
  answers: Record<number, number>;
  onAnswerSelected: (qId: number, score: number) => void;
  onSubmit: () => void;
  onGoBackIntro: () => void;
}

export default function DiagnosticQuiz({ answers, onAnswerSelected, onSubmit, onGoBackIntro }: DiagnosticQuizProps) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const currentQuestion = QUESTIONS[currentIndex];
  const totalQuestions = QUESTIONS.length;
  const progressPercentage = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  // Helper to determine active category title and description
  const getCategoryMeta = (category: string) => {
    switch (category) {
      case "exhaustion":
        return {
          title: "학업 소진 (Emotional Exhaustion)",
          colorClass: "text-[#A4907C] bg-[#F5F1E9] border-[#E8E2D6]",
          desc: "학업으로 인해 신체적, 정신적으로 에너지가 고갈된 피로 지수를 측정합니다.",
        };
      case "cynicism":
        return {
          title: "학업 냉소 (Cynicism)",
          colorClass: "text-[#7A7167] bg-[#F2EDE4] border-[#E8E2D6]",
          desc: "공부의 의미와 가치를 잃고 마음속 거리감을 두려는 무관심 상태를 인지합니다.",
        };
      case "efficacy":
        return {
          title: "효능감 저하 (Reduced Efficacy)",
          colorClass: "text-[#7D8F69] bg-[#E8F0E4] border-[#E8E2D6]",
          desc: "나의 효율성 저하나 지속되는 두려움, 위축감 수준을 분석합니다.",
        };
      case "physical":
        return {
          title: "스트레스 신체 증상 (Physical Symptoms)",
          colorClass: "text-[#4A443F] bg-[#F5F1E9] border-[#E8E2D6]",
          desc: "몸에 새겨진 피로 흔적(근육 긴장, 불면, 소화 장애 및 과각성)을 판정합니다.",
        };
      default:
        return {
          title: "일반 상태 진단",
          colorClass: "text-text-secondary bg-bg-warm-tint border-border-warm",
          desc: "학습 상태의 정밀 지표를 살핍니다.",
        };
    }
  };

  const meta = getCategoryMeta(currentQuestion.category);
  const selectedScore = answers[currentQuestion.id] || null;

  const handleOptionClick = (value: number) => {
    onAnswerSelected(currentQuestion.id, value);

    // Auto-advance with visual buffer
    if (currentIndex < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 250);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      onGoBackIntro();
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Check if all questions are completed up to now
  const allAnswered = QUESTIONS.every((q) => answers[q.id] !== undefined);

  return (
    <div className="bg-white rounded-[32px] border border-border-warm-light p-6 md:p-10 shadow-3xs max-w-2xl mx-auto">
      {/* Top Header & Back Button */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors outline-none cursor-pointer"
          id="btn-quiz-prev"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-brand-green" /> 이전 질문
        </button>

        <div className="text-xs font-mono font-bold text-text-muted">
          질문 {currentIndex + 1} / {totalQuestions}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-bg-warm-tint rounded-full overflow-hidden mb-8 border border-border-warm-light/40">
        <div
          className="h-full bg-brand-green rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Category Indicator Tag */}
      <div className={`inline-flex items-center gap-2 border px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 ${meta.colorClass}`}>
        <Activity className="w-3.5 h-3.5" />
        {meta.title}
      </div>

      {/* Description */}
      <p className="text-xs text-text-secondary mb-6 leading-relaxed">
        {meta.desc}
      </p>

      {/* Actual Question */}
      <div className="min-h-24 flex items-center mb-8">
        <h3 className="text-lg sm:text-2xl font-serif text-text-primary leading-relaxed">
          &ldquo;{currentQuestion.text}&rdquo;
        </h3>
      </div>

      {/* Likert Scale Buttons (Vertical customized cards) */}
      <div className="flex flex-col gap-3 mb-8">
        {LIKERT_OPTIONS.map((option) => {
          const isSelected = selectedScore === option.value;
          return (
            <button
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`flex items-center justify-between px-6 py-4.5 rounded-2xl border text-left transition-all outline-none cursor-pointer ${
                isSelected
                  ? "border-brand-green bg-bg-base text-text-primary font-semibold"
                  : "border-border-warm-light bg-white text-text-secondary hover:bg-bg-warm-tint/50 hover:border-border-warm"
              }`}
              id={`quiz-option-${option.value}`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-5.5 h-5.5 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-brand-green border-transparent text-white"
                      : "border-border-warm bg-white text-text-muted"
                  }`}
                >
                  {isSelected ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : option.value}
                </div>
                <span className="text-sm font-medium">{option.label}</span>
              </div>

              {/* Little visual accent */}
              <span className="text-[10px] font-mono text-text-muted opacity-80 bg-bg-warm-tint/65 px-2.5 py-1 rounded-md border border-border-warm-light/40">
                {option.value === 1 && "거의 없음"}
                {option.value === 3 && "보통"}
                {option.value === 5 && "극단적 수준"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Manual advance control panel */}
      <div className="flex items-center justify-between pt-6 border-t border-border-warm">
        <div className="flex gap-2">
          {QUESTIONS.map((q, idx) => (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                idx === currentIndex
                  ? "bg-text-primary scale-125"
                  : answers[q.id] !== undefined
                  ? "bg-brand-green/75"
                  : "bg-border-warm hover:bg-[#A4907C]/40"
              }`}
            />
          ))}
        </div>

        {currentIndex === totalQuestions - 1 ? (
          <button
            onClick={onSubmit}
            disabled={!allAnswered}
            className={`flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              allAnswered
                ? "bg-brand-green text-white hover:bg-brand-green-hover cursor-pointer"
                : "bg-border-warm text-text-muted cursor-not-allowed"
            }`}
            id="btn-quiz-submit"
          >
            번아웃 분석 결과보기 <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer outline-none"
            id="btn-quiz-next"
          >
            다음 질문 <ArrowRight className="w-3.5 h-3.5 text-brand-green" />
          </button>
        )}
      </div>
    </div>
  );
}

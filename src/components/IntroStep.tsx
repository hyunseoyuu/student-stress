import React from "react";
import { CategoryType } from "../types";
import { GraduationCap, School, BookOpen, BrainCircuit, HeartHandshake, Compass, Sparkles, CheckCircle2 } from "lucide-react";

interface IntroStepProps {
  category: CategoryType | null;
  setCategory: (cat: CategoryType) => void;
  context: string;
  setContext: (text: string) => void;
  onNext: () => void;
}

const CATEGORY_ITEMS: { value: CategoryType; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    value: "중학생",
    label: "중학생",
    icon: <School className="w-5 h-5" />,
    desc: "기초 학업 형성기와 진로 탐색 과정에서의 스트레스 대비",
  },
  {
    value: "고등학생",
    label: "고등학생",
    icon: <GraduationCap className="w-5 h-5" />,
    desc: "내신 성적 관리, 수능 준비 및 진학 압박 케어",
  },
  {
    value: "수험생/고시생",
    label: "수험생/고시생",
    icon: <BookOpen className="w-5 h-5" />,
    desc: "재수, 임용, 공무원, 전문직 시험 등 장기 격리 스트레스",
  },
  {
    value: "대학생",
    label: "대학생",
    icon: <BrainCircuit className="w-5 h-5" />,
    desc: "취업 준비 두려움, 평점 경쟁 및 전공 적응 피로",
  },
  {
    value: "대학원생",
    label: "대학원생",
    icon: <HeartHandshake className="w-5 h-5" />,
    desc: "논문 심사, 지도교수 관계, 성과 압박 및 진로 위기",
  },
  {
    value: "기타 학습자",
    label: "기타 학습자",
    icon: <Compass className="w-5 h-5" />,
    desc: "자격증, 어학, 이직 등 계속되는 학습 레이스 스트레스",
  },
];

export default function IntroStep({ category, setCategory, context, setContext, onNext }: IntroStepProps) {
  return (
    <div className="bg-white rounded-[32px] border border-border-warm-light p-6 md:p-10 shadow-3xs">
      <div className="max-w-2xl mx-auto">
        {/* Banner with Icon */}
        <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-green bg-bg-warm-tint border border-border-warm-light px-3 py-1.5 rounded-full flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-brand-green" /> Step 1. 학습 환경 유형 파악
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif text-text-primary text-center md:text-left leading-normal">
          어떤 학업 환경에 머무르고 계시나요?
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-3 text-center md:text-left leading-relaxed">
          대상의 유형에 따라 스트레스의 근원과 처방 기전이 다릅니다. 현재 처한 학업 세션을 기록해주시면 더 완벽하고 치밀한 개인 맞춤 보고서를 구성해 드립니다.
        </p>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          {CATEGORY_ITEMS.map((item) => {
            const isSelected = category === item.value;
            return (
              <button
                key={item.value}
                onClick={() => setCategory(item.value)}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all outline-none ${
                  isSelected
                    ? "border-brand-green bg-bg-base/80 shadow-xs"
                    : "border-border-warm-light bg-white hover:bg-bg-warm-tint/50 hover:border-border-warm"
                }`}
                id={`cat-${item.value}`}
              >
                <div
                  className={`p-3 rounded-xl shrink-0 transition-all ${
                    isSelected ? "bg-brand-green text-white" : "bg-bg-warm-tint text-text-secondary border border-border-warm-light"
                  }`}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className={`text-sm font-semibold transition-colors ${isSelected ? "text-text-primary" : "text-text-secondary"}`}>
                    {item.label}
                  </h4>
                  <p className="text-xs text-text-muted mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Written context with text area */}
        <div className="mt-8 pt-6 border-t border-border-warm">
          <label className="block text-sm font-semibold text-text-primary flex items-center gap-1.5 mb-2">
            요즘 나를 가장 조급하게 하거나 지치게 만드는 상황은 무엇인가요?
          </label>
          <p className="text-xs text-text-muted mb-3 leading-relaxed">
            구체적일수록(예: &quot;졸업 논문 패스가 너무 불확실해요&quot;, &quot;재수 학원 모의고사 압박이 심해요&quot; 등) 본 자가진단 후 산출될 힐링 처방전이 더욱 밀접하고 소름돋게 따뜻한 솔루션을 제안합니다.
          </p>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="상황이나 힘든 점들을 자유롭게 적어보세요. (예: 다가오는 시험 압박, 완벽을 기해야 마음에 차는 강박증 등...)"
            className="w-full h-32 p-4 text-sm border border-border-warm rounded-2xl focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 focus:outline-none bg-bg-base/20 focus:bg-white transition-all placeholder:text-text-muted font-sans"
            maxLength={600}
            id="input-user-context"
          />
          <div className="text-right text-[11px] text-text-muted mt-1 font-mono">
            {context.length} / 600자
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-bg-warm-tint border border-border-warm-light p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
            <span>총 20문항 대기 중 &middot; 소요 시간 3분 &middot; AI 번아웃 진단 지수 산출</span>
          </div>
          <button
            onClick={onNext}
            disabled={!category}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
              category
                ? "bg-brand-green text-white hover:bg-brand-green-hover cursor-pointer"
                : "bg-border-warm text-text-muted cursor-not-allowed"
            }`}
            id="btn-start-quiz"
          >
            본격 자가진단 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

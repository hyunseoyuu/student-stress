import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Wind, Heart, Sparkles, Volume2, ShieldCheck } from "lucide-react";

type BreathPhase = "inhale" | "hold1" | "exhale" | "hold2";

interface PhaseConfig {
  label: string;
  subText: string;
  duration: number; // 4 seconds
  colorClass: string;
  ringScale: string;
}

const PHASES: Record<BreathPhase, PhaseConfig> = {
  inhale: {
    label: "들이마쉬기 (Inhale)",
    subText: "가슴 가득 맑은 대지의 생기를 천천히 채워보세요",
    duration: 4,
    colorClass: "bg-brand-green",
    ringScale: "scale-125 bg-[#E8F0E4]/60 border-brand-green/30",
  },
  hold1: {
    label: "머금기 (Hold)",
    subText: "편안함이 온몸의 구석구석에 깃들도록 조용히 멈춥니다",
    duration: 4,
    colorClass: "bg-[#A4907C]",
    ringScale: "scale-125 bg-[#F5F1E9]/80 border-[#A4907C]/30",
  },
  exhale: {
    label: "내쉬기 (Exhale)",
    subText: "마음 속 무겁게 가라앉아 있던 학업 압박과 잡념을 완전히 내보냅니다",
    duration: 4,
    colorClass: "bg-[#7D8F69]",
    ringScale: "scale-95 bg-[#E8F0E4]/30 border-[#7D8F69]/20",
  },
  hold2: {
    label: "비우기 (Hold)",
    subText: "완전히 비워진 고요하고 은은한 여백 상태를 가만히 누려보세요",
    duration: 4,
    colorClass: "bg-[#7A7167]",
    ringScale: "scale-95 bg-[#F2EDE4]/50 border-[#7A7167]/20",
  },
};

export default function BreathingExercise() {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phase, setPhase] = useState<BreathPhase>("inhale");
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [cyclesCompleted, setCyclesCompleted] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [guideSound, setGuideSound] = useState<string>("off"); // for simulation of calming background vibe

  const animationFrameRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            // Next phase logic
            setPhase((currentPhase) => {
              let nextPhase: BreathPhase;
              if (currentPhase === "inhale") {
                nextPhase = "hold1";
              } else if (currentPhase === "hold1") {
                nextPhase = "exhale";
              } else if (currentPhase === "exhale") {
                nextPhase = "hold2";
              } else {
                nextPhase = "inhale";
                setCyclesCompleted((c) => c + 1);
              }
              return nextPhase;
            });
            setTotalSeconds((t) => t + 4);
            return 4; // Reset duration to 4 seconds
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setPhase("inhale");
    setSecondsLeft(4);
    setCyclesCompleted(0);
    setTotalSeconds(0);
  };

  const getPercentage = () => {
    return ((4 - secondsLeft) / 4) * 100;
  };

  const activePhase = PHASES[phase];

  return (
    <div className="bg-white rounded-[32px] border border-border-warm-light p-6 md:p-10 shadow-3xs max-w-2xl mx-auto flex flex-col items-center">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="w-5 h-5 text-brand-green animate-pulse" />
        <span className="text-xs font-semibold uppercase tracking-widest text-[#7D8F69] bg-[#E8F0E4] border border-[#7D8F69]/10 px-3 py-1 rounded-full">
          Box Breathing Space
        </span>
      </div>

      <div className="text-center max-w-md mb-8">
        <h2 className="text-xl sm:text-2xl font-serif text-text-primary">
          60초 뇌 휴식 공간 : 박스 브리딩
        </h2>
        <p className="text-xs sm:text-sm text-text-secondary mt-2">
          미 해군 특수부대(Navy SEALs)와 극도의 집중력을 요구하는 수험생들이 신체적 과각성을 진정시키기 위해 동원하는 과학적인 자율신경 조율 호흡법입니다.
        </p>
      </div>

      {/* Visual Breathing Circle */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center mb-8">
        {/* Calming expanding back-glow */}
        <div
          className={`absolute inset-0 rounded-full border-2 transition-all duration-[4000ms] ease-in-out ${activePhase.ringScale}`}
        />

        {/* Outer progress ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="44%"
            className="stroke-border-warm fill-none"
            strokeWidth="4"
          />
          {isActive && (
            <circle
              cx="50%"
              cy="50%"
              r="44%"
              className="stroke-brand-green/80 fill-none transition-all duration-1000 ease-linear"
              strokeWidth="5"
              strokeDasharray={`${2 * Math.PI * 115}`} // approximately
              strokeDashoffset={`${2 * Math.PI * 115 * (1 - getPercentage() / 100)}`}
              strokeLinecap="round"
            />
          )}
        </svg>

        {/* Center core */}
        <div className="z-10 flex flex-col items-center justify-center p-6 text-center">
          <div className="flex gap-1.5 mb-1.5 justify-center">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full border transition-all duration-300 ${
                  (phase === "inhale" && step === 1) ||
                  (phase === "hold1" && step === 2) ||
                  (phase === "exhale" && step === 3) ||
                  (phase === "hold2" && step === 4)
                    ? `border-transparent ${activePhase.colorClass} scale-125 shadow-3xs`
                    : "border-border-warm bg-white"
                }`}
              />
            ))}
          </div>

          <div className="h-10 flex items-center justify-center">
            <span className="text-4xl font-serif font-bold text-text-primary font-mono">
              {secondsLeft}s
            </span>
          </div>

          <span className="text-[11px] text-text-muted mt-2 tracking-wide font-medium">
            {phase === "inhale" && "천천히 들이마십니다"}
            {phase === "hold1" && "편안히 머금습니다"}
            {phase === "exhale" && "조용히 마음을 다해 내쉽니다"}
            {phase === "hold2" && "여유의 여백을 둡니다"}
          </span>
        </div>
      </div>

      {/* Breathing Guide text banner */}
      <div className="h-16 text-center max-w-sm mb-6 flex flex-col justify-center">
        <h4 className="text-base font-bold text-text-primary transition-colors duration-500 font-serif">
          {activePhase.label}
        </h4>
        <p className="text-xs text-text-secondary mt-1 leading-snug">
          {activePhase.subText}
        </p>
      </div>

      {/* Secondary micro stats */}
      <div className="w-full grid grid-cols-2 gap-4 border-y border-border-warm py-4 mb-6 max-w-md">
        <div className="text-center border-r border-border-warm">
          <span className="block text-[10px] uppercase font-bold text-text-muted tracking-widest">
            누적 호흡 주기
          </span>
          <span className="text-lg font-bold text-text-primary font-mono flex items-center justify-center gap-1 mt-1">
            <Sparkles className="w-4 h-4 text-[#A4907C]" />
            {cyclesCompleted} <span className="text-xs text-text-muted text-sans font-normal">회</span>
          </span>
        </div>
        <div className="text-center">
          <span className="block text-[10px] uppercase font-bold text-text-muted tracking-widest">
            총 완화 시간
          </span>
          <span className="text-lg font-bold text-text-primary font-mono flex items-center justify-center gap-1 mt-1">
            <Heart className="w-4 h-4 text-[#7D8F69]" />
            {totalSeconds} <span className="text-xs text-text-muted text-sans font-normal">초</span>
          </span>
        </div>
      </div>

      {/* Controllers */}
      <div className="flex flex-wrap gap-3.5 justify-center items-center w-full max-w-md">
        <button
          onClick={toggleTimer}
          className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all shadow-sm outline-none cursor-pointer ${
            isActive
              ? "bg-[#F5F1E9] text-[#7A7167] border border-[#E8E2D6] hover:bg-[#F2EDE4]"
              : "bg-brand-green text-white hover:bg-brand-green-hover"
          }`}
          id="btn-breathing-toggle"
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" /> 일시정지
            </>
          ) : (
            <>
              <Play className="w-4 h-4 text-white" /> 시작하기
            </>
          )}
        </button>

        <button
          onClick={resetTimer}
          className="flex items-center gap-1.5 px-5 py-3 rounded-full text-[#7A7167] bg-[#F2EDE4]/60 hover:bg-[#F2EDE4] border border-[#E8E2D6]/40 transition-all font-bold text-sm outline-none cursor-pointer shadow-3xs"
          id="btn-breathing-reset"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#7A7167]" /> 초기화
        </button>
      </div>

      {/* Simulated Calming Soundscapes Selection */}
      <div className="mt-8 pt-6 border-t border-border-warm w-full max-w-md">
        <div className="flex items-center justify-between mb-3 text-xs font-semibold text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-text-muted" />
            마음 안정의 음향 사운드스케이프 (가상)
          </span>
          {guideSound !== "off" && (
            <span className="text-[10px] text-brand-green bg-[#E8F0E4] px-2 py-0.5 rounded font-mono animate-pulse font-bold">
              이어폰 권장
            </span>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {["off", "forest", "rain", "zen"].map((sound) => {
            const labels: Record<string, string> = {
              off: "무음",
              forest: "숲속 소리",
              rain: "가을 빗소리",
              zen: "불교 명상",
            };
            return (
              <button
                key={sound}
                onClick={() => setGuideSound(sound)}
                className={`py-2 px-2 text-[11px] font-medium rounded-xl border transition-all text-center cursor-pointer outline-none ${
                  guideSound === sound
                    ? "bg-[#E8F0E4] border-[#7D8F69] text-[#7D8F69] font-bold"
                    : "bg-white border-border-warm-light text-text-secondary hover:bg-bg-warm-tint/50"
                }`}
              >
                {labels[sound]}
              </button>
            );
          })}
        </div>
        {guideSound !== "off" && (
          <p className="text-[11px] text-[#7D8F69] bg-[#E8F0E4]/60 border border-[#7D8F69]/25 rounded-xl p-3 mt-3 text-center flex items-center justify-center gap-1.5 leading-relaxed">
            <Wind className="w-4 h-4 text-[#7D8F69] shrink-0" />
            선택한 힐링 분위기를 머릿속 깊은 곳으로 그리면서 4초의 우주 흐름을 온전히 들이쉬고 내쉬며 안정감을 충전해 보세요.
          </p>
        )}
      </div>
    </div>
  );
}

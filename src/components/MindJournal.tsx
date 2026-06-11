import React, { useState, useEffect } from "react";
import { JournalEntry } from "../types";
import { PenTool, Scroll, Trash2, Heart, Smile, Sparkles, AlertCircle, Quote } from "lucide-react";

interface MindJournalProps {
  entries: JournalEntry[];
  onAddEntry: (entry: Omit<JournalEntry, "id" | "date">) => void;
  onDeleteEntry: (id: string) => void;
}

const THERAPY_QUOTES = [
  "공부하는 도중 생기는 모든 불확실함을 통제할 수는 없습니다. 통제할 수 있는 유일한 것은 오늘 하루 나 자신에게 건넬 친절함뿐입니다.",
  "학업의 속도는 다른 누구도 아닌 바로 나 자신의 계절에 어울려야 합니다. 늦깎이 꽃이 더 넓은 향을 전하기도 합니다.",
  "완벽주의라는 무거운 짐을 잠시 침대 머리에 내려놓으세요. 완벽이 아니라 '끝내는 경험'들이 쌓여 점진적인 회복을 낳아줍니다.",
  "오늘 목표한 단어를 다 외우지 못했더라도, 자괴감 대신 '그래도 버텨준 나'를 위해 차가운 물 한 잔과 마인드 클렌즈를 권하세요.",
  "논문이나 연구, 책 속에 파묻혀 정작 나를 지탱해주는 귀중한 숨결을 무시해오진 않았나요? 지금 살아있음에 감사를 건냅니다.",
];

export default function MindJournal({ entries, onAddEntry, onDeleteEntry }: MindJournalProps) {
  const [stressor, setStressor] = useState<string>("");
  const [lettingGo, setLettingGo] = useState<string>("");
  const [gratitude, setGratitude] = useState<string>("");
  const [quoteIdx, setQuoteIdx] = useState<number>(0);
  const [showEncouragement, setShowEncouragement] = useState<boolean>(false);

  useEffect(() => {
    // Pick daily quote randomly
    const randomIdx = Math.floor(Math.random() * THERAPY_QUOTES.length);
    setQuoteIdx(randomIdx);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stressor.trim() || !lettingGo.trim() || !gratitude.trim()) {
      alert("모든 물음들의 답변을 적어주셔야 마음에 기포를 얹지 않고 성찰할 수 있습니다.");
      return;
    }

    onAddEntry({
      stressor: stressor.trim(),
      lettingGo: lettingGo.trim(),
      gratitude: gratitude.trim(),
    });

    // Reset fields
    setStressor("");
    setLettingGo("");
    setGratitude("");

    setShowEncouragement(true);
    setTimeout(() => {
      setShowEncouragement(false);
    }, 6000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Inspirational Quote */}
      <div className="bg-[#F5F1E9] border border-border-warm rounded-[24px] p-6 text-center flex flex-col items-center relative overflow-hidden">
        <Quote className="w-10 h-10 text-[#A4907C]/25 absolute -top-1 -left-1 rotate-180" />
        <p className="text-xs sm:text-sm text-[#7A7167] font-serif leading-relaxed max-w-md font-medium italic relative z-10">
          &quot;{THERAPY_QUOTES[quoteIdx]}&quot;
        </p>
      </div>

      {/* Write New Entry */}
      <div className="bg-white border border-border-warm-light rounded-[32px] p-6 md:p-8 shadow-3xs">
        <div className="flex items-center gap-2 mb-5">
          <PenTool className="w-4.5 h-4.5 text-brand-green" />
          <h3 className="text-sm font-bold text-[#3E362E] font-serif">인지 왜곡 교정 일기장 (CBT Journal)</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5 flex items-center gap-1">
              <span>1. 오늘 나를 무겁게 짓눌렀던 학업 걱정이나 일은 무엇이었나요?</span>
            </label>
            <textarea
              value={stressor}
              onChange={(e) => setStressor(e.target.value)}
              placeholder="예: 오늘 기출문제 성적이 예상보다 낮아서 시험에 떨어질 것 같다는 걱정이 가시지 않아요..."
              className="w-full text-xs p-3.5 border border-border-warm rounded-xl focus:border-brand-green/65 focus:outline-none bg-white transition-all h-20 placeholder:text-text-muted/60"
              maxLength={300}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5 leading-relaxed">
              <span>2. 이 중 나의 주관적인 욕심, 또는 내 통제권 밖에 있어서 걱정해도 바뀌지 않는 비합리적 생각은 무엇인가요?</span>
            </label>
            <textarea
              value={lettingGo}
              onChange={(e) => setLettingGo(e.target.value)}
              placeholder="예: 출제 유형과 난이도는 출제위원이 정하고, 과거 시험 점수는 이미 흘러갔습니다. 내가 통제할 수 없는 성적 결과에 온종일 자책하는 것은 소모적인 감정 낭비입니다. 다가올 회차 회복 계획만 세우겠습니다."
              className="w-full text-xs p-3.5 border border-border-warm rounded-xl focus:border-brand-green/65 focus:outline-none bg-white transition-all h-20 placeholder:text-text-muted/60"
              maxLength={300}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-primary mb-1.5">
              <span>3. 그럼에도 불구하고 오늘 자그마한 노력을 다해준 나 자신에게 향한 고마움이나 감사는 무엇일까요?</span>
            </label>
            <textarea
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              placeholder="예: 성적이 낮아 속상했음에도 독서실 자리에 다시 착석하여 틀린 오답 문제들을 가만히 훑어본 포기하지 않은 인내심에 감사합니다."
              className="w-full text-xs p-3.5 border border-border-warm rounded-xl focus:border-brand-green/65 focus:outline-none bg-white transition-all h-20 placeholder:text-text-muted/60"
              maxLength={300}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brand-green text-white hover:bg-brand-green-hover py-3.5 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
            id="btn-journal-submit"
          >
            일기 저장하고 인지 균형 잡기
          </button>
        </form>
      </div>

      {/* Save Success Encourgement Card */}
      {showEncouragement && (
        <div className="bg-brand-green text-white rounded-xl p-4 flex items-start gap-3 shadow-sm anim-fade-in relative">
          <Sparkles className="w-5 h-5 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '3s' }} />
          <div>
            <h4 className="font-bold text-xs text-white">일기 기록 완료! 마음의 잔상 정화</h4>
            <p className="text-[11px] opacity-90 mt-1 leading-relaxed">
              인지 왜곡을 교정하고 자기 격려와 감사를 명기하는 행동은 누적된 학업 번아웃을 흘려보내기 위한 첫걸음입니다. 아주 건강합니다!
            </p>
          </div>
        </div>
      )}

      {/* Past Entries Grid */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#3E362E] font-serif">
          <Scroll className="w-4 h-4 text-brand-green" />
          <span>나를 달랜 마음들의 기록 ({entries.length})</span>
        </div>

        {entries.length === 0 ? (
          <div className="border border-dashed border-border-warm rounded-2xl p-6 text-center text-xs text-text-muted">
            아직 작성한 성찰 일기가 없습니다. 마음의 부담을 위의 CBT 양식에 흘려보내 보세요.
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="bg-white border border-border-warm-light rounded-[24px] p-6 shadow-3xs hover:border-brand-green/10 transition-all">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#7A7167] mb-4 border-b border-border-warmpb-3 pb-3">
                  <span className="bg-[#F5F1E9] px-2.5 py-1 rounded-md">{entry.date}</span>
                  <button
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-1 hover:text-red-500 transition-colors rounded-md hover:bg-[#F2EDE4]/30 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3.5 font-sans text-xs text-text-primary">
                  <div className="bg-[#F5F1E9] p-3 rounded-xl border border-border-warm">
                    <span className="block font-bold text-[#7A7167] mb-1 text-[11px]">마음의 짐과 무거움</span>
                    <p className="leading-relaxed">{entry.stressor}</p>
                  </div>

                  <div className="bg-[#E8F0E4]/60 p-3 rounded-xl border border-brand-green/25">
                    <span className="block font-bold text-brand-green mb-1 text-[11px]">내가 통제할 수 있는 균형 인식</span>
                    <p className="leading-relaxed">{entry.lettingGo}</p>
                  </div>

                  <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#A4907C]/25">
                    <span className="block font-bold text-[#A4907C] mb-1 text-[11px] flex items-center gap-1">
                      <Heart className="w-3 h-3 text-[#A4907C] fill-[#A4907C]/25 inline" /> 나를 견뎌낸 조그마한 감사와 격려
                    </span>
                    <p className="leading-relaxed">{entry.gratitude}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

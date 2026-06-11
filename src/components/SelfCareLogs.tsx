import React from "react";
import { HistoryRecord } from "../types";
import { Calendar, Trash2, ChevronRight, Activity, Smile, AlertTriangle, Flame, ShieldAlert } from "lucide-react";

interface SelfCareLogsProps {
  records: HistoryRecord[];
  onSelectRecord: (record: HistoryRecord) => void;
  onClearHistory: () => void;
}

export default function SelfCareLogs({ records, onSelectRecord, onClearHistory }: SelfCareLogsProps) {
  const getRiskStatus = (score: number) => {
    if (score <= 40) {
      return {
        label: "안전 (Low Risk)",
        colorClass: "text-[#3E362E] bg-[#E8F0E4]/70 border-[#7D8F69]/30",
        barClass: "bg-[#7D8F69]",
        message: "학업 스트레스 조율 상태가 원만합니다.",
        icon: <Smile className="w-4 h-4 text-[#7D8F69]" />,
      };
    } else if (score <= 60) {
      return {
        label: "주의 (Mild Burnout)",
        colorClass: "text-[#3E362E] bg-[#F5F1E9] border-[#E8E2D6]",
        barClass: "bg-[#A4907C]",
        message: "피로가 점진적으로 가시지 않고 축적 중입니다.",
        icon: <Activity className="w-4 h-4 text-[#A4907C]" />,
      };
    } else if (score <= 80) {
      return {
        label: "소진 경고 (Moderate)",
        colorClass: "text-[#3E362E] bg-[#F2EDE4] border-[#E8E2D6]",
        barClass: "bg-[#7A7167]",
        message: "학습 의욕이 마모되고 무기력이 심화되고 있습니다.",
        icon: <AlertTriangle className="w-4 h-4 text-[#7A7167]" />,
      };
    } else {
      return {
        label: "위험군 (Severe Burnout)",
        colorClass: "text-[#3E362E] bg-[#F5F1E9]/80 border-t-2 border-t-[#7D8F69] border-[#E8E2D6]",
        barClass: "bg-[#3E362E]",
        message: "긴급한 심리적 휴식과 힐링 전환이 필수입니다.",
        icon: <Flame className="w-4 h-4 text-[#7D8F69] animate-pulse" />,
      };
    }
  };

  const handleClear = () => {
    if (window.confirm("그동안 자가진단했던 모든 기록을 삭제하시겠습니까? 데이터는 로컬 브라우저에서 영구 삭제됩니다.")) {
      onClearHistory();
    }
  };

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-[32px] border border-border-warm-light p-8 text-center max-w-xl mx-auto flex flex-col items-center justify-center min-h-[300px] shadow-3xs">
        <div className="p-4 bg-[#F5F1E9] rounded-full mb-4">
          <Calendar className="w-8 h-8 text-[#A4907C]" />
        </div>
        <h3 className="text-base font-bold text-[#3E362E] font-serif">진단 기록 비어있음</h3>
        <p className="text-xs text-text-muted mt-2 max-w-sm leading-relaxed">
          마음 돌봄 스페이스의 히스토리가 비어 있습니다. 첫 자가진단을 완수하면 시간 경과에 따른 스트레스 흐름 곡선을 이력에 저장해 드립니다.
        </p>
      </div>
    );
  }

  // Calculate some basic average scores
  const totalAverage = Math.round(records.reduce((acc, r) => acc + r.totalScore, 0) / records.length);
  const latestRecord = records[0];

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-[24px] border border-border-warm-light shadow-3xs">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">누적 이력</span>
          <h3 className="text-2xl font-bold text-[#3E362E] font-serif mt-1">{records.length} <span className="text-xs font-normal text-sans text-text-secondary">지표 보유</span></h3>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-border-warm-light shadow-3xs">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">평균 누계 스트레스</span>
          <h3 className="text-2xl font-bold text-[#3E362E] font-serif mt-1">
            {totalAverage} <span className="text-xs font-normal text-sans text-text-secondary">/ 100점</span>
          </h3>
        </div>
        <div className="bg-white p-5 rounded-[24px] border border-border-warm-light shadow-3xs flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-text-muted tracking-widest">가장 최근 상태</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-semibold text-text-primary">{getRiskStatus(latestRecord.totalScore).label}</span>
            </div>
          </div>
          <span className="text-[10px] text-text-muted font-mono mt-2 block">진단일: {latestRecord.date.split("T")[0]}</span>
        </div>
      </div>

      {/* History Timeline */}
      <div className="bg-white rounded-[32px] border border-border-warm-light p-6 md:p-8 shadow-3xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#F2EDE4]">
          <h3 className="text-sm font-bold text-[#3E362E] font-serif">마음 돌봄 이력 리스트</h3>
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 transition-colors font-bold bg-rose-50 hover:bg-rose-100/55 px-3.5 py-1.5 rounded-xl cursor-pointer"
            id="btn-clear-history"
          >
            <Trash2 className="w-3.5 h-3.5" /> 이력 요약 초기화
          </button>
        </div>

        {/* List items */}
        <div className="space-y-4">
          {records.map((record) => {
            const risk = getRiskStatus(record.totalScore);
            const dateStr = new Date(record.date).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="group border border-border-warm-light hover:border-brand-green/20 bg-white hover:bg-[#FDFBF7]/40 p-4 rounded-xl transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer"
              >
                {/* Score & Risk */}
                <div className="flex items-center gap-4.5 w-full md:w-auto">
                  <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center font-serif shrink-0 bg-[#F5F1E9] group-hover:bg-[#E8E2D6]/30 transition-colors">
                    <span className="text-[9px] text-text-muted uppercase font-bold text-sans tracking-wide">Stress</span>
                    <span className="text-lg font-bold text-[#3E362E] leading-none">{record.totalScore}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold text-text-muted font-mono">{dateStr}</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${risk.colorClass}`}>
                        {risk.icon}
                        {risk.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#3E362E] mt-1.5 flex items-center gap-2">
                      <span className="bg-[#FDFBF7] border border-border-warm-light text-[#7D8F69] text-[9.5px] font-bold px-1.5 py-0.5 rounded font-sans">
                        {record.category}
                      </span>
                      {record.context ? (
                        <span className="text-text-secondary font-normal truncate max-w-xs md:max-w-md inline-block">
                          &ldquo;{record.context}&rdquo;
                        </span>
                      ) : (
                        <span className="text-text-muted font-normal italic">
                          어려움 코멘트 미작성
                        </span>
                      )}
                    </h4>
                  </div>
                </div>

                {/* Score progress meters or right click arrow */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end md:justify-start border-t border-[#F2EDE4]/40 md:border-none pt-3 md:pt-0">
                  {/* Miniature progress bar represent scores */}
                  <div className="hidden sm:block w-32 bg-[#E8E2D6] h-2 rounded-full overflow-hidden shrink-0">
                    <div className={`h-full ${risk.barClass}`} style={{ width: `${record.totalScore}%` }} />
                  </div>
                  <span className="text-xs font-bold text-brand-green group-hover:translate-x-1 transition-transform flex items-center">
                    상세 리포트 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { Question } from "./types";

export const QUESTIONS: Question[] = [
  // Exhaustion (학업 소진: 5 questions)
  {
    id: 1,
    category: "exhaustion",
    text: "학업과 연관된 일들 때문에 정신적, 육체적으로 완전히 소진되어 있다고 느낀다.",
  },
  {
    id: 2,
    category: "exhaustion",
    text: "아침에 깨어나 오늘 하루 공부해야 할 일들을 마주할 때면 벌써부터 암담하고 에너지가 닳는 느낌이다.",
  },
  {
    id: 3,
    category: "exhaustion",
    text: "하루 공부 일과가 끝난 후, 혹은 책상을 벗어날 때면 온몸의 진이 완전히 다 빠져나간 기분이다.",
  },
  {
    id: 4,
    category: "exhaustion",
    text: "학업에서 오는 만성적인 스트레스로 인해 주말이나 휴일에도 피로가 가시지 않는 다.",
  },
  {
    id: 5,
    category: "exhaustion",
    text: "수업이나 자습에 과도하게 많은 에너지를 빼앗겨 공부 외 사소한 대화조차 귀찮고 무기력하다.",
  },

  // Cynicism (학업 냉소: 5 questions)
  {
    id: 6,
    category: "cynicism",
    text: "내가 지금 매달려 있는 공부나 연구가 도대체 무슨 의미가 있고 가치가 있는지 회의감이 든다.",
  },
  {
    id: 7,
    category: "cynicism",
    text: "최근에는 수업, 강의, 혹은 성적 발표 등에 대하 감정이 무뎌지거나 극도로 시니컬하게 바뀐 것 같다.",
  },
  {
    id: 8,
    category: "cynicism",
    text: "전공이나 학업 환경 자체에 정나미가 떨어져 심리적으로 어떻게든 도망치고 먼 피난처를 찾고 싶다.",
  },
  {
    id: 9,
    category: "cynicism",
    text: "학업 과정에서 새로운 것을 깨닫거나 알게 되어 흥미를 느꼈던 예전의 내 모습이 아득하고 낯설게 느껴진다.",
  },
  {
    id: 10,
    category: "cynicism",
    text: "공부 부담에 대해 능동적으로 슬퍼하거나 해결하려 하기보단, 다 부질없다고 체만 가라앉는 경우가 많다.",
  },

  // Reduced Efficacy (효능감 저하: 5 questions)
  {
    id: 11,
    category: "efficacy",
    text: "학습 계획을 효율적으로 실천하고 학업 사안들을 유능하게 기획해낼 자신감이 거의 없다.",
  },
  {
    id: 12,
    category: "efficacy",
    text: "조금만 벽에 부딪히거나 이해가 안 가도 '역 시 난 못 해내겠구나' 하는 극심한 실패 예감이 앞선다.",
  },
  {
    id: 13,
    category: "efficacy",
    text: "주변 사람들이나 경쟁자들에 비해 나의 전반적인 학습 학습 능력과 발달 속도가 매우 더뎌 보인다.",
  },
  {
    id: 14,
    category: "efficacy",
    text: "공부하는 도중 문제를 맞추거나 작은 이해의 기쁨을 겪고도, 더 이상 뿌듯하거나 성취감 같은 행복이 도무지 오지 않는다.",
  },
  {
    id: 15,
    category: "efficacy",
    text: "미래에 내가 이 학업을 온전히 끝마쳐 훌륭하게 사회적 역할을 수행할 수 있을 지에 대한 확신이 부유하고 위태롭다.",
  },

  // Physical Stress Symptoms (스트레스 신체 증상: 5 questions)
  {
    id: 16,
    category: "physical",
    text: "최근 책상 앞에만 안거나 수첩을 볼 때 두통, 편두통, 혹은 어깨와 목 뒤쪽 근육이 비정상적으로 뻐근하고 아프다.",
  },
  {
    id: 17,
    category: "physical",
    text: "학업 스트레스로 인해 소화 장애(자주 체함, 과민성 대장 증세, 복통 등)에 지속적으로 노출되고 있다.",
  },
  {
    id: 18,
    category: "physical",
    text: "공부에 대한 조바심이나 수많은 암기 거리가 자려할 때 떠올라 쉽게 잠들지 못하거나 도중에 자주 깬다.",
  },
  {
    id: 19,
    category: "physical",
    text: "학습 공간(학원, 도서관, 연구실, 서재 등)으로 진입할 때 유독 이유 없이 숨이 고르게 쉬어지지 않고 가슴이 꽉 체한 자물쇠 같다.",
  },
  {
    id: 20,
    category: "physical",
    text: "간신히 휴식을 취할 수 있는 주어져도 눈이 풀린 채 심장이 조이듯이 뛰거나 계속해서 머리가 가동되는 등 각성 상태가 풀리지 않는다.",
  }
];

export const LIKERT_OPTIONS = [
  { value: 1, label: "전혀 아니다" },
  { value: 2, label: "아니다" },
  { value: 3, label: "보통이다" },
  { value: 4, label: "그렇다" },
  { value: 5, label: "매우 그렇다" }
];

import { useState } from "react";

const DEFAULT_QUESTIONS = [
  {
    question: "Co oznacza wskaźnik P/E równy 15?",
    options: ["Spółka ma 15 akcji na rynku", "Inwestorzy płacą 15 zł za każdą złotówkę zysku spółki", "Spółka wypłaca 15% dywidendy", "Kurs akcji wzrósł o 15%"],
    correct: 1,
    explanation: "P/E (Price to Earnings) to stosunek ceny akcji do zysku na akcję (EPS). P/E=15 oznacza, że za każdą złotówkę rocznego zysku inwestorzy płacą 15 zł."
  },
  {
    question: "Czym jest GPW?",
    options: ["Globalny Program Wyceny", "Giełda Papierów Wartościowych w Warszawie", "Główny Portal Walutowy", "Gwarancja Portfela Wartości"],
    correct: 1,
    explanation: "GPW to Giełda Papierów Wartościowych w Warszawie — największa giełda w Europie Środkowo-Wschodniej, założona w 1991 roku."
  },
  {
    question: "Ile wynosi podatek Belki od zysków giełdowych w Polsce?",
    options: ["17%", "19%", "23%", "32%"],
    correct: 1,
    explanation: "Podatek od zysków kapitałowych w Polsce wynosi 19% i potocznie nazywany jest 'podatkiem Belki' od nazwiska ministra finansów Marka Belki."
  }
];

export default function QuizBlock({ questions = DEFAULT_QUESTIONS, title = "Sprawdź swoją wiedzę", theme }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[current];

  function handleAnswer(idx) {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);
    if (idx === q.correct) setScore(s => s + 1);
  }

  function handleNext() {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowExplanation(false);
    }
  }

  function handleRestart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setShowExplanation(false);
  }

  return (
    <div style={{
      background: theme.bgCardAlt,
      border: `1px solid ${theme.border}`,
      borderRadius: 12,
      padding: 24,
      margin: "24px 0",
    }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: theme.textBright, marginBottom: 4 }}>🧠 {title}</div>
      <div style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 20 }}>
        {finished ? `Wynik: ${score}/${questions.length}` : `Pytanie ${current + 1} z ${questions.length}`}
      </div>

      {finished ? (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>
            {score === questions.length ? "🏆" : score >= questions.length / 2 ? "👍" : "📖"}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#00c896", marginBottom: 8 }}>
            {score}/{questions.length} poprawnych odpowiedzi
          </div>
          <div style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 20 }}>
            {score === questions.length ? "Doskonale! Świetnie znasz temat." : score >= questions.length / 2 ? "Nieźle! Warto jeszcze trochę poćwiczyć." : "Jeszcze raz przeczytaj artykuł i spróbuj ponownie."}
          </div>
          <button
            onClick={handleRestart}
            style={{ padding: "10px 24px", background: "#58a6ff", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
          >Spróbuj ponownie</button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 16, fontWeight: 600, color: theme.textBright, marginBottom: 16, lineHeight: 1.5 }}>{q.question}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            {q.options.map((opt, i) => {
              let bg = theme.bgCard, border = theme.border, color = theme.text;
              if (selected !== null) {
                if (i === q.correct) { bg = "#00c89620"; border = "#00c896"; color = "#00c896"; }
                else if (i === selected && i !== q.correct) { bg = "#ff4d6d20"; border = "#ff4d6d"; color = "#ff4d6d"; }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  style={{
                    background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: "11px 16px",
                    color, fontFamily: "inherit", fontSize: 14, cursor: selected !== null ? "default" : "pointer",
                    textAlign: "left", transition: "all 0.2s",
                  }}
                >{opt}</button>
              );
            })}
          </div>
          {showExplanation && (
            <div style={{ background: "#58a6ff15", border: "1px solid #58a6ff40", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: theme.text, lineHeight: 1.6 }}>
              💡 {q.explanation}
            </div>
          )}
          {selected !== null && (
            <button
              onClick={handleNext}
              style={{ padding: "10px 24px", background: "#58a6ff", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", fontSize: 14 }}
            >{current + 1 >= questions.length ? "Zobacz wynik" : "Następne pytanie →"}</button>
          )}
        </>
      )}
    </div>
  );
}

export interface Answers {
  startTime: string;
  ride: string;
  tower: string;
  homeTime: string;
  wishes: string;
}

export async function sendAnswers(answers: Answers): Promise<void> {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
  if (!accessKey) throw new Error("NEXT_PUBLIC_WEB3FORMS_KEY is not set");

  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: "Ответы Каусар 💌",
      from_name: "Приглашение",
      "Во сколько выйдет": answers.startTime,
      "Катаемся или гуляем": answers.ride,
      "Вышка": answers.tower,
      "Домой к": answers.homeTime,
      "Пожелания": answers.wishes.trim() || "—",
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success) {
    throw new Error(data?.message ?? `Web3Forms error ${res.status}`);
  }
}

// 1. Nastavení backendu (přesně název USE_BACKEND)
const USE_BACKEND = true;
const BACKEND_URL = "https://web-render-service.onrender.com/chat";
const STUDENT_ID = "Tomas_Trisko_4ITE";

// 2. Elementy z DOM
const form = document.getElementById("question-form");
const textarea = document.getElementById("question");
const emailInput = document.getElementById("email");
const answerDiv = document.getElementById("answer");
const submitBtn = document.getElementById("submit-btn");

// 3. Posluchač události formuláře
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = textarea.value.trim();
  const email = emailInput.value.trim();

  if (!text) {
    answerDiv.className = "error";
    answerDiv.textContent = "Nejdřív napiš dotaz.";
    return;
  }

  answerDiv.className = "loading";
  answerDiv.textContent = "Zpracovávám dotaz, vyčkejte prosím…";
  
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Odesílám…";
  }

  try {
    const payload = {
      message: text,
      student: STUDENT_ID,
      email: email || null
    };

    // Pokud je USE_BACKEND false, vrátí demo
    if (!USE_BACKEND) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      answerDiv.className = "";
      answerDiv.textContent =
        `Demo odpověď (bez serveru)\n\n` +
        `Student: ${payload.student}\n` +
        `Dotaz: ${payload.message}`;
      return;
    }

    // Volání Flask backendu
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      answerDiv.className = "error";
      answerDiv.textContent = "Chyba serveru: " + (data.error || res.statusText);
      return;
    }

    if (data.reply) {
      answerDiv.className = "";
      answerDiv.textContent = data.reply;
      textarea.value = "";
    } else {
      answerDiv.className = "error";
      answerDiv.textContent = "Server nevrátil žádnou odpověď.";
    }
  } catch (err) {
    console.error(err);
    answerDiv.className = "error";
    answerDiv.textContent = "Nepodařilo se spojit se serverem. Zkontroluj připojení.";
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Odeslat dotaz";
    }
  }
});

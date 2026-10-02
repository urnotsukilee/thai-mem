const state = {
  currentMode: "consonants", // 'consonants' or 'vowels'
  currentIndex: 0,
  isFlipped: false,
  isShuffled: false,
  showRoman: true,
  autoFlip: false,
  originalOrder: {
    consonants: [],
    vowels: [],
  },
  currentOrder: {
    consonants: [],
    vowels: [],
  },
};

const elements = {
  card: document.getElementById("card"),
  thaiChar: document.getElementById("thai-char"),
  thaiCharBack: document.getElementById("thai-char-back"),
  romanization: document.getElementById("romanization"),
  name: document.getElementById("name"),
  classEl: document.getElementById("class"),
  sound: document.getElementById("sound"),
  btnFlip: document.getElementById("btn-flip"),
  btnNext: document.getElementById("btn-next"),
  btnPrev: document.getElementById("btn-prev"),
  btnConsonants: document.getElementById("btn-consonants"),
  btnVowels: document.getElementById("btn-vowels"),
  btnSettings: document.getElementById("btn-settings"),
  progressText: document.getElementById("progress-text"),
  progressFill: document.getElementById("progress-fill"),
  settingsPanel: document.getElementById("settings-panel"),
  shuffleMode: document.getElementById("shuffle-mode"),
  autoFlip: document.getElementById("auto-flip"),
  showRoman: document.getElementById("show-roman"),
  btnCloseSettings: document.getElementById("btn-close-settings"),
};

function init() {
  // 保存原始顺序
  state.originalOrder.consonants = [...consonants];
  state.originalOrder.vowels = [...vowels];
  state.currentOrder.consonants = [...consonants];
  state.currentOrder.vowels = [...vowels];

  bindEvents();
  updateMode();
  showCard();
}

function getCurrentData() {
  return state.currentOrder[state.currentMode];
}

function showCard() {
  const data = getCurrentData();
  const item = data[state.currentIndex] || data[0];

  if (!item) return;

  // 正面
  elements.thaiChar.textContent = item.char;
  elements.romanization.textContent = "";
  elements.romanization.style.display = "none";

  // 背面
  elements.thaiCharBack.textContent = item.char;
  elements.name.textContent = item.name || "";
  elements.classEl.textContent = item.class || "";
  elements.sound.textContent = state.showRoman ? (item.sound || "") : (item.roman || item.sound || "");

  // 更新进度
  updateProgress();
}

function updateProgress() {
  const data = getCurrentData();
  const total = data.length;
  const current = state.currentIndex + 1;
  elements.progressText.textContent = `${current} / ${total}`;
  elements.progressFill.style.width = `${(current / total) * 100}%`;
}

function flipCard() {
  state.isFlipped = !state.isFlipped;
  elements.card.classList.toggle("flipped");
}

function nextCard() {
  const data = getCurrentData();
  if (data.length === 0) return;
  state.currentIndex = Math.floor(Math.random() * data.length);
  state.isFlipped = false;
  elements.card.classList.remove("flipped");
  showCard();
}

function prevCard() {
  const data = getCurrentData();
  if (data.length === 0) return;
  state.currentIndex = Math.floor(Math.random() * data.length);
  state.isFlipped = false;
  elements.card.classList.remove("flipped");
  showCard();
}

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function toggleShuffle() {
  state.isShuffled = elements.shuffleMode.checked;
  if (state.isShuffled) {
    state.currentOrder[state.currentMode] = shuffleArray(
      state.originalOrder[state.currentMode]
    );
  } else {
    state.currentOrder[state.currentMode] = [
      ...state.originalOrder[state.currentMode],
    ];
  }
  state.currentIndex = Math.floor(Math.random() * getCurrentData().length);
  state.isFlipped = false;
  elements.card.classList.remove("flipped");
  showCard();
}

function toggleShowRoman() {
  state.showRoman = elements.showRoman.checked;
  // 只更新背面显示，不重置卡片
  const data = getCurrentData();
  const item = data[state.currentIndex];
  if (item && state.isFlipped) {
    elements.sound.textContent = state.showRoman ? (item.sound || "") : (item.roman || item.sound || "");
  }
}

function toggleAutoFlip() {
  state.autoFlip = elements.autoFlip.checked;
}

function updateMode() {
  state.isFlipped = false;
  elements.card.classList.remove("flipped");
  state.currentIndex = Math.floor(Math.random() * getCurrentData().length);

  if (state.currentMode === "consonants") {
    elements.btnConsonants.classList.add("active");
    elements.btnVowels.classList.remove("active");
  } else {
    elements.btnVowels.classList.add("active");
    elements.btnConsonants.classList.remove("active");
  }

  // 确保当前顺序正确
  if (state.isShuffled) {
    state.currentOrder[state.currentMode] = shuffleArray(
      state.originalOrder[state.currentMode]
    );
  } else {
    state.currentOrder[state.currentMode] = [
      ...state.originalOrder[state.currentMode],
    ];
  }
  state.currentIndex = Math.floor(Math.random() * getCurrentData().length);
  showCard();
}

function toggleSettings() {
  elements.settingsPanel.classList.toggle("hidden");
}

function bindEvents() {
  // 卡片点击翻转
  elements.card.addEventListener("click", flipCard);
  elements.btnFlip.addEventListener("click", flipCard);

  // 导航
  elements.btnNext.addEventListener("click", nextCard);
  elements.btnPrev.addEventListener("click", prevCard);

  // 模式切换
  elements.btnConsonants.addEventListener("click", () => {
    if (state.currentMode !== "consonants") {
      state.currentMode = "consonants";
      updateMode();
    }
  });

  elements.btnVowels.addEventListener("click", () => {
    if (state.currentMode !== "vowels") {
      state.currentMode = "vowels";
      updateMode();
    }
  });

  // 设置
  elements.btnSettings.addEventListener("click", toggleSettings);
  elements.btnCloseSettings.addEventListener("click", toggleSettings);
  elements.shuffleMode.addEventListener("change", toggleShuffle);
  elements.showRoman.addEventListener("change", toggleShowRoman);
  elements.autoFlip.addEventListener("change", toggleAutoFlip);

  // 键盘支持
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        flipCard();
        break;
      case "ArrowRight":
      case "n":
      case "N":
        e.preventDefault();
        nextCard();
        break;
      case "ArrowLeft":
      case "p":
      case "P":
        e.preventDefault();
        prevCard();
        break;
      case "Escape":
        elements.settingsPanel.classList.add("hidden");
        break;
    }
  });

  // 触摸滑动支持
  let touchStartX = 0;
  let touchEndX = 0;

  elements.card.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  elements.card.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextCard();
      } else {
        prevCard();
      }
    }
  }
}

init();

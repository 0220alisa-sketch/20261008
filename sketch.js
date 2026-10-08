// 宣告全域變數
let questions = [];      // 儲存所有題目的陣列
let currentQ = 0;        // 當前進行到的題目索引 (0 到 4)
let score = 0;          // 答對的總題數
let selectedOption = -1; // 使用者點選的選項索引 (-1 表示尚未選擇)
let isAnswered = false;  // 紀錄當前題目是否已經作答

// 動態動畫相關變數
let animOffset = 0;      // 用於計算跳動與搖晃位移的變數

function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  
  // 設定文字對齊方式為置中
  textAlign(CENTER, CENTER);
  
  // 初始化題目資料 (共 5 題 p5.js 基礎指令題)
  questions = [
    {
      question: "1. 在 p5.js 中，哪一個函式用來設定畫布的大小？",
      options: ["A. size()", "B. createCanvas()", "C. setWindow()", "D. makeCanvas()"],
      answer: 1 // 正確答案索引 (B)
    },
    {
      question: "2. 哪一個指令可以用來繪製一個圓形？",
      options: ["A. circle()", "B. drawCircle()", "C. round()", "D. ball()"],
      answer: 0 // 正確答案索引 (A)
    },
    {
      question: "3. 若要設定圖形的填滿顏色，應該使用哪一個函式？",
      options: ["A. color()", "B. stroke()", "C. fill()", "D. background()"],
      answer: 2 // 正確答案索引 (C)
    },
    {
      question: "4. p5.js 中會不斷重複執行的主要繪圖函式是哪一個？",
      options: ["A. setup()", "B. loop()", "C. start()", "D. draw()"],
      answer: 3 // 正確答案索引 (D)
    },
    {
      question: "5. 哪一個變數會傳回目前滑鼠的 X 軸座標？",
      options: ["A. mouseX", "B. getMouseX()", "C. cursorX", "D. posX"],
      answer: 0 // 正確答案索引 (A)
    }
  ];
}

function draw() {
  // 設定背景顏色為淺灰藍色
  background(240, 245, 250);

  // 更新動畫偏移量 (利用正弦函數產生平滑的波形)
  animOffset += 0.1;

  // 判斷測驗是否已經結束
  if (currentQ < questions.length) {
    // 尚未結束，繪製題目與選項
    displayQuestion();
  } else {
    // 已經回答完 5 題，顯示結算畫面
    displayResult();
  }
}

// 顯示題目與選項的繪製函式
function displayQuestion() {
  // 取得當前的題目物件
  let q = questions[currentQ];

  // 繪製題目文字
  textSize(width * 0.022); // 依據畫面寬度動態調整字體大小
  fill(30);                // 暗灰色文字
  textStyle(BOLD);          // 粗體
  text(q.question, width / 2, height * 0.18);

  // 設定選項按鈕的尺寸與位置參數
  let btnWidth = width * 0.5;   // 按鈕寬度
  let btnHeight = 60;           // 按鈕高度
  let startY = height * 0.3;    // 第一個按鈕的 Y 軸起始位置
  let spacing = 75;             // 按鈕之間的垂直間距

  textStyle(NORMAL);            // 選項文字還原為一般字體
  textSize(width * 0.016);

  // 繪製 4 個選項按鈕
  for (let i = 0; i < 4; i++) {
    // 計算每個選項的預設中心座標
    let x = width / 2;
    let y = startY + i * spacing;

    // 預設的按鈕背景顏色 (白色)
    let bgColor = color(255);

    // 如果已經作答，處理顏色與位移效果
    if (isAnswered) {
      if (selectedOption === q.answer) {
        // --- 情況 A：使用者答對了 ---
        if (i === q.answer) {
          bgColor = color("#bde0fe"); // 正確選項顯示粉藍色
        }
      } else {
        // --- 情況 B：使用者答錯了 ---
        if (i === q.answer) {
          // 正確選項：背景色 #bde0fe，並且「上下跳動」
          bgColor = color("#bde0fe");
          y += sin(animOffset * 2) * 8; // 透過 sin 函數造成 Y 軸偏移
        } else if (i === selectedOption) {
          // 點選到的錯誤選項：背景色 #ffc8dd，並且「左右移動」
          bgColor = color("#ffc8dd");
          x += cos(animOffset * 2) * 8; // 透過 cos 函數造成 X 軸偏移
        }
      }
    } else {
      // 尚未作答時，處理滑鼠懸停效果
      if (isMouseOver(x, y, btnWidth, btnHeight)) {
        bgColor = color(230, 235, 245); // 懸停時變暗一點
      }
    }

    // 繪製選項按鈕背景矩形
    push();
    rectMode(CENTER);             // 以中心點定位矩形
    fill(bgColor);                // 設定填滿顏色
    stroke(200);                  // 設定邊框顏色
    strokeWeight(2);              // 設定邊框粗細
    rect(x, y, btnWidth, btnHeight, 10); // 繪製圓角矩形

    // 繪製選項文字
    fill(40);                     // 文字顏色
    noStroke();                   // 文字不需要邊框
    text(q.options[i], x, y);     // 繪製文字
    pop();
  }

  // 若已經作答，顯示「下一題」按鈕
  if (isAnswered) {
    drawNextButton();
  }
}

// 繪製「下一題」按鈕的函式
function drawNextButton() {
  let btnX = width / 2;
  let btnY = height * 0.85;
  let btnW = 160;
  let btnH = 50;

  // 檢查滑鼠是否懸停在下一題按鈕上
  let hover = isMouseOver(btnX, btnY, btnW, btnH);

  push();
  rectMode(CENTER);
  // 設定按鈕顏色 (懸停時亮綠色，平時綠色)
  fill(hover ? color(76, 201, 240) : color(67, 97, 238));
  noStroke();
  rect(btnX, btnY, btnW, btnH, 25); // 圓角按鈕

  // 繪製按鈕文字
  fill(255);
  textSize(20);
  textStyle(BOLD);
  // 若是最後一題則顯示「觀看結果」，否則顯示「下一題」
  let btnText = (currentQ === questions.length - 1) ? "觀看結果" : "下一題";
  text(btnText, btnX, btnY);
  pop();
}

// 顯示最終測驗結果畫面
function displayResult() {
  push();
  fill(30);
  textSize(height * 0.05);
  textStyle(BOLD);
  text("測驗結束！", width / 2, height * 0.35);

  // 顯示得分統計
  textSize(height * 0.035);
  textStyle(NORMAL);
  text(`您總共答對了 ${score} / ${questions.length} 題`, width / 2, height * 0.48);

  // 繪製重新開始測驗按鈕
  let btnX = width / 2;
  let btnY = height * 0.65;
  let btnW = 200;
  let btnH = 60;
  let hover = isMouseOver(btnX, btnY, btnW, btnH);

  rectMode(CENTER);
  fill(hover ? color(76, 201, 240) : color(67, 97, 238));
  noStroke();
  rect(btnX, btnY, btnW, btnH, 30);

  fill(255);
  textSize(22);
  textStyle(BOLD);
  text("重新測驗", btnX, btnY);
  pop();
}

// 滑鼠點擊事件監聽
function mousePressed() {
  // 如果測驗還沒結束
  if (currentQ < questions.length) {
    let btnWidth = width * 0.5;
    let btnHeight = 60;
    let startY = height * 0.3;
    let spacing = 75;

    // 尚未作答時，判定點擊了哪一個選項
    if (!isAnswered) {
      for (let i = 0; i < 4; i++) {
        let x = width / 2;
        let y = startY + i * spacing;

        // 如果點擊了第 i 個選項
        if (isMouseOver(x, y, btnWidth, btnHeight)) {
          selectedOption = i;   // 紀錄點擊的選項
          isAnswered = true;    // 標記為已作答

          // 判斷是否答對，答對則累加分數
          if (i === questions[currentQ].answer) {
            score++;
          }
          break;
        }
      }
    } else {
      // 已經作答後，判斷是否點擊了「下一題」按鈕
      let nextBtnX = width / 2;
      let nextBtnY = height * 0.85;
      let nextBtnW = 160;
      let nextBtnH = 50;

      if (isMouseOver(nextBtnX, nextBtnY, nextBtnW, nextBtnH)) {
        currentQ++;            // 切換至下一題
        isAnswered = false;    // 重設作答狀態
        selectedOption = -1;   // 重設選擇的選項
      }
    }
  } else {
    // 測驗已結束，點擊「重新測驗」重置系統
    let restartX = width / 2;
    let restartY = height * 0.65;
    let restartW = 200;
    let restartH = 60;

    if (isMouseOver(restartX, restartY, restartW, restartH)) {
      currentQ = 0;
      score = 0;
      isAnswered = false;
      selectedOption = -1;
    }
  }
}

// 輔助函式：判斷滑鼠是否落在以 (cx, cy) 為中心、寬 w 高 h 的矩形範圍內
function isMouseOver(cx, cy, w, h) {
  return (
    mouseX > cx - w / 2 &&
    mouseX < cx + w / 2 &&
    mouseY > cy - h / 2 &&
    mouseY < cy + h / 2
  );
}

// 當瀏覽器視窗大小改變時，自動調整畫布為全螢幕
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
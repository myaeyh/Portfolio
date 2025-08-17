//////////////////////////////////////////////做滑鼠
let innerCursor=document.querySelector('.inner-cursor')
let outerCursor=document.querySelector('.outer-cursor') 

document.addEventListener('mousemove',moveCursor)
function moveCursor(e){
  let x=e.clientX
  let y=e.clientY 

  //change
  innerCursor.style.left= `${x}px`
  innerCursor.style.top= `${y}px`
  
  outerCursor.style.top  = `${y}px`;
  outerCursor.style.left = `${x}px`;
}


//////////////////////////////////////////////terminal effect
const textEls = document.querySelectorAll("p, .glitchText"); //為什麼只有p可以 h1 h2都不行==>因為要改的話下面還有一個etarget要改
// 先把文字拆開
textEls.forEach((textEl) => {
  splitText(textEl, { charClass: "char" });
});

// 改成載入頁面就跑一次
window.addEventListener("DOMContentLoaded", () => {
  textEls.forEach((textEl, i) => {
    setTimeout(() => {
      hoverTextAnimation({ target: textEl });
    }, i * 500); // 每段文字依序出現
  });
});



//terminal effect的function 庫

//1.(a) splitText(element, { charClass: "char" })
//把一整段文字（例如 Mount Everest）拆成每個字母都包 <span>：=>對每個字動畫

//by chat gpt 方法三便很慢但是有解決HTML標籤出現 and <br>功能保留的問題
function splitTextPreserveHTML(element, { charClass } = {}) {
  function wrapTextNodes(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      // 把文字拆成單字，每個字包一個 span
      const text = node.textContent;
      const frag = document.createDocumentFragment();
      for (let char of text) {
        if (char === "\n") {
          frag.appendChild(document.createElement("br"));
        } else {
          const span = document.createElement("span");
          span.className = charClass;
          span.textContent = char;
          frag.appendChild(span);
        }
      }
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // 遞迴處理子節點
      node.childNodes.forEach(wrapTextNodes);
    }
  }

  wrapTextNodes(element);
}

function splitText(element, { type = "chars", wordClass, charClass } = {}) {
        // // const text = element.innerText;
        // // let splitArray;

        
        // const text = element.innerHTML; //抓取元素裡的 HTML 原始內容（包含 <br>、<strong> 等標籤）。
        // const splitArray = [];//存拆解後的字或標籤
        // for (let i = 0; i < text.length; i++) {
        //   if (text.slice(i, i+4) === "<br>") { // 或 "<br/>"
        //     splitArray.push("<br>");
        //     i += 3; // 跳過 "<br>"
        //     continue;
        //   }
        //   splitArray.push(`<span class="${charClass}">${text[i]}</span>`);
        // }
        // // //原本的 蝦怎麼註解掉就好了????
        // // if (type === "words") {
        // //   splitArray = text
        // //     .split(" ")
        // //     .map((word) => `<span class="${wordClass}">${word}</span>`);
        // // } else if (type === "chars") {
        // //   splitArray = text
        // //     .split("")
        // //     .map((char) => `<span class="${charClass}">${char}</span>`);
        // // } else {
        // //   throw new Error("Invalid split type. Use 'words' or 'chars'.");
        // // }
        // element.innerHTML = splitArray.join("");

        // // element.innerHTML = splitArray.join(type === "words" ? " " : "");

        
        //下面這兩行是方法三的
const textEls = document.querySelectorAll("p, h1, h2");
textEls.forEach(el => splitTextPreserveHTML(el, { charClass: "char" }));

      }



//(b) hoverTextAnimation(e, { ... })
// 當滑鼠移過去的時候：
// 把字暫時隱藏
// 一個一個變成隨機符號
// 最後再變回原本的字
//!!沒有滑鼠 所以其實可以改良!
function hoverTextAnimation(e,{ charDelay = 50, charFreq = 200, randomCharRepeats = 2 } = {})
 {
  const text = e.target.closest("p, .glitchText");
  if (text.classList.contains("is-animated")) return;

  const chars = text.querySelectorAll(".char");
  text.classList.add("is-animated");

  chars.forEach((char, index) => {
    createCharAnimation(char, index, {
      charDelay,
      charFreq,
      randomCharRepeats
    });
  });

  const totalDuration =
    charFreq * (randomCharRepeats + 1) + chars.length * charDelay;
  setTimeout(() => {
    text.classList.remove("is-animated");
  }, totalDuration);
  }


//(c) createCharAnimation(char, index, {...})
// 這個函數專門負責「單個字母」的動畫，包含：
//隨機變符號、再變回原字  
function createCharAnimation(
  char,
  index,
  { charDelay, charFreq, randomCharRepeats }
) {
  const initText = char.innerText;
  const delay = charDelay * index;

  // initial animation
  char.style.setProperty("opacity", 0);
  // first animation
  setTimeout(() => {
    char.style.setProperty("opacity", 1);
    char.style.setProperty("background", "var(--color)");
  }, charFreq - charDelay + delay);

  for (let i = 1; i <= randomCharRepeats; i++) {
    setTimeout(() => {
      i == 1 && char.style.setProperty("background", "transparent");
      char.innerText = randomLetterAndSymbol();
    }, charFreq * i + delay);
  }

  // last animation
  const totalDuration = charFreq * (randomCharRepeats + 1) + delay;
  setTimeout(() => {
    char.innerText = initText;
  }, totalDuration);
}

function randomLetterAndSymbol() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  return chars.charAt(Math.floor(Math.random() * chars.length));
}



/////////////////////////////////////////
// alert("hello world1") //阻擋網站執行 要按下去才會執行的視窗
// 頁面淡入動畫
window.addEventListener('load', () => {
  document.querySelector('.container').classList.add('visible')
})

setTimeout(function () {
  document.querySelector('.container').classList.add('visible')
}, 1000)

// // 找到那個 <p> 元素 
// // 為啥其他兩個沒有反應:O==>因為querySelector只會找第一個符合的元素
// const word = document.querySelector(".Topic");

// // 綁定點擊事件
// word.addEventListener("click", () => {
//   window.location.href = "about.html"; // 跳到另一頁
// });

const topics = document.querySelectorAll(".Topic");

topics.forEach(
  topic => {
  topic.addEventListener("click", () => {
    const link = topic.getAttribute("data-link");
    window.location.href = link;
  });
});



// //互補色機制還沒用完
//   root {
//     --main-color: #ff002b;
//     --complementary-color: #00ff92; /* JS 會自動更新 */
//   }


// function hexToRgb(hex) {
//     hex = hex.replace('#','');
//     let bigint = parseInt(hex,16);
//     let r = (bigint >> 16) & 255;
//     let g = (bigint >> 8) & 255;
//     let b = bigint & 255;
//     return [r,g,b];
// }

// function rgbToHex(r,g,b) {
//     return "#" + ((1 << 24) + (r << 16) + (g << 8) + b)
//       .toString(16).slice(1).toUpperCase();
// }

// function getComplementaryColor(hex) {
//     let [r,g,b] = hexToRgb(hex);
//     let comp = [255-r, 255-g, 255-b];
//     return rgbToHex(...comp);
// }
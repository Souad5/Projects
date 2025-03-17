document.getElementById("nav").style.display = "none";
document.getElementById("main").style.display = "none";

document.getElementById("logout").addEventListener("click", function () {
  document.getElementById("nav").style.display = "none";
  document.getElementById("main").style.display = "none";
  document.getElementById("head-hero").style.display = "block";

  return;
});

const button = () => {
  document.getElementById("getstart").addEventListener("click", function () {
    let name = document.getElementById("textname").value;
    let passWord = document.getElementById("password").value;

    if (name === "") {
      alert("Please tell your name first");
      return;
    }
    if (passWord === "123456") {
      Swal.fire({
        title: "অভিনন্দন",
        text: "চলুন নতুন কিছু শেখা যাক",
        icon: "success",
        draggable: true,
      });
      document.getElementById("nav").style.display = "block";
      document.getElementById("main").style.display = "block";
      document.getElementById("head-hero").style.display = "none";
    } else {
      alert("Wrong Password");
    }
  });
};

button();

fetch("https://openapi.programming-hero.com/api/levels/all")
  .then((res) => res.json())
  .then((data) => vocab(data.data)); // Assuming "levels" contains the array

const vocab = (nums) => {
  const data1 = document.getElementById("learnVocab");
  for (let num of nums) {
    const addButton = document.createElement("div");
    addButton.innerHTML = `
    
        <button onclick = "lessonOne(${num.level_no})" 
        id="btn-${num.level_no}"
            class="btn btn-ghost text-blue-600 border-blue-400 hover:bg-blue-500 hover:text-white whitespace-nowrap text-[15px]"
          >
          <i class="fa-solid fa-book-open"></i>Lesson ${num.level_no}
          </button>
        `;
    data1.appendChild(addButton);
  }
};

let nullSec = document.getElementById("null");
const write = document.createElement("div");

write.innerHTML = `
<div id = "lessonHide" class="bg-base-200 m-11 rounded-lg flex flex-col justify-center items-center h-80 text-center col-span-full gap-3 ">
  <div class=" text-center ">
    <div class = "py-10">
      <h1 class="text-[12px]">আপনি এখনো কোন Lesson Select করেননি</h1>
      <p class="py-6 text-2xl font-bold">
        একটি Lesson Select করুন।
      </p>
    </div>
  </div>
</div>
`;

nullSec.appendChild(write);

const vocabAdd = (voca) => {
  const parentEle = document.getElementById("addvocab-lesson1");
  parentEle.innerHTML = "";
  if (voca.length === 0) {
    parentEle.innerHTML = `
<div class="bg-base-200 m-11  rounded-lg flex flex-col justify-center items-center h-40 text-center col-span-full gap-3">
  <img src="./assets/alert-error.png" alt="">
  <h1 class="text-[12px]">এই Lesson এ এখনো কোন Vocabulary যোগ করা হয় নি</h1>
  <p class="text-2xl font-bold whitespace-nowrap">নেক্সট Lesson এ যান।</p>
</div>

`;
    return;
  }

  for (let dat of voca) {
    // console.log(dat)
    if (dat.meaning === null) {
      dat.meaning = "অর্থ নেই";
    }
    const newEle = document.createElement("div");
    newEle.innerHTML = `
  <div class="">
            <div class="flex flex-col justify-center items-center bg-white gap-2 m-4 rounded-md p-4 hover:bg-blue-50 ">
              <h1 class="font-bold text-xl "> ${dat.word} </h1>
            <p >Meaning/pronounce</p>
            <h2 class="font-bold text-xl hind-siliguri-regular ">${dat.meaning}/${dat.pronunciation} </h2>
            <div class="flex justify-between mt-5 w-8/12 ">
              <button id="modals" onclick="newVocab('${dat.id}')"  class="btn">
              <img src="./assets/fa-circle-question.png" alt="">
              </button>
              <button class = "btn">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
            </div>
          </div>`;
    parentEle.appendChild(newEle);
  }
};

const newVocab = (vocab) => {
  // console.log(vocab)
  const url = `https://openapi.programming-hero.com/api/word/${vocab}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => showModal(data.data));
};

const showModal = (pop) => {
  // console.log(pop)
  if (pop.meaning === null) {
    pop.meaning = "অর্থ পাওয়া যায়নি";
  }
  document.getElementById("modal_obj").showModal();
  const details = document.getElementById("details_modal");
  const synonymButtons = pop.synonyms
  .map((syn) => `<button class="btn  m-1">${syn}</button>`)
  .join("");

details.innerHTML = `
  <h2 class="text-xl font-bold hind-siliguri-regular ">${pop.word}  (<i class="fa-solid fa-microphone"></i>: ${pop.pronunciation})</h2>
  <h2 class="text-xl font-bold">Meaning</h2>
  <h2 class="hind-siliguri-regular ">${pop.meaning}</h2>
  <h2 class="text-xl font-bold">Example</h2>
  <p>${pop.sentence}</p>
  <p class="text-xl font-bold">সমার্থক শব্দ গুলো</p>
  <div class="flex flex-wrap gap-2">
    ${synonymButtons}
  </div>
  <div class="modal-action float-start">
    <form method="dialog">
      <button class="btn btn-primary">Close</button>
    </form>
  </div>
`;
};
const lessonOne = (id) => {
  document.getElementById("lessonHide").style.display = "none";

  const parentEle = document.getElementById("addvocab-lesson1");
  parentEle.innerHTML = `
    <div class="text-center col-span-full h-40 w-full">
      <span class="loading loading-dots loading-xl text-center"></span>
    </div>
  `;

  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  removeClass();

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      parentEle.innerHTML = ""; // Remove spinner
      const clickButton = document.getElementById(`btn-${id}`);
      clickButton.classList.add("active");

      vocabAdd(data.data);
    });
};

const removeClass = () => {
  const activeButtons = document.getElementsByClassName("active");
  for (let btn of activeButtons) {
    btn.classList.remove("active");
  }
};

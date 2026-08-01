//keep data of questions
let questions = [
    // uncomment this if you want the first question card to be visible by default
    // {
    //   text: "",
    //   options: ["", ""],
    //   correctAnswer: "",
    // },
];

//render all questions (one question by default, the rest is added dynamically)
// renderAll();

function renderAll() {
    const container = document.getElementById("questions");

    container.innerHTML = questions
        .map(
            (q, qIndex) => `
    <div id="question-card-${qIndex}" class="container-sm qstn form">
      <div class="card-title">
        <h5>Question ${qIndex + 1}</h5>
        <a title="Remove question" class="remove-question-btn remove-question" href="#" data-q="${qIndex}">
          <svg data-q="${qIndex}" title="Remove question"xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
            <path data-q="${qIndex}" title="Remove question" stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path data-q="${qIndex}" title="Remove question" d="M4 7l16 0" />
            <path data-q="${qIndex}" title="Remove question" d="M10 11l0 6" />
            <path data-q="${qIndex}" title="Remove question" d="M14 11l0 6" />
            <path data-q="${qIndex}" title="Remove question" d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path data-q="${qIndex}" title="Remove question" d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </a>
      </div>
      <label for="question-text-${qIndex + 1}" >Question Text:</label>
      <textarea type="text"
        id="question-text-${qIndex + 1}"
        name="question-text-${qIndex + 1}"
        placeholder="Type your question here"
        class="qbox form-control"
        value="${q.text}"
        data-type="question"
        data-q="${qIndex}"
        required>${q.text}</textarea>

      <div class="options">
      <div class="double-span">Answer Options:</div>
        ${q.options
                    .map(
                        (opt, oIndex) => `
          <p class="option-input">
            <input type="text"
              id="option-${qIndex + 1}-${oIndex + 1}"
              name="option-${qIndex + 1}-${oIndex + 1}"
              placeholder="Option ${oIndex + 1}"
              class="form-control"
              value="${opt}"
              data-type="option"
              data-q="${qIndex}"
              data-o="${oIndex}"
              required/>
              <a title="Remove option" href="#" class="remove-option-btn remove-option" data-q="${qIndex}" data-o="${oIndex}">
                <svg data-q="${qIndex}" data-o="${oIndex}" title="Remove option" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash">
                    <path data-q="${qIndex}" data-o="${oIndex}" title="Remove option" stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path data-q="${qIndex}" data-o="${oIndex}" title="Remove option" d="M4 7l16 0" />
                    <path data-q="${qIndex}" data-o="${oIndex}" title="Remove option" d="M10 11l0 6" />
                    <path data-q="${qIndex}" data-o="${oIndex}" title="Remove option" d="M14 11l0 6" />
                    <path data-q="${qIndex}" data-o="${oIndex}" title="Remove option" d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path data-q="${qIndex}" data-o="${oIndex}" title="Remove option" d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                  </svg>
              </a>
          </p>
        `,
                    )
                    .join("")}

        <p class="double-span">
          <a href="#" class="add-option" data-q="${qIndex}">
            <svg title="+" data-q="${qIndex}" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-plus">
              <path data-q="${qIndex}" stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path data-q="${qIndex}" d="M12 5l0 14" />
              <path data-q="${qIndex}" d="M5 12l14 0" />
            </svg>Add option
          </a>
        </p>

        <p class="double-span select-group">
          <label for="correct-answer-${qIndex + 1}">
            Select Correct Answer:
          </label>

          <select
            id="correct-answer-${qIndex + 1}"
            name="correct-answer-${qIndex + 1}" 
            class="form-control"
            data-type="correct"
            data-q="${qIndex}"
            required>

            <option value="">-- Select correct answer --</option>

            ${q.options
                    .map(
                        (opt, i) => `
              <option value="${opt}" ${q.correctAnswer == opt && opt != "" ? "selected" : ""}>
                ${opt}
              </option>
            `,
                    )
                    .join("")}
          </select>
        </p>
      </div>
    </div>
  `,
        )
        .join("");
}

// handle events
//click
document.addEventListener("click", (e) => {
    if ( (e.target.matches("a") && !e.target.matches(".dropdown-item") && !e.target.matches(".nav-link"))  ||
        e.target.matches("svg") ||
        e.target.matches("path")
    )
        e.preventDefault();

    //cancel button
    if (e.target.matches(".cancel-btn")) {
        console.log("cancel button clicked");
        window.location.href = "/dashboard";
    }

    // add option
    if (e.target.closest(".add-option")) {
        const q = e.target.dataset.q;
        questions[q].options.push("");
        renderAll();
    }

    // remove question
    if (e.target.closest(".remove-question")) {
        // if (questions.length === 1) {                 //if only one question exists, delete is not allowed
        //   console.log("can't delete first question");
        //   alert("A quiz must have at least one question!");
        //   return;
        // }
        const q = e.target.dataset.q;
        questions.splice(q, 1);
        renderAll();

        const questioncard = document.getElementById(`question-card-${q - 1}`);
        questioncard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    // remove option
    if (e.target.closest(".remove-option")) {
        const q = e.target.dataset.q;

        if (questions[q].options.length == 2) {
            //if only two options exist, delete is not allowed
            console.log("can't delete option");
            alert("A question must have at least two answer options!");
            return;
        }
        const o = e.target.dataset.o;
        questions[q].options.splice(o, 1);
        renderAll();
    }
});

//input events
document.addEventListener("input", (e) => {
    const type = e.target.dataset.type;
    const q = e.target.dataset.q;

    if (!type) return;

    // question text
    if (type === "question") {
        questions[q].text = e.target.value;
    }

    // option text
    if (type === "option") {
        const o = e.target.dataset.o;
        questions[q].options[o] = e.target.value;

        const select = document.querySelector(
            `select[data-type="correct"][data-q="${q}"]`,
        );

        if (select) {
            const optionEl = select.querySelector(
                `option[value="${questions[q].correctAnswer}"]`,
            );

            // update all dropdown options
            const allOptions = select.querySelectorAll("option");

            allOptions.forEach((optEl, index) => {
                if (index === 0) return; // skip "-- Select --"

                const value = questions[q].options[index - 1];

                optEl.textContent = value;
                optEl.value = value;
            });
        }
    }
});

//select events
document.addEventListener("change", (e) => {
    if (e.target.dataset.type === "correct") {
        const q = e.target.dataset.q;
        questions[q].correctAnswer = e.target.value;
    }
});

// add question
document.getElementById("add-question").addEventListener("click", () => {
    questions.push({
        text: "",
        options: ["", ""],
        correctAnswer: "",
    });
    renderAll();
    const qlen = questions.length;
    const questioncard = document.getElementById(`question-card-${qlen - 1}`);
    questioncard.scrollIntoView({ behavior: "smooth", block: "center" });
});

// document.getElementById("quizForm").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     console.log("submit");
//     const response = await fetch("/create_v1", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ questions })
//     });

//     const data = await response.json();

//     if (data.success) {
//         console.log("Data success:", data.message);
//     } else {
//         console.log(data.message);
//     }
// });

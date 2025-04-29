let questionCount = 1; // Counter to keep track of the number of questions added

function addQuestion() {
    questionCount++; // Increment the question count

    // Create elements for the new question
    let newQuestionDiv = document.createElement('div');
    newQuestionDiv.classList.add('qstn', 'form', 'container-sm');
    newQuestionDiv.innerHTML = `
        <label for="question-${questionCount}">Question ${questionCount}:</label>
        <textarea type="text" id="question-${questionCount}" name="question-${questionCount}" class="qbox form-control" required></textarea>
    `;

    let optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');

    // Adding option fields for the new question
    for (let i = 1; i <= 4; i++) {
        let newOption = document.createElement('p');
        // newOption.classList.add('col');
        newOption.innerHTML = `
            <label for="option-${questionCount}-${i}">Option ${i}:</label>
            <input type="text" id="option-${questionCount}-${i}" name="option-${questionCount}-${i}" class="form-control" oninput="updateCorrectDropdown(${questionCount - 1})" required>
        `;
        optionsDiv.appendChild(newOption);
    }

    ///////////////////////////     input instead of dropdown/select     ////////////////////////// 

    // let inputRightAnswer = document.createElement('p');

    // inputRightAnswer.innerHTML = `
    //     <label for="right-answer-${questionCount}">Right Answer for Question ${questionCount}:</label>
    //     <input type="number" id="right-answer-${questionCount}" name="right-answer-${questionCount}" class="form-control" required>
    // `;

    // newQuestionDiv.appendChild(optionsDiv);
    // optionsDiv.appendChild(inputRightAnswer);

    ///////////////////////////////////////////////////////////////////////////////////////

    let selectRightAnswer = document.createElement('p');

    selectRightAnswer.innerHTML = `
        <label for="right-answer-${questionCount}">Right Answer:</label>
        <select id="right-answer-${questionCount}" name="right-answer-${questionCount}" class="form-control" required>
            <option value="">Select correct option</option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
            <option value=""></option>
        </select>
    `;

    newQuestionDiv.appendChild(optionsDiv);
    optionsDiv.appendChild(selectRightAnswer);

    // Add the new question and options to the form
    document.getElementById('quizForm').insertBefore(newQuestionDiv, document.querySelector('.buttons'));
    // document.getElementById('quizForm').insertBefore(inputRightAnswer, document.querySelector('.add-button'));
    newQuestionDiv.scrollIntoView({ behavior: "smooth" });

    // Update the IDs and names of the added elements to avoid conflicts
    updateIdsAndNames();
}

/////////////////////////////////////////////////////////////////////////////////
document.getElementById("quizForm").addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const form = e.target;
    // const title = form.title.value;
    // const description = form.description.value;
  
    const questions = [];
    for (let i = 1; i <= questionCount; i++) {
      questions.push({
        text: form[`question-${i}`].value,
        answers: [
          form[`option-${i}-1`].value,
          form[`option-${i}-2`].value,
          form[`option-${i}-3`].value,
          form[`option-${i}-4`].value
        ],
        correctAnswer: form[`right-answer-${i}`].value
      });
    }
  
    const response = await fetch("/create/add-questions/:quizId", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questions })
    });
  
    const data = await response.json();
    // const resultDiv = document.getElementById("quizResult");
  
    if (data.success) {
      console.log("Created quiz:", data.quiz);
    } else {
      console.log(data.message);
    }
  });
/////////////////////////////////////////////////////////////////////////////////

function updateIdsAndNames() {
    // Update IDs and names of added elements to avoid conflicts
    let questions = document.querySelectorAll('.qstn');
    questions.forEach((question, index) => {
        question.querySelector('label').setAttribute('for', `question-${index + 1}`);
        question.querySelector('input').setAttribute('id', `question-${index + 1}`);
        question.querySelector('input').setAttribute('name', `question-${index + 1}`);

        let options = question.querySelectorAll('input[type="text"]');
        options.forEach((option, i) => {
            // option.setAttribute('for', `option-${index + 1}-${i + 1}`);
            option.setAttribute('id', `option-${index + 1}-${i + 1}`);
            option.setAttribute('name', `option-${index + 1}-${i + 1}`);
        });
    });
}

function updateCorrectDropdown(index) {
    const card = document.querySelectorAll(".qstn")[index];
    console.log("indexxx = ", index)
    if (!card) return;

    const options = [
        card.querySelector(`[name="option-${index + 1}-1"]`).value,
        card.querySelector(`[name="option-${index + 1}-2"]`).value,
        card.querySelector(`[name="option-${index + 1}-3"]`).value,
        card.querySelector(`[name="option-${index + 1}-4"]`).value
    ];

    const select = card.querySelector(`[name="right-answer-${index + 1}"]`);
    select.innerHTML = `<option value="">Select correct option</option>`;
    options.forEach(opt => {
        const optionEl = document.createElement("option");
        optionEl.value = opt;
        optionEl.textContent = opt;
        select.appendChild(optionEl);
    });
}
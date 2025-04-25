//         function to add maybe later        // 


// function addOption() {
//             var optionsDiv = document.querySelector('.options');
//             var optionCount = optionsDiv.querySelectorAll('input[type="text"]').length;
//             console.log(optionCount);
//             if (optionCount < 6) { // Limiting to 6 options
//                 var newOption = document.createElement('input');
//                 newOption.type = 'text';
//                 newOption.name = 'option' + (optionCount + 1);
//                 newOption.placeholder = 'Option ' + (optionCount + 1) + ':';
//                 optionsDiv.appendChild(newOption);
//             }
//         }

        // function addQuestion() {
        //     var questionD
        // }
        
        //////////////////////////////////////////////////////////////////////////

        //////////////////////////////////////////////////////////////////////////

        


        let questionCount = 1; // Counter to keep track of the number of questions added

        function addQuestion() {
            questionCount++; // Increment the question count

            // Create elements for the new question
            let newQuestionDiv = document.createElement('div');
            newQuestionDiv.classList.add('qstn', 'form');
            newQuestionDiv.innerHTML = `
                <label for="question${questionCount}">Question ${questionCount}:</label>
                <input type="text" id="question${questionCount}" name="question${questionCount}" class="qbox form-control" required>
            `;

            let optionsDiv = document.createElement('div');
            optionsDiv.classList.add('options');

            // Adding option fields for the new question
            for (let i = 1; i <= 4; i++) {
                let newOption = document.createElement('p');
                // newOption.classList.add('col');
                newOption.innerHTML = `
                    <label for="option${i}">Option ${i}:</label>
                    <input type="text" id="option${i}_${questionCount}" name="option${i}_${questionCount}" class="form-control" required>
                `;
                optionsDiv.appendChild(newOption);
            }

            let inputRightAnswer = document.createElement('p');
            
            inputRightAnswer.innerHTML = `
                <label for="right-answer${questionCount}">Right Answer for Question ${questionCount}:</label>
                <input type="number" id="right-answer-${questionCount}" name="right-answer-${questionCount}" class="form-control" required>
            `;

            
            optionsDiv.appendChild(inputRightAnswer);
            newQuestionDiv.appendChild(optionsDiv);

            // Add the new question and options to the form
            document.getElementById('quizForm').insertBefore(newQuestionDiv, document.querySelector('.add-button'));
            // document.getElementById('quizForm').insertBefore(inputRightAnswer, document.querySelector('.add-button'));
            newQuestionDiv.scrollIntoView({behavior: "smooth"});

            // Update the IDs and names of the added elements to avoid conflicts
            updateIdsAndNames();
        }

        function updateIdsAndNames() {
            // Update IDs and names of added elements to avoid conflicts
            let questions = document.querySelectorAll('.qstn');
            questions.forEach((question, index) => {
                question.querySelector('label').setAttribute('for', `question${index + 1}`);
                question.querySelector('input').setAttribute('id', `question${index + 1}`);
                question.querySelector('input').setAttribute('name', `question${index + 1}`);

                let options = question.querySelectorAll('input[type="text"]');
                options.forEach((option, i) => {
                    option.setAttribute('id', `option${i + 1}_${index + 1}`);
                    option.setAttribute('name', `option${i + 1}_${index + 1}`);
                });
            });
        }

        
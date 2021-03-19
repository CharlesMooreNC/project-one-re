//QUESTION by GitHub - determination of most important function per API request
const question = document.getElementById('question');
//API returned text
const selection = Array.from(document.getElementsByClassName('apiReturn'));
const questionArea = document.getElementById('questionArea');
let userQuestions = {}; //these are the progression questions for the user
let newQuestions = [];
let questions = [];
const limit = 10; //setting our question container limit

//below, we are fetching the data from the opentdb api - a free API that has a medium difficulty and multiple options. This was used as a placeholder for the musixmatch API as that API had difficulty connecting and retrieving the user data
fetch(
    'https://opentdb.com/api.php?amount=20&category=12&difficulty=easy&type=multiple'
)
  //Now that we have our URL to fetch the promise; we can use .then to validate the methods 
    .then((response) => {
        return response.json();
    })
  //tutorial from stack-overflow: https://stackoverflow.com/questions/53073614/fetch-api-to-grab-data-and-returning-results-via-map so that we can use .map to display our fetch. Without this method, we would not be able to have the API display to the user
  //userView to display the transition to the user
    .then((displayQuestion) => {
        questions = displayQuestion.results.map((displayQuestion) => {
            const userView = {
                question: displayQuestion.question,
            };
            const answerChoices = [...displayQuestion.incorrect_answers]; //adding the 
            userView.answer = Math.floor(Math.random() * 4) + 1;
            //splicing the answers and organizing the last return
            answerChoices.splice(
                userView.answer - 1,
                0,
                displayQuestion.correct_answer
            );

            answerChoices.forEach((choice, index) => {
                userView['choice' + (index + 1)] = choice;
            });

            return userView;
        });

        quickQuiz();
    })

quickQuiz = () => {
    inputCount = 0;
    newQuestions = [...questions];
    getQuestion();
};

getQuestion = () => {
    //sets the counter overhead by adding one to the array and KEEPING the progression of the user
    inputCount++;
    progressText.innerText = `Question ${inputCount}/${limit}`;

    //using the array for randomization and continuation/justification of the inputCount. 
    const apiArray = Math.floor(Math.random() * newQuestions.length);
    userQuestions = newQuestions[apiArray];
    question.innerHTML = userQuestions.question;

    selection.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = userQuestions['choice' + number];
    });
};

selection.forEach((choice) => {
  //using e for transition adjustment - troubleshooting 'event' will not work for this action
    choice.addEventListener('click', (e) => {
        const userRequest = e.target;
        //target for accompanying count
        const selectedAnswer = userRequest.dataset['number'];

        //separation into classes for progression and consoling
        const progressionLead =
            selectedAnswer == userQuestions.answer ? 'correct' : 'incorrect';

        //progression passing if the input is true or false
        //DIRECT Tutorial from Github using parentElement and classes - was unsure how to set this target w/o this lead
        userRequest.parentElement.classList.add(progressionLead);

        //justification - https://www.w3schools.com/jsref/met_win_settimeout.asp
        setTimeout(() => {
            userRequest.parentElement.classList.remove(progressionLead);
            getQuestion();
        }, 1000);
    });
});
let apiUrl= "https://opentdb.com/api.php?amount=20&category=21&difficulty=medium&type=multiple";
let userNameElement=document.getElementById("user-name");
let userInput= document.getElementById("user-input");
let startButton = document.getElementById("start-button");
let quizContainer = document.getElementById("quiz-container");
let resultContainer = document.getElementById("result-container");
let userInputContainer= document.getElementById("user-input-container");
let questionElement = document.getElementById("question");
let optionsContainer = document.getElementById("options-container");
let nextButton = document.getElementById("next-button");
let skipButton = document.getElementById("skip-button");
const attemptedCountElement = document.getElementById("attempted-count");
const unattemptedCountElement = document.getElementById("unattempted-count");
const questionNumberElement = document.getElementById("question-number");

let currentQuestionIndex=0;
let questions =[];
let userAnswer=[];

startButton.addEventListener('click',startQuiz);

function startQuiz(){
    let userName=userInput.value;
    if(userName.trim()!==""){
        userNameElement.textContent=`User: ${userName}`;
        userInputContainer.style.display ="none";
        quizContainer.style.display="block";
        fetchQuestions();
    }
    else{
        alert("Please Enter Name");
    }
}

async function fetchQuestions(){
    try{
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions=data.results;
        displayQuestion();
    }
    catch (error){
        console.error("error in fetching question",error);
    }
    
}
function displayQuestion(){
    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = "";

    const options =[...question.incorrect_answers, question.correct_answer];
    
    options.forEach((option,index)=>{
        const radioInput=document.createElement("input");
        radioInput.type="radio";
        radioInput.name="answer";
        radioInput.id= `option${index}`;
        radioInput.value=option;

        const label =document.createElement("label");
        label.textContent=option;
        label.setAttribute("for",`option${index}`);
        
        optionsContainer.appendChild(radioInput);
        optionsContainer.appendChild(label);
    });
}


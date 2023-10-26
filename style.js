let apiUrl= "https://opentdb.com/api.php?amount=20&category=21&difficulty=medium&type=multiple";
let userNameElement=document.getElementById("user-name");
let userInput= document.getElementById("user-input");
let startButton = document.getElementById("start-button");
let quizContainer = document.getElementById("quiz-container");
let resultContainer = document.getElementById("result-container");
let userInputContainer= document.getElementById("user-input-container");
let questionElement = document.getElementById("question");
let optionsContainer = document.getElementById("option-container");
let nextButton = document.getElementById("next-button");
let skipButton = document.getElementById("skip-button");
const attemptedCountElement = document.getElementById("attempted-count");
const unattemptedCountElement = document.getElementById("unattempted-count");
const questionNumberElement = document.getElementById("question-number");
let playAgainButton=document.getElementById("play-again-button");
let marksObtain = document.getElementById("marks-obtain");
let submitButton= document.getElementById("submit-button");
let timerElement=document.getElementById("timer");
let buttonsContainer=document.getElementById("jump-buttons-container");
let jumpButton = document.getElementById("jump-buttons");
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
        timerStart();
        
        buttonsContainer.style.display="block";
    }
    else{
        alert("Please Enter Name");
    }
    
}
var something = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
           createButtons();
        }
    };
})();

async function fetchQuestions(){
    try{
        const response = await fetch(apiUrl);
        const data = await response.json();
        questions=data.results;
        displayQuestion();
        something();
    }
    catch (error){
        console.error("error in fetching question",error);
    }

}

function displayQuestion(){
    const question = questions[currentQuestionIndex];
    questionElement.innerHTML = `• ${question.question}`;
    optionsContainer.innerHTML = "";

    const options =[...question.incorrect_answers, question.correct_answer];
    
    options.forEach((option,index)=>{
        const radioInput=document.createElement("input");
        radioInput.type="radio";
        radioInput.name="answer";
        radioInput.id= `option${index}`;
        radioInput.value=option;

        const label =document.createElement("label");
        label.innerHTML=option;
        label.setAttribute("for",`option${index}`);
        optionsContainer.appendChild(radioInput);
        optionsContainer.appendChild(label);
        
    });
}

    nextButton.addEventListener("click", loadNextQuestion);
    skipButton.addEventListener("click", skipQuestion);

    function loadNextQuestion(){
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if(selectedOption){
            userAnswer.push(selectedOption.value);
        }
        else{
            userAnswer.push(null);
        }
        currentQuestionIndex++;
        updateQuestionNumber();
        updateAttemptedUnattemptedCount();

        if(currentQuestionIndex < questions.length){
            displayQuestion();
        }
        else{
            endQuiz();
        }

    }


    function updateQuestionNumber(){
        questionNumberElement.textContent = `Question: ${currentQuestionIndex+1}`;
    }
    function updateAttemptedUnattemptedCount(){
        const attemptedCount = userAnswer.filter(element => element!== null).length;
        const unattemptedCount = questions.length-attemptedCount;

        attemptedCountElement.textContent = `Attempted: ${attemptedCount}`;
            unattemptedCountElement.textContent = `Unattempted: ${unattemptedCount}`;

            if(currentQuestionIndex < questions.length){
                displayQuestion();
            }
            else{
               
            }
    }

    function skipQuestion(){
        userAnswer.push(null);
        currentQuestionIndex++;
        updateAttemptedUnattemptedCount();
        updateQuestionNumber();
        if (currentQuestionIndex < questions.length) {
            displayQuestion();
        } else {
            endQuiz();
        }
    }
    
    function calculateScore(){
        
        var score=0;

        for(let i=0;i<questions.length;i++){
            if( userAnswer[i]===questions[i].correct_answer ){
                score=score+4;
            }
            else if (userAnswer[i]===undefined){

            }
            else if (userAnswer[i]===null){
                
            }
            else{
                score = score-1;
            }
        }
        return score;
    }

    function endQuiz(){
        clearInterval(timer);
        let marks = calculateScore();
        quizContainer.style.display="none";
        resultContainer.style.display="block";
        marksObtain.innerHTML="";
        marksObtain.innerHTML=`You Got :<strong> ${marks}  marks</strong>`;
        buttonsContainer.style.display="none";
        // jumpButton.style.display="none";
        
    }
    submitButton.addEventListener("click",endQuiz);
    
    playAgainButton.addEventListener('click',playAgain);

    function  playAgain(){
        currentQuestionIndex=0;
        // attemptedCount=0;
        userAnswer=[];
        questions =[];
        resultContainer.style.display="none";
        userInputContainer.style.display="block";
        fetchQuestions();

    }
    function timerStart(){
        // createButtons();
        let timeLeft=300;
        timerElement.innerHTML=showTime(timeLeft);
        timer= setInterval(() =>{
            timeLeft--;
            timerElement.innerHTML=showTime(timeLeft);
            if(timeLeft<=0){
                endQuiz();
            }
        },1000);
    }
    function showTime(timeLeft){
        let min =Math.floor(timeLeft/60);
        let sec=timeLeft%60;
        if(sec<10){
            return ` &#x23F0 Time Left : 0${min}:0${sec}`;
        }
        else{
            return `&#x23F0 Time Left : 0${min}:${sec}`;
        }
       
    };
    function  createButtons (){
        
        for (let i=0 ; i<questions.length;i++){
            const button = document.createElement("button");
            button.textContent=`Q${i+1}`;
            button.className="jump-button";
            button.addEventListener('click',()=>jump(i));
            jumpButton.appendChild(button);
        }
    }
    function jump(element){
        if(element>=0 && element<questions.length){
            currentQuestionIndex=element;
            displayQuestion();
            updateQuestionNumber();
        }
    }


    //  2. button to navigate    3.changing of color of buttons    4.css
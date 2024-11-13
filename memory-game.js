class Pair
{
    constructor(Words)
    {
        this.Words = Words;
    }
}

const Lauseet = [];

var CorrectButtonIndex = -1;
var CurrentQuestion = Math.floor(Math.random() * (Lauseet.length - 1));
var OldQuestion = -1;
var correct = 0;
var question = 0;
var unLockColor = window.getComputedStyle(document.getElementById("B1"), null).getPropertyValue("background-color");
var LockColor = "#777877";

function Start()
{
    document.getElementById('fileInput').addEventListener('change', (event) =>
    {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function()
        {
            var lines = reader.result.toString().split("\n");
            for(var i = 0; i < lines.length; i++){
                var a = lines[i].split(",");
                Lauseet.push(new Pair(a));
            }
            document.getElementById("main").style.display = "block";
            document.getElementById("inputBlock").style.display = "none";
            NewQuestion(Math.floor(Math.random() * (Lauseet.length - 1)));
        };

        reader.onerror = function ()
        {
            console.error('Error reading the file');
        };

        reader.readAsText(file, 'utf-8');
    });
}

function NewQuestion(index = -1)
{
    if(index == -1)
    {
        index = Math.floor(Math.random() * (Lauseet.length - 1));
    }
    while(index == OldQuestion)
    {
        index = Math.floor(Math.random() * (Lauseet.length - 1));
    }
    OldQuestion = index;
    question++;
    const pickedQuestionIndexes = []
    for(var i = 0; i < 3; i++)
    {
        var num = Math.floor((Math.random() * Lauseet.length) % 12);
        while(pickedQuestionIndexes.includes(num) || num == index)
        {
            num = Math.floor((Math.random() * Lauseet.length) % 12);
        }
        pickedQuestionIndexes.push(num);
    }
    CorrectButtonIndex = Math.floor(Math.random() * 4) + 1;
    var LangIndex = Math.floor(Math.random() * 2); // 0 = lang1 -> lang2, 1 = lang2 -> lang1

    //To translate
    var word = Lauseet[index].Words[(LangIndex + 1) % 2];
    if(word.includes("|")){
        word = word.split("|");
        word = word[Math.floor(Math.random() * word.length)];
    }
    document.getElementById("Translate").innerHTML = word;

    for(var i = 1; i < 5; i++)
    {
        if(CorrectButtonIndex == i)
        {
            var word = Lauseet[index].Words[LangIndex];
            if(word.includes("|")){
                word = word.split("|");
                word = word[Math.floor(Math.random() * word.length)];
            }
            document.getElementById("B" + i.toString()).innerHTML = word;
        }
        else
        {
            var word = Lauseet[pickedQuestionIndexes[0]].Words[LangIndex];
            if(word.includes("|")){
                word = word.split("|");
                word = word[Math.floor(Math.random() * word.length)];
            }
            document.getElementById("B" + i.toString()).innerHTML = word;
            pickedQuestionIndexes.shift(pickedQuestionIndexes[0]);
        }
    }

    document.getElementById("Title").innerHTML = "Question " + question;
    var correctnessText = document.getElementById("Correctness");
    correctnessText.innerHTML = "Choose correct word"
    correctnessText.style.color = "#ffffff";

    for(var i = 1; i < 5; i++)
    {
        document.getElementById("B" + i).style.backgroundColor = unLockColor;
    }
    document.getElementById("next").style.backgroundColor = LockColor;
    document.getElementById("next").disabled = true;
}

function CheckTheAnswer(num)
{
    var correctnessText = document.getElementById("Correctness");
    correctnessText.innerHTML = "False";
    correctnessText.style.color = "#ff0000";
    if (num == CorrectButtonIndex)
    {
        correctnessText.innerHTML = "True";
        correctnessText.style.color = "#00ff00";
        correct++
    }
    document.getElementById("Score").innerHTML = "Score: " + correct + "/" + question;

    for(var i = 1; i < 5; i++)
    {
        document.getElementById("B" + i).style.backgroundColor = LockColor;
    }
    document.getElementById("B"+CorrectButtonIndex).style.backgroundColor = "#11a878";
    if (num != CorrectButtonIndex)
    {
        document.getElementById("B"+num).style.backgroundColor = "#cf1515";
    }

    document.getElementById("next").style.backgroundColor = unLockColor;
    document.getElementById("next").disabled = false;
}

Start();
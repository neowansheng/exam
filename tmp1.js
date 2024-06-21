const questions = [
    {
        "question": "暑いですね。エアコンを（　）。",
        "options": [
            "つけましょう",
            "あけましょう",
            "おしましょう",
            "ひらきましょう"
        ],
        "answer": "つけましょう",
        "analysis": "中文翻译：好热啊。开空调吧。 「つける」变形成「つけましょう」，意思是“打开吧”。「エアコンをつけましょう」意思是“开空调吧”。"
    },
    {
        "question": "ああ、のどが（　）。つめたい　水が　飲みたい。",
        "options": [
            "いたかった",
            "かわいた",
            "すいた",
            "ぬれた"
        ],
        "answer": "かわいた",
        "analysis": "中文翻译：啊，我口渴了。我想喝冰水。 「乾（かわ）く」的过去式是「乾きました」=「乾いた」。"
    },
    {
        "question": "すみません、お手洗いを（　）ください。",
        "options": [
            "かけて",
            "かりて",
            "かえして",
            "かして"
        ],
        "answer": "かして",
        "analysis": "中文翻译：对不起，请把洗手间借给我。 「貸（か）してください」 请求别人借给自己某东西 的句型。「お手洗い（卫生间）を貸（か）してください」＝请借我一下卫生间。"
    }
];

// 初始化时随机打乱题目和选项顺序
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


const groupSize = 15;
const questionGroups = [];

// 分组题目
for (let i = 0; i < questions.length; i += groupSize) {
    questionGroups.push(questions.slice(i, i + groupSize));
}

// 为每组内的题目和选项打乱顺序
questionGroups.forEach(group => {
    shuffle(group);
    group.forEach(question => {
        question.shuffledOptions = question.options.map((option, index) => ({ option, index }));
        shuffle(question.shuffledOptions);
    });
});


let currentGroupIndex = 0;
let currentQuestionIndex = 0;
let totalTime = 0;
let timerInterval;

// 初始化用户答案
const userAnswers = questionGroups.map(group => Array(group.length).fill(undefined));

// 获取页面元素
const groupSelector = document.getElementById('group-selector');
const questionDisplay = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const feedbackDisplay = document.getElementById('feedback');
const prevQuestionButton = document.getElementById('prev-question');
const nextQuestionButton = document.getElementById('next-question');
const progressBar = document.getElementById('progress-bar');

// 创建组选择器
function createGroupSelectors() {
    groupSelector.innerHTML = '';
    questionGroups.forEach((group, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `组 ${index + 1}`;
        groupSelector.appendChild(option);
    });
}

// 选择题目组
function selectGroup(groupIndex) {
    currentGroupIndex = groupIndex;
    currentQuestionIndex = 0;
    resetTimer();
    showQuestion();
}

// 重置计时器
function resetTimer() {
    clearInterval(timerInterval);
    totalTime = 0;
    document.getElementById("timer").innerText = `用时：0分0秒`;
    startTimer();
}

// 开始计时器
function startTimer() {
    timerInterval = setInterval(() => {
        totalTime++;
        document.getElementById("timer").innerText = `用时：${Math.floor(totalTime / 60)}分${totalTime % 60}秒`;
    }, 1000);
}

function showQuestion() {
    const currentGroup = questionGroups[currentGroupIndex];
    const currentQuestion = currentGroup[currentQuestionIndex];
    questionDisplay.textContent = currentQuestion.question;

    const shuffledOptions = currentQuestion.shuffledOptions;
    const correctIndex = shuffledOptions.findIndex(({ option }) => option === currentQuestion.answer);

    optionsContainer.innerHTML = '';
    optionsContainer.classList.remove('answered'); // 移除 answered 类

    shuffledOptions.forEach(({ option, index }, i) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `<span>${String.fromCharCode(65 + i)}. ${option}</span><span class="feedback-symbol"></span>`;
        optionElement.addEventListener('click', () => selectOption(optionElement, index, correctIndex));
        optionsContainer.appendChild(optionElement);
    });

    // 重新勾选用户之前选择的答案
    const userAnswerIndex = userAnswers[currentGroupIndex][currentQuestionIndex];
    if (userAnswerIndex !== undefined) {
        const selectedOptionElement = optionsContainer.children[userAnswerIndex];
        selectedOptionElement.classList.add('selected');
        checkAnswer(selectedOptionElement, userAnswerIndex, correctIndex, true); // 添加一个参数表示是回到之前的题目
    } else {
        feedbackDisplay.style.display = 'none';  // 隐藏之前的反馈信息
    }

    updateNavigationButtons();
    updateProgressBar();
}





// 选中答案时的处理
function selectOption(optionElement, index, correctIndex) {
    if (optionElement.parentNode.classList.contains('answered')) return; // 防止重复选择
    optionElement.parentNode.classList.add('answered');
    // 保存用户选择
    userAnswers[currentGroupIndex][currentQuestionIndex] = index;

    // 移除之前的选中状态
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
        option.classList.remove('wrong');
        option.classList.remove('correct');
        option.querySelector('.feedback-symbol').textContent = '';
    });

    // 添加当前选中的状态
    optionElement.classList.add('selected');

    checkAnswer(optionElement, index, correctIndex);
}

// 检查用户选择的答案
function checkAnswer(optionElement, selectedIndex, correctIndex, isRevisit = false) {
    const currentQuestion = questionGroups[currentGroupIndex][currentQuestionIndex];
    const selectedOption = currentQuestion.options[selectedIndex];
    const correctOptionElement = optionsContainer.children[correctIndex];

    if (selectedOption === currentQuestion.answer) {
        optionElement.querySelector('.feedback-symbol').textContent = '✔';
        optionElement.querySelector('.feedback-symbol').classList.add('correct-symbol');
        feedbackDisplay.innerHTML = `回答正确！<br><span class="analysis">解析：${currentQuestion.analysis}</span>`;
        feedbackDisplay.className = 'correct';
    } else {
        optionElement.querySelector('.feedback-symbol').textContent = '✘';
        optionElement.querySelector('.feedback-symbol').classList.add('incorrect-symbol');
        correctOptionElement.querySelector('.feedback-symbol').textContent = '✔';
        correctOptionElement.querySelector('.feedback-symbol').classList.add('correct-symbol');
        feedbackDisplay.innerHTML = `回答错误！<br><span class="analysis">解析：${currentQuestion.analysis}</span><br>正确答案：${String.fromCharCode(65 + correctIndex)}. ${currentQuestion.answer}`;
        feedbackDisplay.className = 'incorrect';
    }
    feedbackDisplay.style.display = 'block';

    // 如果是重新访问的题目，不标记选项为已回答
    if (!isRevisit) {
        optionsContainer.classList.add('answered');
    }
}



// 更新导航按钮的状态
function updateNavigationButtons() {
    const currentGroup = questionGroups[currentGroupIndex];
    prevQuestionButton.disabled = currentQuestionIndex === 0;
    if (currentQuestionIndex === currentGroup.length - 1) {
        nextQuestionButton.textContent = "交卷";
    } else {
        nextQuestionButton.textContent = "下一题";
        nextQuestionButton.disabled = false; // 确保不是禁用状态
    }
}

// 更新进度条
function updateProgressBar() {
    const progress = ((currentQuestionIndex + 1) / questionGroups[currentGroupIndex].length) * 100;
    progressBar.style.width = `${progress}%`;
}

// 显示上一题
function showPreviousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

// 显示下一题
function showNextQuestion() {
    const currentGroup = questionGroups[currentGroupIndex];
    if (currentQuestionIndex < currentGroup.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else if (currentQuestionIndex === currentGroup.length - 1) {
        // 统计用户答案并显示结果
        calculateResults();
    }
}

// 统计用户答案
function calculateResults() {
    const currentGroup = questionGroups[currentGroupIndex];
    let correctCount = 0;
    let wrongCount = 0;

    currentGroup.forEach((question, index) => {
        const selectedIndex = userAnswers[currentGroupIndex][index];
        if (selectedIndex !== undefined) {
            const selectedOption = question.options[selectedIndex];
            if (selectedOption === question.answer) {
                correctCount++;
            } else {
                wrongCount++;
            }
        }
    });

    const totalQuestions = currentGroup.length;
    const unansweredCount = totalQuestions - correctCount - wrongCount;
    const correctRate = ((correctCount / totalQuestions) * 100).toFixed(2);

    // 显示统计结果
    feedbackDisplay.innerHTML = `
        <div style="text-align: center; font-size: larger; color: black;">测验成绩</div>
        <div style="text-align: left; color: black;">
            总题数：${totalQuestions}<br>
            做对了：${correctCount}<br>
            做错了：${wrongCount}<br>
            未选：${unansweredCount}<br>
            正确率：${correctRate}%
        </div>
    `;
    feedbackDisplay.style.display = 'block';
}

// 初始化测试
function initQuiz() {
    createGroupSelectors();
    showQuestion();
    startTimer();
}

// 为导航按钮添加事件监听器
prevQuestionButton.addEventListener('click', showPreviousQuestion);
nextQuestionButton.addEventListener('click', showNextQuestion);
groupSelector.addEventListener('change', (e) => selectGroup(parseInt(e.target.value)));

// 初始化时隐藏提交按钮，并禁用“上一题”按钮
window.onload = function() {
    initQuiz();
};

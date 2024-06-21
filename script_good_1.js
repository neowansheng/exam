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
    },
    {
        "question": "あの　先生の　授業は（　）。",
        "options": [
            "つまる",
            "つまらない",
            "つもる",
            "つもらない"
        ],
        "answer": "つまらない",
        "analysis": "中文翻译：那个老师的课很无聊。 「つまらない」的意思是“无聊，无趣”。"
    },
    {
        "question": "これは、（　）食べられない。",
        "options": [
            "まずくて",
            "おいしくて",
            "やすくて",
            "きらくて"
        ],
        "answer": "まずくて",
        "analysis": "中文翻译：这个难吃不能吃。 い形容词的接续：把「い」变成「くて」，后接形容词或动词。"
    },
    {
        "question": "今日が（　）で、明日が　三日です。",
        "options": [
            "はつか",
            "ふつか",
            "よっか",
            "はたち"
        ],
        "answer": "ふつか",
        "analysis": "中文翻译：今天是二号，明天是三号。 「ふつか（二日）」意思是“二日，二号”；「みっか（三日）」意思是“三日，三号”。"
    },
    {
        "question": "A「東京まで　あと　どのくらい　かかりますか。」 B「もうすぐ（　）よ。」",
        "options": [
            "つきます",
            "でます",
            "うごきます",
            "かえります"
        ],
        "answer": "つきます",
        "analysis": "中文翻译：A:到东京还要多久?    B:马上就到啦。"
    },
    {
        "question": "（　）、失礼ですが、田中さんでは　ありませんか。",
        "options": [
            "ええ",
            "あのう",
            "ああ",
            "じゃあ"
        ],
        "answer": "あのう",
        "analysis": "中文翻译：那个，不好意思，请问您是田中先生吗？"
    }
]

// 随机打乱数组的顺序
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

const groupSize = 5;
const questionGroups = [];
let groupResults = [];


// 分组题目
for (let i = 0; i < questions.length; i += groupSize) {
    questionGroups.push(questions.slice(i, i + groupSize));
}

// 随机打乱每个组内的题目顺序
questionGroups.forEach(group => shuffle(group));

let currentGroupIndex = 0;
let currentQuestionIndex = 0;
let totalTime = 0;
let timerInterval;

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
    groupResults = new Array(questionGroups[currentGroupIndex].length).fill(null); // 重置统计结果
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

// 显示当前问题和选项
function showQuestion() {
    const currentGroup = questionGroups[currentGroupIndex];
    const currentQuestion = currentGroup[currentQuestionIndex];
    questionDisplay.textContent = currentQuestion.question;

    // 随机化选项顺序并确保答案正确
    const shuffledOptions = currentQuestion.options.map((option, index) => ({
        option,
        index
    }));
    shuffle(shuffledOptions);

    // 确定正确答案在乱序后的位置
    const correctIndex = shuffledOptions.findIndex(({ option }) => option === currentQuestion.answer);

    optionsContainer.innerHTML = '';
    shuffledOptions.forEach(({ option, index }, i) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `<span>${String.fromCharCode(65 + i)}. ${option}</span><span class="feedback-symbol"></span>`;
        optionElement.addEventListener('click', () => selectOption(optionElement, index, correctIndex));
        optionsContainer.appendChild(optionElement);
    });

    optionsContainer.classList.remove('answered'); // 重置回答状态

    feedbackDisplay.style.display = 'none';  // 隐藏之前的反馈信息
    updateNavigationButtons();
    updateProgressBar();
}

// 选中答案时的处理
function selectOption(optionElement, index, correctIndex) {
    // 检查是否已经选择过答案
    if (optionElement.parentNode.classList.contains('answered')) {
        return; // 已经选择过答案，直接返回
    }

    // 移除之前的选中状态
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
        option.classList.remove('wrong');
        option.classList.remove('correct');
        option.querySelector('.feedback-symbol').textContent = '';
    });

    // 添加当前选中的状态
    optionElement.classList.add('selected');

    // 标记为已回答
    optionElement.parentNode.classList.add('answered');

    checkAnswer(optionElement, index, correctIndex);
}

// 检查用户选择的答案
function checkAnswer(optionElement, selectedIndex, correctIndex) {
    const currentQuestion = questionGroups[currentGroupIndex][currentQuestionIndex];
    const selectedOption = currentQuestion.options[selectedIndex];
    const correctOptionElement = optionsContainer.children[correctIndex];

    if (selectedOption === currentQuestion.answer) {
        optionElement.querySelector('.feedback-symbol').textContent = '✔';
        optionElement.querySelector('.feedback-symbol').classList.add('correct-symbol');
        feedbackDisplay.innerHTML = `回答正确！<br><span class="analysis">解析：${currentQuestion.analysis}</span>`;
        feedbackDisplay.className = 'correct';
        groupResults[currentQuestionIndex] = true; // 记录正确
    } else {
        optionElement.querySelector('.feedback-symbol').textContent = '✘';
        optionElement.querySelector('.feedback-symbol').classList.add('incorrect-symbol');
        correctOptionElement.querySelector('.feedback-symbol').textContent = '✔';
        correctOptionElement.querySelector('.feedback-symbol').classList.add('correct-symbol');
        feedbackDisplay.innerHTML = `回答错误！<br><span class="analysis">解析：${currentQuestion.analysis}</span><br>正确答案：${String.fromCharCode(65 + correctIndex)}. ${currentQuestion.answer}`;
        feedbackDisplay.className = 'incorrect';
        groupResults[currentQuestionIndex] = false; // 记录错误
    }
    feedbackDisplay.style.display = 'block';
}

let quizSubmitted = false;

function submitQuiz() {
    clearInterval(timerInterval);
    quizSubmitted = true; // 标记为已交卷
    feedbackDisplay.innerHTML = `<div style="text-align: center; font-size: 24px; color: black;">测验成绩</div>`;
    const totalQuestions = groupResults.length;
    const correctCount = groupResults.filter(result => result === true).length;
    const wrongCount = groupResults.filter(result => result === false).length;
    // const unansweredCount = groupResults.filter(result => result === null).length;
    const unansweredCount = totalQuestions - correctCount - wrongCount;
    const accuracy = ((correctCount / totalQuestions) * 100).toFixed(2);

    feedbackDisplay.innerHTML += `<div style="color: black; text-align: left;">
        答题所用时间：${Math.floor(totalTime / 60)}分${totalTime % 60}秒<br>
        总题数：${totalQuestions}<br>
        做对了：${correctCount}题<br>
        做错了：${wrongCount}题<br>
        未选：${unansweredCount}题<br>
        正确率：${accuracy}%</div>`;
    nextQuestionButton.disabled = true;
}


// 更新导航按钮的状态
function updateNavigationButtons() {
    const currentGroup = questionGroups[currentGroupIndex];
    prevQuestionButton.disabled = currentQuestionIndex === 0;
    if (currentQuestionIndex === currentGroup.length - 1) {
        nextQuestionButton.textContent = "交卷";
        nextQuestionButton.disabled = quizSubmitted && groupResults.every(result => result !== null); // 允许重新交卷
    } else {
        nextQuestionButton.textContent = "下一题";
        nextQuestionButton.disabled = false; // 确保“下一题”按钮在未提交时可用
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
    if (currentQuestionIndex < questionGroups[currentGroupIndex].length - 1) {
        currentQuestionIndex++;
        showQuestion();
    }
}

// 初始化测试
function initQuiz() {
    createGroupSelectors();
    showQuestion();
    startTimer();
}


// 为导航按钮添加事件监听器
// prevQuestionButton.addEventListener('click', showPreviousQuestion);
// nextQuestionButton.addEventListener('click', showNextQuestion);
prevQuestionButton.addEventListener('click', () => {
    quizSubmitted = false; // 重置提交状态
    showPreviousQuestion();
});

nextQuestionButton.addEventListener('click', () => {
    if (currentQuestionIndex === questionGroups[currentGroupIndex].length - 1) {
        submitQuiz();
    } else {
        showNextQuestion();
    }
});
groupSelector.addEventListener('change', (e) => selectGroup(parseInt(e.target.value)));

// 初始化时隐藏提交按钮，并禁用“上一题”按钮
window.onload = function() {
    initQuiz();
};

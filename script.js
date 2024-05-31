// 测试数据

const questions = [
    { question: "独在异乡为异客，每逢佳节倍思亲中的“独”是？", options: ["孤独感", "背井离乡", "王安石", "王维"], answer: 1 },
    { question: "“青青子衿，悠悠我心”出自哪位作者？", options: ["李白", "杜甫", "辛弃疾", "李清照"], answer: 4 },
    { question: "“床前明月光，疑是地上霜”下一句是？", options: ["举头望明月", "低头思故乡", "吟安一个字", "诗成泪如雨"], answer: 2 },
    { question: "独在异乡为异客，每逢佳节倍思亲中的“独”是？", options: ["孤独感", "背井离乡", "王安石", "王维"], answer: 1 },
    { question: "“青青子衿，悠悠我心”出自哪位作者？", options: ["李白", "杜甫", "辛弃疾", "李清照"], answer: 4 }
    // ...其他问题
];

let userAnswers = new Array(questions.length).fill(0);

// 当前问题索引
let currentQuestionIndex = 0;
let correctAnswers = 0; // 记录正确答案的数量

// 获取页面元素
const timerDisplay = document.getElementById('time');
const progressBar = document.getElementById('progress-bar');
const currentQuestionDisplay = document.getElementById('current-question');
const questionDisplay = document.getElementById('question');
const optionsContainer = document.getElementById('options-container');
const answerOptions = document.querySelectorAll('.answer-option');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');

// 更新页面计时器的显示
function updateTimerDisplay(time) {
    let minutes = Math.floor(time / 60);
    let seconds = time % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 更新进度条
function updateProgressBar() {
    let progress = (currentQuestionIndex + 1) / questions.length * 100;
    progressBar.style.width = `${progress}%`;
}


// 显示当前问题和选项
function showQuestion() {
    let currentQuestion = questions[currentQuestionIndex];
    questionDisplay.textContent = currentQuestion.question;
    currentQuestionDisplay.textContent = `单选题 (${currentQuestionIndex + 1}/${questions.length})`;
    updateProgressBar();


    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach((option, index) => {
        let optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.innerHTML = `<span class="option-prefix">${index + 1}.</span> ${option}`;
        optionsContainer.appendChild(optionElement);
    });

    // 清除所有选项按钮的选中样式
    answerOptions.forEach(btn => {
        btn.classList.remove('answer-option-selected');
    });

    // 检查该题目是否已经有选择过的答案，如果有，则为该答案的按钮添加选中样式
    let selectedAnswer = userAnswers[currentQuestionIndex];
    // 确保selectedAnswer不为0，因为0代表未选择答案
    if (selectedAnswer > 0) {
        let selectedButton = document.querySelector(`.answer-option[data-index="${selectedAnswer - 1}"]`);
        if (selectedButton) {
            selectedButton.classList.add('answer-option-selected');
        }
    }
    

    // 根据当前题目索引更新按钮状态
    if (currentQuestionIndex === 0) {
        document.getElementById('prev').disabled = true; // 第一题时禁用“上一题”按钮
    } else {
        document.getElementById('prev').disabled = false; // 其他情况启用“上一题”按钮
    }

    if (currentQuestionIndex === questions.length - 1) {
        document.getElementById('next').style.display = 'none'; // 最后一题时隐藏“下一题”按钮
        document.getElementById('submit').style.display = 'inline-block'; // 并显示“交卷”按钮
    } else {
        document.getElementById('next').style.display = 'inline-block'; // 不是最后一题时显示“下一题”按钮
        document.getElementById('submit').style.display = 'none'; // 隐藏“交卷”按钮
    }
}


// 设置选项按钮的事件监听器
answerOptions.forEach((button, index) => {
    button.textContent = index + 1; // 更新按钮文本为1234
    button.style.color = "red"; // 文字颜色为红色
    button.style.border = "1px solid black"; // 添加黑色边框
    button.style.fontSize = "larger"; // 增加文字大小
    button.addEventListener('click', () => {
        // 清除之前选中的选项的样式
        answerOptions.forEach(btn => btn.classList.remove('answer-option-selected'));
        // 为当前选中的选项添加样式
        button.classList.add('answer-option-selected');
        userAnswers[currentQuestionIndex] = index + 1; // 保存用户的选择
    });
});

// 切换到上一题
prevButton.onclick = () => {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
};

// 切换到下一题
document.getElementById('next').addEventListener('click', function() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        // 弹出对话框询问用户
        if (confirm("您要继续答题还是直接交卷？点击确定直接交卷，取消则继续答题。")) {
            // 显示答题结果
            showResults();
        }
    }
});

function showResults() {
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    let resultString = '<h3 style="text-align: center; color: darkgreen;">测试结果</h3>';


    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        if (userAnswer === 0) {
            unanswered++;
            resultString += `第${index + 1}题：未选 ❌，正确答案是：${question.options[question.answer - 1]}<br>`;
        } else if (userAnswer === question.answer) {
            correct++;
            resultString += `第${index + 1}题：正确 ✔️<br>`;
        } else {
            wrong++;
            resultString += `第${index + 1}题：错误 ❌，正确答案是：${question.options[question.answer - 1]}<br>`;
        }
    });

    resultString += `<br>总题数：${questions.length}，正确：${correct}，错误：${wrong}，未答：${unanswered}<br>`;

    
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = resultString;
    resultsDiv.style.display = 'block'; // 显示结果
}

document.getElementById('submit').addEventListener('click', showResults);

// 初始化测试
function initQuiz() {
    startTimer();
    showQuestion();
}

// 初始化时隐藏提交按钮，并禁用“上一题”按钮
window.onload = function() {
    initQuiz();
    document.getElementById('prev').disabled = true; // 禁用“上一题”按钮
    document.getElementById('submit').style.display = 'none'; // 隐藏交卷按钮
};

// 计时器
function startTimer() {
    let timeRemaining = 10 * 60; // 假设考试时间为10分钟
    const timer = setInterval(() => {
        if (timeRemaining <= 0) {
            clearInterval(timer);
            alert('时间到，测试结束！');
            // 时间到后的处理逻辑
            // 可以在这里添加代码，比如自动提交测试
        } else {
            timeRemaining--;
            updateTimerDisplay(timeRemaining);
        }
    }, 1000);
}
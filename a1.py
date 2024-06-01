import json

file_path = 'q1.txt'

# 使用 open() 函数打开文件
with open(file_path, 'r', encoding='utf-8') as file:
    # 读取文件内容
    text = file.read()

# 打印文件内容
# print(text)

# 处理文本
questions = []
current_question = {}
lines = text.strip().split('\n')
parsing_analysis = False

for line in lines:
    line = line.strip()
    
    if '（单选题，2分）' in line:
        if current_question:
            questions.append(current_question)
        current_question = {
            'question': line.split('）', 1)[1].strip(),
            'options': [],
            'answer': '',
            'analysis': ''
        }
        parsing_analysis = False
    elif line.startswith('A.'):
        current_question['options'].append(line.split('A.')[1].strip())
    elif line.startswith('B.'):
        current_question['options'].append(line.split('B.')[1].strip())
    elif line.startswith('C.'):
        current_question['options'].append(line.split('C.')[1].strip())
    elif line.startswith('D.'):
        current_question['options'].append(line.split('D.')[1].strip())
    elif line.startswith('【正确答案】：'):
        current_question['answer'] = line.split('：')[1].strip()
    elif line.startswith('【解析】：'):
        current_question['analysis'] = line.split('：', 1)[1].strip()
        parsing_analysis = True
    elif parsing_analysis:
        current_question['analysis'] += ' ' + line

if current_question:
    questions.append(current_question)

# 转换为JSON格式
questions_json = json.dumps(questions, ensure_ascii=False, indent=4)

# 打印结果
print(questions_json)

print(f'一共有{len(questions)}道题目',)
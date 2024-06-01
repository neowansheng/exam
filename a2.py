import json

# 原始文本
text = """
1.（单选题，2分）暑いですね。エアコンを（　）。
A.つけましょう
B.あけましょう
C.おしましょう
D.ひらきましょう
【正确答案】：A
【解析】：中文翻译：好热啊。开空调吧。
「つける」变形成「つけましょう」，意思是“打开吧”。「エアコンをつけましょう」意思是“开空调吧”。
2.（单选题，2分）ああ、のどが（　）。つめたい　水が　飲みたい。
A.いたかった
B.かわいた
C.すいた
D.ぬれた
【正确答案】：B
【解析】：中文翻译：啊，我口渴了。我想喝冰水。
「乾（かわ）く」的过去式是「乾きました」=「乾いた」。
3.（单选题，2分）すみません、お手洗いを（　）ください。
A.かけて
B.かりて
C.かえして
D.かして
【正确答案】：D
【解析】：中文翻译：对不起，请把洗手间借给我。
「貸（か）してください」 请求别人借给自己某东西 的句型。「お手洗い（卫生间）を貸（か）してください」＝请借我一下卫生间。
"""

questions = []
current_question = {}
qtexts = text.strip().split('（单选题，2分）')

while qtexts[1] != "":
    text = qtexts[1].split('A.')
    ask_part = text[0]
    left_text = text[1]

    text = left_text.split('B.')
    option_a_part = text[1]

    current_question = {"question": ask_part, "options": [option_a_part]}

    questions.append(current_question)

# # 转换为JSON格式
# questions_json = json.dumps(questions, ensure_ascii=False, indent=4)

# # 打印结果
# print(questions_json)

print(questions)
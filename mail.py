# zigyabqsyqpydety
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

content = MIMEMultipart()  #建立MIMEMultipart物件
content["subject"] = "CSIEJAR ID重設密碼"  #郵件標題
content["from"] = "csiejarjar@gmail.com"  #寄件者
content["to"] = "example@gmail.com" #收件者
content.attach(MIMEText("Demo python send email"))  #郵件內容

class mail():
    def __init__(self,title="this is title",text="this is content"):
        self.sender = "no-reply@csiejar.xyz"#你的gmail
        self.sender_key = "zigyabqsyqpydety"##你的應用程式密碼
        self.content = MIMEMultipart()  #建立MIMEMultipart物件
        self.content["subject"] = title  #郵件標題
        self.content["from"] = self.sender  #寄件者
        self.content.attach(MIMEText(text))  #郵件內容
    def send(self,to = None):
        if to == None:
            print("u need type some email")
        else:
            self.content["to"] = to
            ### Create SSL for trustworthy
            with smtplib.SMTP(host="smtp.gmail.com", port="587") as smtp:  # 設定SMTP伺服器
                try:
                    smtp.ehlo()  # 驗證SMTP伺服器
                    smtp.starttls()  # 建立加密傳輸
                    smtp.login(self.sender, self.sender_key)  # 登入寄件者gmail
                    smtp.send_message(self.content)  # 寄送郵件
                    print("Complete!")
                except Exception as e:
                    print("Error message: ", e)
'''
tos = ["bluewhalestock2021@gmail.com","lawrencelee0113@gmail.com","kevin410090@gmail.com"]
if is_send:
    for to in tos:
        this_mail = mail.mail("今日董事會通過日期",send_text)
        this_mail.send(to)

'''

'''
註冊page (/login):
    send value:(API)
        account (mail)
        password 
        name

    sever: 7digit
        gmail to mail 
    client:
        check 7digit gmail type on website

查證7digit:
    send value:(API):
        7digit
    true:
        creat account
    false:
        limit 5 times
    over 5times :
        ridirect /home

'''
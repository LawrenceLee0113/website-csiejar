from flask import Flask, render_template, request, json, jsonify, redirect, url_for
import time, datetime, sys, codecs, uuid
from bs4 import BeautifulSoup
import datetime
from dateutil.relativedelta import relativedelta


#email smtp
import smtplib
import email
import random
import ssl
from email import encoders
from email.mime.base import MIMEBase
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


# google login import
from google.oauth2 import id_token
from google.auth.transport import requests

import base64  # imgkit
import os  # imgkit
from imagekitio import ImageKit  # imgkit

app = Flask(__name__)





def component_html(tag, id, innerTags=False): # tag:標籤名稱 id:標籤id innerTags:是否要只取得innerhtml
    with open("templates/index.html", "r", encoding="utf-8") as f:
        text = f.read()
    soup = BeautifulSoup(text, "html.parser")
    result = soup.find(tag, {"id": id})
    if innerTags:
        result = result.findChildren()
        output = ""
        for i in result:
            output += str(i)
        result = output
    return result


component_html_obj = {
    "top_navbar_html":
    component_html("nav", "top_navbar"),
    "error_window_html":
    "".join([
        str(component_html("div", "errorModalCenter")),
        str(component_html("div", "unloginModalCenter"))
    ]),
    "header_info_html":
    component_html("div", "header_info", True)
}


@app.route('/')
def index_page():
    return redirect(url_for("page", pageName="home")) #預設導向 /home



@app.route('/<pageName>') #各大頁面 home news ...
def page(pageName):

    if pageName == "home":
        return render_template("home.html",
                               component_html_obj=component_html_obj)
    elif pageName == "news":
        return render_template("news.html",
                               component_html_obj=component_html_obj)
    elif pageName == "curriculum":
        with open("static/data/server.json") as file:
            data = json.load(file)
        return render_template("curriculum.html",
                               component_html_obj=component_html_obj,
                              semester_selector_val=data["semester_selector_val"])
    elif pageName == "resource":
        return render_template("resource.html",
                               component_html_obj=component_html_obj)
    elif pageName == "classData":
        return render_template("classData.html",
                               component_html_obj=component_html_obj)
    elif pageName == "calendar":
        return render_template("calendar.html",
                               component_html_obj=component_html_obj)
    elif pageName == "article":
        return render_template("article.html",
                               component_html_obj=component_html_obj)
    elif pageName == "manager":
        return render_template("manager.html",
                               component_html_obj=component_html_obj)
    elif pageName == "create_article":
        return render_template("article_create.html",
                               component_html_obj=component_html_obj)
    elif pageName == "login":
        return render_template("login.html",
                               component_html_obj=component_html_obj)
    elif pageName == "forgot_password":
        return render_template("forget_password.html",
                               component_html_obj=component_html_obj)
    elif pageName == "change_password":
        return render_template("change_password.html",
                               component_html_obj=component_html_obj)

    else:
        return render_template("noPage.html",
                               component_html_obj=component_html_obj)
    


def create_account(user_id, name, email, view_name, picture, login_type, id):
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)
    data["user_id"]["user-" + user_id] = {
        "user_id": "user-" + user_id,
        "admin": "false",
        "google_name": name,
        "view_name": view_name,
        "gmail": email,
        "img": picture,
        "own_article_id": [],
        "edit_article_id": [],
        "role": "visitor",
        "ban": "false",
        "authorize": "false",
        "last_login_time":
        (datetime.datetime.now()  + relativedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S"),
        "login_times": 1,
        "login_type": login_type,
        "google_id": id,
        "user_token": ""
    }
    data["google_id"][id] = {"user_id": "user-" + user_id}
    with open("static/data/ID_and_google.json", "w") as file:
        json.dump(data, file)


def create_user_id(id):
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)
    user_id = str(uuid.uuid4())
    with open("static/data/ID_and_google.json", "w") as file:
        json.dump(data, file)
    return user_id



#?↓-↓-↓-↓-↓-↓-↓-↓-↓-↓ 帳號區 開始 ↓-↓-↓-↓-↓-↓-↓-↓-↓-↓
"""
你已經進入 帳號-函式區
"""
def login(now_user_id):
    update_token(now_user_id)
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)

    # 增加login times 
    datetime1 = datetime.datetime.strptime(data["user_id"][now_user_id]["last_login_time"],"%Y-%m-%d %H:%M:%S")# last time
    datetime2 = datetime.datetime.now()# now time
    datetime3 = datetime2 + relativedelta(hours=8)
    _a = (datetime3 - datetime1).total_seconds() / 60# 相差分鐘
    
    if _a > 15:
        data["user_id"][now_user_id]["login_times"] += 1
        data["user_id"][now_user_id]["last_login_time"] = datetime3.strftime("%Y-%m-%d %H:%M:%S")
    else:
        data["user_id"][now_user_id]["last_login_time"] = datetime3.strftime("%Y-%m-%d %H:%M:%S")
    with open("static/data/ID_and_google.json","w") as file:
        json.dump(data,file)
    return data["user_id"][now_user_id]


def check_token(user_id,user_token):
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)
    return user_token == data["user_id"][user_id]["user_token"]
    

def update_token(user_id):
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)
    token = "token-" + str(uuid.uuid4())
    data["user_id"][user_id]["user_token"] = token

    with open("static/data/ID_and_google.json", "w") as file:
        json.dump(data, file)
    return token


"""
你已經進入 帳號-cookie登入驗證區
"""
@app.route('/api/login', methods=["post"])  #login by cookie user info
def api_login():
    login_type = request.form.get('login_type')
    user_id = request.form.get('user_id')
    user_token = request.form.get('user_token')
    
    try:
        if check_token(user_id,user_token):
            user = login(user_id)
            
            output = {"message": "pass", "user": user}
        else:
            output = {"message": "user token useless"}
    except KeyError:
        output = {"message": "user id not defind"}

    return jsonify(output)

"""
你已經進入 帳號-登入方式區
"""
CLIENT_ID = "513159013962-1bp03rago46o75rlq51ktj17qqk2d06t.apps.googleusercontent.com"
@app.route('/google_check_test', methods=["POST"])  #google login 後 存cookie 導向
def google_check_test():
    token_id = request.form.get('credential')
    # client_id = request.form.get('g_csrf_token')
    user = {}
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token_id, requests.Request(),
                                              CLIENT_ID)
        # print(idinfo)
        user["user_id"] = idinfo['sub']
        user["user_email"] = idinfo["email"]
        user["view_name"] = idinfo["name"]
        user["user_given_name"] = idinfo["given_name"]
        user["user_family_name"] = idinfo["family_name"]
        user["img"] = idinfo["picture"]

        with open("static/data/ID_and_google.json") as file:
            data = json.load(file)
        try:
            now_user_id = data["google_id"][idinfo['sub']]["user_id"]

        except KeyError:
            id = create_user_id(idinfo['sub'])
            create_account(id, idinfo["name"], idinfo["email"], idinfo["name"],
                           idinfo["picture"], "google", idinfo['sub'])
            now_user_id = "user-" + id

        finally:
            user = login(now_user_id)
            print(user)

    except ValueError:
        # Invalid token
        print("value error")
        user["user_id"] = "fail"
        pass
    return render_template("test.html", user=user)

#our_login_system
@app.route('/api/our_login', methods=["POST"]) #CSIEJAR_ID 登入
def our_login():
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)
    email = request.form["mail"]
    password = request.form["password"]
    if email in data["our_id"]:
        our_id = data["our_id"][email]
        our_id = data["our_id"][email]
        if password == data["our_password"][our_id]:
            print("Login!")
            # return email + " is Logged in"
            return jsonify({"status":"success","user":login(our_id)})
    
        else:
            print("Password Error")
            return jsonify({"status":"Password Error"})
    else:
        print("Error")
        return jsonify({"status":"Account is not define"})


"""
你已經進入 帳號-註冊區
"""
@app.route('/api/our_signup', methods=["POST"]) #CSIEJAR_ID 註冊
def our_signup():
    our_id = "user-" + str(uuid.uuid4())
    name = request.form["name"]
    email = request.form["mail"]
    password = request.form["password"]
    datetime2 = datetime.datetime.now()# now time
    datetime3 = datetime2 + relativedelta(hours=8)
    print(name, email, password)
    with open("static/data/ID_and_google.json", "r") as file:
        data = json.load(file)
    if email in data["our_id"]:
        return jsonify({"status":"Email已被使用"})
    else:
        our_id = "user-" + str(uuid.uuid4())
        if email.replace(" ", "") != "":
            if password.replace(" ", "") != "":
                if len(str(password)) >= 6:
                    if name.strip() != "":
                        data["our_id"][email] = our_id
                        data["user_id"][our_id] = {
                            "view_name":
                            name,
                            "email":
                            email,
                            "img":
                            "https://image.bc3ts.net/news_e7aeb614866149f3a7a098c5faf2b4c6.jpg",
                            "admin":
                            "false",
                            "own_article_id": [],
                            "edit_article_id": [],
                            "role":
                            "visitor",
                            "ban":
                            "false",
                            "authorize":
                            "false",
                            "last_login_time":
                            datetime3.strftime("%Y-%m-%d %H:%M:%S"),
                            "login_times":
                            1,
                            "login_type":
                            "CSIEJAR_ID",
                            "user_token":
                            "",
                            "user_id":
                            our_id
                        }
                        data["our_password"][our_id] = password
                        with open("static/data/ID_and_google.json", "w") as file:
                            json.dump(data, file)
                        print(login(our_id))
                        return jsonify({"user":login(our_id),"status":"success"})
                        
                    else:
                        return jsonify({"status":"名稱不得為空"})
                else:
                    return jsonify({"status":"密碼長度不足六位"})
            else:
                return jsonify({"status":"密碼不可空白或含有空格"})
        else:
            return jsonify({"status":"Email不可空白或含有空格"})

"""
你已經進入 帳號-密碼變更區 (CSIEJAR_ID)
"""
@app.route("/api/forgot_password",methods = ["POST","GET","PUT"])
def forgot_pw():
    if request.method == "POST":
        sender = "csiejarjar@gmail.com"
        receiver = request.form.get("email")
        password = "mubmdpixdeoauscz"
        subject = "CSIEJAR ID重設密碼"
        with open("static/data/ID_and_google.json") as file:
            data = json.load(file)
        print(receiver)
        user_id = data["our_id"][receiver]
        name = data["user_id"][user_id]["view_name"]
        with open("static/data/CAPTCHA.json","r") as file:
            CAPTCHA_data = json.load(file)
            CAPTCHA_data["CAPTCHA"][receiver] = {
                            "user":receiver
                        }
            
        
        if (receiver in data["our_id"]):
            if receiver in CAPTCHA_data["CAPTCHA"]:
                # captcha_apply_time = datetime.datetime.strptime(CAPTCHA_data["CAPTCHA"][receiver]["time"],"%Y-%m-%d %H:%M:%S")
                # now = (datetime.datetime.now()  + relativedelta(hours=8))
                # _a = (now - captcha_apply_time).total_seconds() / 60
                # print(_a)
                # if int(_a) > 3:
                    
                    #CAPTCHA Build - start
                    CAPTCHA = str(random.randint(0,9999999))
                    if len(CAPTCHA) < 7:
                        CAPTCHA = "0"*(7-len(CAPTCHA)) + str(CAPTCHA)
                    else:
                        CAPTCHA = CAPTCHA#pass
                    
                    print("驗證碼為"+CAPTCHA)
                    with open("static/data/CAPTCHA.json") as file:
                        data = json.load(file)
                        data["CAPTCHA"][receiver] = {
                            "user":receiver
                        }
                        data["CAPTCHA"][receiver]["user"] = receiver
                        data["CAPTCHA"][receiver]["time"] = (datetime.datetime.now()  + relativedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S")
                        data["CAPTCHA"][receiver]["CAPTCHA"] = CAPTCHA
                    with open("static/data/CAPTCHA.json","w") as file:
                        json.dump(data,file)
                    #CAPTCHA Build - end
                    
                    #Mail Build - start
                    msg = MIMEMultipart("alternative")
                    msg["Subject"] = subject
                    msg["From"] = sender
                    msg["To"] = receiver
                    html = """\
                    <html>
                    <body>
                        嗨 """+name+""" 我們是資工臭甲 聽說你有重設密碼的需求?<br>
                            <p>您的驗證碼為:<br>
                                <b>"""+CAPTCHA+"""</b>
                        </p><p> 請在頁面上輸入此驗證碼 驗證碼有效期只有10分鐘 若超過10分鐘請重新申請</p><br>
                        <a href="https://csiejar.xyz/api/forgot_password?email="""+receiver+"""&CAPTCHA="""+CAPTCHA+"""">點擊我來重設你的密碼</a>
                        <p>如果沒有要重設密碼 忽略此信件即可</p>
                        <p>此為系統自動發送之信件內容 請勿回覆</p>
                            
                    </body>
                    </html>
                    """
                    part = MIMEText(html, "html")
                    msg.attach(part)
                    
                    context = ssl.create_default_context()
                    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                        server.login(sender, password)
                        server.sendmail(
                            sender, receiver, msg.as_string()
                        )
                        print("Email成功寄出 收件者為"+name+"("+receiver+")")
                        return jsonify({"status":"成功寄出"})
                    #Mail Build - end
                # else:
                #     return jsonify({"status":"速率限制"})
            else:
                #CAPTCHA Build - start
                    CAPTCHA = str(random.randint(0,9999999))
                    if len(CAPTCHA) < 7:
                        CAPTCHA = "0"*(7-len(CAPTCHA)) + str(CAPTCHA)
                    else:
                        CAPTCHA = CAPTCHA#pass
                    
                    print("驗證碼為"+CAPTCHA)
                    with open("static/data/CAPTCHA.json") as file:
                        data = json.load(file)
                        data["CAPTCHA"][receiver] = {
                            "user":receiver
                        }
                        data["CAPTCHA"][receiver]["user"] = receiver
                        data["CAPTCHA"][receiver]["time"] = (datetime.datetime.now()  + relativedelta(hours=8)).strftime("%Y-%m-%d %H:%M:%S")
                        data["CAPTCHA"][receiver]["CAPTCHA"] = CAPTCHA
                    with open("static/data/CAPTCHA.json","w") as file:
                        json.dump(data,file)
                    #CAPTCHA Build - end
                    
                    #Mail Build - start
                    msg = MIMEMultipart("alternative")
                    msg["Subject"] = subject
                    msg["From"] = sender
                    msg["To"] = receiver
                    html = """\
                    <html>
                    <body>
                        嗨 """+name+""" 我們是資工臭甲 聽說你有重設密碼的需求?<br>
                            <p>您的驗證碼為:<br>
                                <b>"""+CAPTCHA+"""</b>
                        </p><p> 請在頁面上輸入此驗證碼 驗證碼有效期只有10分鐘 若超過10分鐘請重新申請</p><br>
                        <a href="https://csiejar.xyz/api/change_password?email="""+receiver+"""&CAPTCHA="""+CAPTCHA+"""">點擊我來重設你的密碼</a>
                        <p>如果沒有要重設密碼 忽略此信件即可</p>
                        <p>此為系統自動發送之信件內容 請勿回覆</p>
                            
                    </body>
                    </html>
                    """
                    part = MIMEText(html, "html")
                    msg.attach(part)
                    
                    context = ssl.create_default_context()
                    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
                        server.login(sender, password)
                        server.sendmail(
                            sender, receiver, msg.as_string()
                        )
                        print("Email成功寄出 收件者為"+name+"("+receiver+")")
                        return jsonify({"status":"成功寄出"})
                    #Mail Build - end
        else:
            return jsonify({"status":"你沒有CSIEJAR ID的帳號"})
    elif request.method == "GET":#
        email = request.args.get("email")
        CAPTCHA = request.args.get("CAPTCHA")
        with open("static/data/CAPTCHA.json","r") as file:
            data = json.load(file)
        if email in data["CAPTCHA"]:
            
            if data["CAPTCHA"][email]["CAPTCHA"] == CAPTCHA:
                # return jsonify({"status":"驗證碼正確"})
                return render_template("forget_change_password.html",
                               component_html_obj=component_html_obj)
            else:
                # return jsonify({"status":"驗證碼錯誤"})
                return "<h1>驗證不成功!!</h1>"
        else:
            # return jsonify({"status":"你沒有申請過驗證碼"})
             return "<h1>不要甲了 你根本沒有驗證碼</h1>"
    elif request.method == "PUT":#
        email = request.form.get("email")
        CAPTCHA = request.form.get("CAPTCHA")
        password = request.form.get("password")
        with open("static/data/CAPTCHA.json","r") as file:
            data = json.load(file)
        with open("static/data/ID_and_google.json","r") as file:
            acdata = json.load(file)
        if email in data["CAPTCHA"]:
            if data["CAPTCHA"][email]["CAPTCHA"] == CAPTCHA:
                # return jsonify({"status":"驗證碼正確"})
                print("驗證碼正確")
                email_to_id = acdata["our_id"][email]
                acdata["our_password"][email_to_id]=password
                with open("static/data/ID_and_google.json","w") as file:
                    json.dump(acdata,file)
                return jsonify({"status":"success"})
            else:
                # return jsonify({"status":"驗證碼錯誤"})
                return jsonify({"status":"驗證不成功"})
        else:
            # return jsonify({"status":"你沒有申請過驗證碼"})
            return jsonify({"status":"沒有驗證碼"})
            
@app.route("/api/change_password",methods = ["POST"])
def change_password():
    user_id = request.form.get("user_id")
    user_token = request.form.get("user_token")
    old_password = request.form.get("old_password")
    new_password = request.form.get("new_password")
    print(user_id,
user_token,
old_password,
new_password)    
    with open("static/data/ID_and_google.json" , "r") as file:
        data = json.load(file)

    print(data["user_id"][user_id]["user_token"] == user_token)
    print(data["our_password"][user_id] == old_password)
    print(old_password)
    
    if (data["user_id"][user_id]["user_token"] == user_token):
        if (data["our_password"][user_id] == old_password):
            data["our_password"][user_id] = new_password
            if new_password == old_password:
                return jsonify({"status":"舊密碼和新密碼不得相同"})
            else:
                with open("static/data/ID_and_google.json" , "w") as file:
                    json.dump(data,file)
                return jsonify({"status":"success","user":update_token(user_id)})
        else:
            return jsonify({"status":"舊密碼錯誤"})
    else:
        return jsonify({"status":"fail","user":login(user_id)})



#TODO: 未來這邊會有 eportal 登入 !!


#?↑-↑-↑-↑-↑-↑-↑-↑-↑-↑ 帳號區 結束 ↑-↑-↑-↑-↑-↑-↑-↑-↑-↑
#====================>.< 緩衝區 >.<===================
#?↓-↓-↓-↓-↓-↓-↓-↓-↓-↓ 文章區 開始 ↓-↓-↓-↓-↓-↓-↓-↓-↓-↓

@app.route('/api/article_type', methods=["GET"])  # 動態取得文章類別
def article_type():
    with open("static/data/article_data.json", "r") as file:
        data = json.load(file)
    output = data["article_type"]
    return jsonify(output)


@app.route('/article/<article_id>', methods=["GET"]) #文章頁面 by article id
def article_page(article_id):
    with open("static/data/article_data.json", "r") as file:
        data = json.load(file)

    status = True
    try:
        article_dict = data["article_id"][article_id]

    except KeyError:
        status = False

    finally:
        if status:
            return render_template("article_page.html",
                                   component_html_obj=component_html_obj,
                                   article_dict=article_dict)
        else:
            return render_template("noPage.html",
                                   component_html_obj=component_html_obj)

@app.route('/article_edit/<article_id>', methods=["GET"])
def article_edit(article_id):
    return render_template("article_edit.html",
                               component_html_obj=component_html_obj,article_id=article_id)

def package_dict(dict, allow_sub):
    article_content = {}
    for j in dict:
        if j in allow_sub:
            article_content[j] = dict[j]
    return article_content


@app.route('/api/article', methods=["GET", "POST","DELETE","PUT"])  # article obj return api
def article_api():
    
    if request.method == "POST": #文章新增
        with open("static/data/article_data.json", "r") as file:
            data = json.load(file)
        with open("static/data/article_data.json", "w") as file:
            data["article_amount"] += 1
            json.dump(data, file)
        subject = request.form["subject"]
        content = request.form["content"]
        article_type = request.form["article_type"]
        article_img_url = request.form["article_img_url"]
        isupload = request.form["isupload"]
        print(isupload)
        ishome = request.form["ishome"]
        home_delete_time = request.form["home_delete_time"]
        ishome_img = request.form["ishome_img"]
        home_img_delete_time = request.form["home_img_delete_time"]
        big_img_url = request.form["big_img_url"]
        article_owner_id = request.form["article_owner_id"]
        article_img_file_id = request.form["article_img_file_id"]
        big_img_file_id = request.form["big_img_file_id"]
        user_token = request.form["user_token"]
        
        article_dict = create_article({
            "subject": subject,  # 標題
            "content": content,  # 內文
            "article_type": article_type,  # 類型
            "article_img_url": article_img_url,  # 文章中圖片*
            "article_img_file_id": article_img_file_id,
            "isupload":isupload,
            "ishome": ishome,  # 顯示首頁中間區域
            "home_delete_time": home_delete_time,  # 首頁中間區域下架時間
            "ishome_img": ishome_img,  # 顯示首頁上方區域
            "home_img_delete_time": home_img_delete_time,  # 顯示首頁上方下架時間
            "big_img_url": big_img_url,  # 文章大圖片
            "big_img_file_id":big_img_file_id,
            "article_owner_id": article_owner_id,  # user id
            "user_token": user_token  # user token
        })

        # return jsonify({"article_dict":""})
        return jsonify({
            "article_dict": article_dict,
            "user_token": login(article_owner_id)["user_token"]
        })
    elif request.method == "GET": #文章取得 依不同類型 news card home ...
        article_id = request.args.get("article_id")
        get_mode = request.args.get("get_mode")
        with open("static/data/article_data.json", "r") as file:
            data = json.load(file)
        with open("static/data/server.json", "r") as file:
            server_data = json.load(file)
        # with open("static/data/article_data.json", "w") as file:
        #     data["article_amount"] += 1
        #     json.dump(data, file)
        output = {}
        
        allow_sub = server_data["article_allow_sub"][get_mode]

        if get_mode == None:
            print("none")
        elif get_mode == "full":  #全頁文章
            print("全頁文章")
            output[article_id] = data["article_id"][article_id]
        elif get_mode == "home":  #首頁區\
            print("首頁區")
            for i in data["article_id"]:
                article_content = {}
                now_article = data["article_id"][i]
                if now_article["ishome"] == "true":
                    output[i] = package_dict(now_article, allow_sub)
        elif get_mode == "home_img":  #首頁大圖區
            print("首頁區")
            for i in data["article_id"]:
                article_content = {}
                now_article = data["article_id"][i]
                if now_article["ishome_img"] == "true":
                    output[i] = package_dict(now_article, allow_sub)
        elif get_mode == "article":  #文章分頁編輯
            print("首頁區")
            user_id = request.args.get("user_id")
            for i in data["article_id"]:
                article_content = {}
                now_article = data["article_id"][i]
                if now_article["article_owner_id"] == user_id:
                    output[i] = package_dict(now_article, allow_sub)
            print("文章分頁編輯")

        elif get_mode == "card":  #文章(依文章類型分類
            article_type = request.args.get("article_type")
            print("首頁區")
            for i in data["article_id"]:
                article_content = {}
                now_article = data["article_id"][i]
                if now_article["article_type"] == article_type:
                    output[i] = package_dict(now_article, allow_sub)
            print("文章預覽")
        

        return jsonify({"article": output})
    elif request.method == "DELETE": #文章刪除
        article_id = request.form.get('article_id')
        user_id = request.form.get("user_id")
        user_token = request.form.get("user_token")
        print(article_id,user_id,user_token)
        
        with open("static/data/ID_and_google.json","r") as file:
            data = json.load(file)
            status = ""            
            #若身分為admin或有文章編輯權 可刪
            print(data["user_id"][user_id]["admin"])
            print(article_id in data["user_id"][user_id]["own_article_id"])
            if data["user_id"][user_id]["user_token"] == user_token:
                if (data["user_id"][user_id]["admin"] == "true") or (article_id in data["user_id"][user_id]["own_article_id"]):
                    with open("static/data/article_data.json", "r") as file:
                        data = json.load(file)
                    if article_id in data["article_id"]:
                        big_img_file_id = data["article_id"][article_id]["big_img_file_id"]
                        article_img_file_id = data["article_id"][article_id]["article_img_file_id"]
                        imagekit = ImageKit(
                            public_key='public_4YpxagNybX9kAXW6yNx8x9XnFX0=',
                            private_key='private_S9iytnyLQd+abJCWH7H/iwygXHc=',
                            url_endpoint='https://ik.imagekit.io/csiejarimgstorage')
                        if article_img_file_id != "":
                            imagekit.delete_file(article_img_file_id)
                        if big_img_file_id != "":
                            imagekit.delete_file(big_img_file_id)
                        print("刪除成功")
                        with open("static/data/article_data.json", "w") as file:
                            del data["article_id"][article_id]
                            json.dump(data, file)
                            status = "success"
                    else:
                        status = "Article is not define"
                else:
                    status = "Permission Error"
            else:
                status = "token is not currect"

        new_token = login(user_id)["user_token"]
        output = {"status":status,"user_token":new_token}
        return jsonify(output)
    elif request.method == "PUT": #文章編輯
        #跟前端要資料
        change = request.form.get("change")
        change_data = request.form.get("change_data")
        change_data_dict = eval(change_data)
        change_list = change.split(",")
        article_id = request.form.get("article_id")
        user_id = request.form.get("user_id")
        user_token = request.form.get("user_token")
        allow = ["content","subject","article_img_url","big_img_url","ishome","home_delete_time","ishome_img","home_img_delete_time","isupload"]
        datetime2 = datetime.datetime.now()# now time
        datetime3 = datetime2 + relativedelta(hours=8)
        with open("static/data/ID_and_google.json") as file:
            data = json.load(file)
            user_name = data["user_id"][user_id]["view_name"]
        if (data["user_id"][user_id]["user_token"] == user_token) and((article_id in data["user_id"][user_id]["own_article_id"])or(data["user_id"][user_id]["admin"] == "true")):
            with open("static/data/article_data.json","r") as file:
                data = json.load(file)
            
            for i in change_list:
                if i in allow:
                    data["article_id"][article_id][i] = change_data_dict[i]
                else:
                    pass
            data["article_id"][article_id]["last_edit_time"] = datetime3.strftime("%Y-%m-%d %H:%M:%S")
            data["article_id"][article_id]["last_editor_id"] = user_id
            data["article_id"][article_id]["last_editor_name"] = user_name
            with open("static/data/article_data.json","w") as file:
                json.dump(data,file)
            print(change_list)
            status = "success"
        else:
            status = "Permission error"
        return jsonify({"user_token":update_token(user_id),"status":tatus})
        


#?↑-↑-↑-↑-↑-↑-↑-↑-↑-↑ 文章區 結束 ↑-↑-↑-↑-↑-↑-↑-↑-↑-↑
#====================>.< 緩衝區 >.<===================
#?↓-↓-↓-↓-↓-↓-↓-↓-↓-↓ 其他資料區 開始 ↓-↓-↓-↓-↓-↓-↓-↓-↓-↓

@app.route('/curriculum/<curriculum_num>') #課表回傳html檔
def curriculum_html(curriculum_num):
    if curriculum_num == "1_2":
        return render_template("curriculum1_2.html")
    else:
        return "尚未有資料"

@app.route('/api/fast_link', methods=["POST","GET","PUT","DELETE"])
def fast_link():
    if request.method == "POST":
        title = request.form.get("title")
        link = request.form.get("link")
        user_id = request.form.get("user_id")
        user_token = request.form.get("user_token")
        
        with open("static/data/ID_and_google.json","r") as file:
            data = json.load(file)
        if (data["user_id"][user_id]["admin"] == "true") and check_token(user_id,user_token):
            with open("static/data/fast_link.json","r") as file:
                data = json.load(file)
            link_id = "link-"+str(uuid.uuid4())
            data["fast_link"][link_id] = {
              "title":title,
              "link":link,
                "link_id":link_id
            }
            with open("static/data/fast_link.json","w") as file:
                json.dump(data,file)
            
            
            return jsonify({"status":"success","fast_link":data["fast_link"][link_id]})
        else:
            return jsonify({"status":"你沒有權限"})
        
    elif request.method == "GET":
        with open("static/data/fast_link.json","r") as file:
            data = json.load(file)
            
        return jsonify({"fast_link":data["fast_link"]})
    
    elif request.method == "PUT":
        user_id = request.form.get("user_id")
        user_token = request.form.get("user_token")
        link_id = request.form.get("link_id")
        new_title = request.form.get("new_title")
        new_link = request.form.get("new_link")
        with open("static/data/ID_and_google.json","r") as file:
            data = json.load(file)
        if (data["user_id"][user_id]["admin"] == "true") and check_token(user_id,user_token):
            with open("static/data/fast_link.json","r") as file:
                data = json.load(file)
            data["fast_link"][link_id] = {
                "title":new_title,
                  "link":new_link
            }
            with open("static/data/fast_link.json","w") as file:
                json.dump(data,file)
            
            return jsonify({"status":"success","new_fast_link":data["fast_link"][link_id]})
        else:
            return jsonify({"status":"你沒有權限"})
    elif request.method == "DELETE":
        user_id = request.form.get("user_id")
        user_token = request.form.get("user_token")
        link_id = request.form.get("link_id")
        with open("static/data/ID_and_google.json","r") as file:
            data = json.load(file)
        if (data["user_id"][user_id]["admin"] == "true") and check_token(user_id,user_token):
            with open("static/data/fast_link.json","r") as file:
                data = json.load(file)
            del data["fast_link"][link_id]
            with open("static/data/fast_link.json","w") as file:
                json.dump(data,file)
            
            return jsonify({"status":"success"})
        else:
            return jsonify({"status":"你沒有權限"})@app.route("/api/manager" , methods=["GET"])




@app.route('/returnError', methods=["POST"])  # return error form
def returnError():  # response private_key
    if request.method == "POST":
        returnErrorDictNum = "error-" + str(uuid.uuid4())
        returnErrorDict = {
            "return_page_input": request.form.get("return_page_input"),
            "return_title_input": request.form.get("return_title_input"),
            "return_content_input": request.form.get("return_content_input"),
            "return_img_url_input": request.form.get("return_img_url_input"),
            "return_mail_input": request.form.get("return_mail_input"),
            "returnErrorDictNum": returnErrorDictNum
        }
        with open("static/data/server.json", "r") as file:
            data = json.load(file)
        data["returnError"][returnErrorDictNum] = returnErrorDict
        with open("static/data/server.json", "w") as file:
            json.dump(data, file)
        return jsonify({"go": "go"})

#?↑-↑-↑-↑-↑-↑-↑-↑-↑-↑ 其他資料區 結束 ↑-↑-↑-↑-↑-↑-↑-↑-↑-↑

#?↓-↓-↓-↓-↓-↓-↓-↓-↓-↓ 使用者權限區 開始 ↓-↓-↓-↓-↓-↓-↓-↓-↓-↓

@app.route('/api/user',methods =["PUT","DELETE"])
def user_change():
    if request.method == "PUT":
        change = request.form.get("change")
        change_data = request.form.get("change_data")
        user_id = request.form.get("user_id")
        user_token = request.form.get("user_token")
        change_data_dict = eval(change_data)
        change_list = change.split(",")
        allow = ["view_name","img"]
    
        with open("static/data/ID_and_google.json","r") as file:
                data = json.load(file)
        if user_token == data["user_id"][user_id]["user_token"]:
            for i in change_list:
                if i in allow:
                    data["user_id"][user_id][i] = change_data_dict[i]
                else:
                    pass
            status = "success"
        else:
            status = "token_error"
        with open("static/data/ID_and_google.json","w") as file:
            json.dump(data,file)
        return jsonify({"user_token":update_token(user_id),"status":status,"value":change_data_dict[i]})

    #註銷帳號
    elif request.method == "DELETE":
        user_id = request.args.get("user_id")
        want_delete_user_id = request.args.get("want_delete_user_id")
        user_token = request.args.get("user_token")
        with open("static/data/ID_and_google.json","r") as file:
            data = json.load(file)
        #自行註銷
        if (user_id == want_delete_user_id) and (user_token == data["user_id"][user_id]["user_token"]):
            if data["user_id"][user_id]["login_type"] == "google":
                google_id = data["user_id"][user_id]["google_id"]
                del data["google_id"][google_id]
                del data["user_id"][user_id]
            del data["user_id"][user_id]
            
            if data["user_id"][user_id]["login_type"] == "CSIEJAR ID":
                user_email = data["user_id"][user_id]["email"]
                del data["user_id"][user_id]
                del data["our_password"][user_id]
                del data["our_id"][user_email]
            with open("static/data/ID_and_google.json","w") as file:
                json.dump(data,file)
            return "自行刪除成功"
        #管理員刪除
        elif (data["user_id"][user_id]["admin"] == "true") and (user_token == data["user_id"][user_id]["user_token"]):
            if data["user_id"][want_delete_user_id]["login_type"] == "google":
                google_id = data["user_id"][want_delete_user_id]["google_id"]
                del data["google_id"][google_id]
                del data["user_id"][want_delete_user_id]
            if data["user_id"][want_delete_user_id]["login_type"] == "CSIEJAR ID":
                want_delete_user_email = data["user_id"][want_delete_user_id]["email"]
                del data["user_id"][want_delete_user_id]
                del data["our_password"][want_delete_user_id]
                del data["our_id"][want_delete_user_email]
            new_token = update_token(user_id)
            data["user_id"][user_id]["user_token"] = new_token
            print(user_id+"的新token為"+new_token)
            with open("static/data/ID_and_google.json","w") as file:
                json.dump(data,file)
            return "管理員刪除成功"
        else:
            return "你沒有權限或者Token錯誤"
    
@app.route('/api/admin',methods =["POST","DELETE"])
def admin():
    #新增管理者
    if request.method == "POST":
        user_id = request.args.get("user_id")
        user_token = request.args.get("user_token")
        new_admin_id = request.args.get("new_admin_id")
        with open("static/data/ID_and_google.json") as file:
            data = json.load(file)
        if data["user_id"][new_admin_id]["admin"] == "true":
            return "此用戶已為管理員"
        elif (data["user_id"][user_id]["admin"] == "true") and (user_token == data["user_id"][user_id]["user_token"]):
            data["user_id"][new_admin_id]["admin"] = "true"
            data["user_id"][new_admin_id]["role"] = "admin"
            new_token = update_token(user_id)
            data["user_id"][user_id]["user_token"] = new_token
            print(user_id+"的新token為"+new_token)
            
            new_token = update_token(new_admin_id)
            data["user_id"][new_admin_id]["user_token"] = new_token
            print(new_admin_id+"的新token為"+new_token)
            
            with open("static/data/ID_and_google.json","w") as file:
                json.dump(data,file)
            return "管理者新增成功"
        else:
            return "你沒有權限"

    #刪除管理者
    elif request.method == "DELETE":
        user_id = request.args.get("user_id")
        user_token = request.args.get("user_token")
        remove_admin_id = request.args.get("remove_admin_id")
        with open("static/data/ID_and_google.json","r") as file:
            data = json.load(file)
        if (data["user_id"][user_id]["admin"] == "true") and (data["user_id"][remove_admin_id]["admin"] == "true") and (data["user_id"][user_id]["user_token"] == user_token):
            data["user_id"][remove_admin_id]["admin"] = "false"
            data["user_id"][remove_admin_id]["role"] = "visitor"
            new_token = update_token(user_id)
            data["user_id"][user_id]["user_token"] = new_token
            print(user_id+"的新token為"+new_token)
            
            new_token = update_token(remove_admin_id)
            data["user_id"][remove_admin_id]["user_token"] = new_token
            print(remove_admin_id+"的新token為"+new_token)
            with open("static/data/ID_and_google.json","w") as file:
                json.dump(data,file)
            return "完成"
        else:
            return "失敗"



#?↑-↑-↑-↑-↑-↑-↑-↑-↑-↑ 使用者權限區 結束 ↑-↑-↑-↑-↑-↑-↑-↑-↑-↑



#當送出文章按鈕被按下 執行函式

#?↓-↓-↓-↓-↓-↓-↓-↓-↓-↓ 其他怪怪的API區 開始 ↓-↓-↓-↓-↓-↓-↓-↓-↓-↓

def reflashImagekitKey():  # kitimage get private_key
    imagekit = ImageKit(
        public_key='public_4YpxagNybX9kAXW6yNx8x9XnFX0=',
        private_key='private_S9iytnyLQd+abJCWH7H/iwygXHc=',
        url_endpoint='https://ik.imagekit.io/csiejarimgstorage')
    auth_params = imagekit.get_authentication_parameters()
    return auth_params
@app.route('/uploadImage', methods=["POST"]) #imagekit private key get api
def returnPrivateKay():  # response private_key
    if request.method == "POST":
        return jsonify(reflashImagekitKey())

@app.route('/data_update')  # update by uptime robot
def data_update():
    with open("static/data/article_data.json","r")as file:
        data = json.load(file)
    for i in data["article_id"]:
        if str(datetime.datetime.now().strftime("%Y-%m-%d")) == data["article_id"][i]["home_delete_time"]:
            data["article_id"][i]["ishome"] = "false"
        elif str(datetime.datetime.now().strftime("%Y-%m-%d")) == data["article_id"][i]["home_img_delete_time"]:
            data["article_id"][i]["ishome_img"] = "false"
        else:
            pass
    print(request.method)
    print("UptimeRobot更新完成")
    return "successful"

        
#?↑-↑-↑-↑-↑-↑-↑-↑-↑-↑ 其他怪怪的API區 結束 ↑-↑-↑-↑-↑-↑-↑-↑-↑-↑


#? 不知道幹嘛用的 function @嘎嘎嘎嘎 分個類八

def create_article_id(type, amount, final):
    with open("static/data/article_data.json") as file:
        data = json.load(file)
    amount = str(data["article_amount"])
    article_id = type + (final - len(amount)) * "0" + amount
    return article_id


def create_article(article_dict):
    with open("static/data/ID_and_google.json") as file:
        id_data = json.load(file)
    article_type = article_dict["article_type"]
    with open("static/data/article_data.json") as file:
        data = json.load(file)
    amount = str(data["article_amount"])
    article_id = create_article_id(article_type, amount, 5)
    article_dict["article_id"] = article_id
    article_dict["article_link"] = f"/article/{article_dict['article_id']}"
    user_id = article_dict["article_owner_id"]
    if (id_data["user_id"][user_id]["authorize"] == "false") or (id_data["user_id"][user_id]["ban"] == "true"):
        article_dict["ischeck"] = "false"
    else:
        article_dict["ischeck"] = "true"
    article_dict["article_owner_name"] = id_data["user_id"][user_id][
        "view_name"]
    article_dict["article_owner_img"] = id_data["user_id"][user_id][
        "img"]
    article_dict["create_time"] = datetime.datetime.now()
    article_dict["last_edit_time"] = article_dict["create_time"]
    article_dict["last_editor_name"] = article_dict["article_owner_name"]
    article_dict["last_editor_id"] = user_id

    # article_dict["isupload"] 前端處理
    with open("static/data/article_data.json", "r") as file:
        data = json.load(file)

    print("data1", data)
    data["article_id"][article_dict["article_id"]] = article_dict

    print("data2", data)
    with open("static/data/article_data.json", "w") as file:
        json.dump(data, file)

    with open("static/data/ID_and_google.json","r") as file:
        data = json.load(file)
        data["user_id"][user_id]["own_article_id"].append(article_id)
        data["user_id"][user_id]["edit_article_id"].append(article_id)
    with open("static/data/ID_and_google.json","w") as file:
        json.dump(data,file)
    return article_dict




def check_dict(val1,val2):
    if val2 == "all":
        return True
    else:
        return val1 in val2.split(",")
    # return True
def check_dict2(now_article,val1):
    for i in val1.split(","):
        if now_article[i] == "true":
            return True
    return False
@app.route("/api/manager" , methods=["GET"]) #!壞了>.<
def manager():
    if request.method == "GET":
        manager_setting = request.args.get("manager_setting")
        # user_id = request.args.get("user_id")
        # user_token = request.args.get("user_token")
        with open("static/data/article_data.json","r") as file:
            data = json.load(file)

        with open("static/data/server.json", "r") as file:
            server_data = json.load(file)
        allow_sub = server_data["article_allow_sub"]["manager"]
        
        output = {}
        
        # allow_sub = server_data["article_allow_sub"][get_mode]
        #string
        print(manager_setting)
        manager_setting_dict = json.loads(manager_setting)
        #dict
        print(manager_setting_dict["ischeck_selector"])
        # if (data["user_id"][user_id]["admin"] == "true") and (data["user_id"][user_id]["user_token"] == user_token):
        for i in data["article_id"]:
            article_content = {}
            now_article = data["article_id"][i]
            # print(i,now_article["ischeck"])
            print(i,manager_setting_dict["other_selector"])
            print(check_dict2(now_article,manager_setting_dict["other_selector"]))
            if check_dict(now_article["ischeck"],manager_setting_dict["ischeck_selector"]):
                if check_dict(now_article["isupload"],manager_setting_dict["isupload_selector"]):
                    if check_dict(now_article["article_type"],manager_setting_dict["article_type_selector"]):
                        # if check_dict2(now_article,manager_setting_dict["other_selector"]):
                        output[i] = package_dict(now_article, allow_sub)
                    
                # if check_dict(now_article[]):#全部通過
                    # if manager_setting_dict["other_selector"] == "all":
                    #     print("ff")
                    
            # output[i] = package_dict(now_article, allow_sub)
            # print("文章預覽")


            # article_type = request.args.get("article_type")
            # print("首頁區")
            # for i in data["article_id"]:
            #     article_content = {}
            #     now_article = data["article_id"][i]
            #     if now_article["article_type"] == article_type:
            #         output[i] = package_dict(now_article, allow_sub)
            # print("文章預覽")
        # print("fff")
    return jsonify({"output":output})


#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
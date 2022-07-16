from flask import Flask, render_template, request, json, jsonify, redirect, url_for
import time, datetime, sys, codecs, uuid
from bs4 import BeautifulSoup
import datetime
import mail

# google login import
from google.oauth2 import id_token
from google.auth.transport import requests

import base64  # imgkit
import os  # imgkit
from imagekitio import ImageKit  # imgkit

app = Flask(__name__)


def reflashImagekitKey():  # kitimage get private_key
    imagekit = ImageKit(
        public_key='public_4YpxagNybX9kAXW6yNx8x9XnFX0=',
        private_key='private_S9iytnyLQd+abJCWH7H/iwygXHc=',
        url_endpoint='https://ik.imagekit.io/csiejarimgstorage')
    auth_params = imagekit.get_authentication_parameters()
    return auth_params


def component_html(tag, id, innerTags=False):
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
    return redirect(url_for("page", pageName="home"))


@app.route('/<pageName>')
def page(pageName):

    if pageName == "home":
        return render_template("home.html",
                               component_html_obj=component_html_obj)
    elif pageName == "news":
        return render_template("news.html",
                               component_html_obj=component_html_obj)
    elif pageName == "curriculum":
        return render_template("curriculum.html",
                               component_html_obj=component_html_obj)
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
        return render_template("article_edit.html",
                               component_html_obj=component_html_obj)
    elif pageName == "login":
        return render_template("login.html",
                               component_html_obj=component_html_obj)
    elif pageName == "forgot_password":
        return render_template("forget_password.html",
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
        "google_img": picture,
        "own_article_id": {},
        "edit_article_id": {},
        "role": "visitor",
        "ban": "false",
        "authorize": "false",
        "last_login_time":
        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
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


# @app.route('/google',methods=["POST"])
# def google_login():
#   with open("static/data/ID_and_google") as file:
#         data = json.load(file)

#   try:
#     id = request.form.get("id")
#     name = request.form.get("name")
#     user_id = data["google_id"][id]

#   except KeyError:
#       email = request.form.get("email")
#       create_account(id,name,email)

#   return jsonify({"message":"true","passcode":create_user_id(id)})


@app.route('/api/login', methods=["post"])  #login by cookie user info
def api_login():
    login_type = request.form.get('login_type')
    user_id = request.form.get('user_id')
    user_token = request.form.get('user_token')
    print("login_type", login_type)
    print("user_id", user_id)
    print("user_token", user_token)
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)

    try:
        currect_token = data["user_id"][user_id]["user_token"]
        print("currect_token", currect_token)
        if currect_token == user_token:
            user = login(user_id)
            output = {"message": "pass", "user": user}
            print("after user_token", user["user_token"])
        else:
            output = {"message": "user token useless"}
    except KeyError:
        output = {"message": "user id not defind"}

    return jsonify(output)


def login(now_user_id):
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)
    token = "token-" + str(uuid.uuid4())
    data["user_id"][now_user_id]["user_token"] = token

    with open("static/data/ID_and_google.json", "w") as file:
        json.dump(data, file)
    return data["user_id"][now_user_id]


CLIENT_ID = "513159013962-1bp03rago46o75rlq51ktj17qqk2d06t.apps.googleusercontent.com"


@app.route('/google_check_test', methods=["POST"])  #google id token
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


@app.route('/uploadImage', methods=["POST"])
def returnPrivateKay():  # response private_key
    if request.method == "POST":
        return jsonify(reflashImagekitKey())


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


@app.route('/api/article_type', methods=["GET"])  # get article type(edit show)
def article_type():
    with open("static/data/article_data.json", "r") as file:
        data = json.load(file)
    output = data["article_type"]
    return jsonify(output)


@app.route('/article/<article_id>', methods=["GET"])
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


def package_dict(dict, allow_sub):
    article_content = {}
    for j in dict:
        if j in allow_sub:
            article_content[j] = dict[j]
    return article_content


@app.route('/api/article', methods=["GET", "POST"])  # article obj return api
def test():
    if request.method == "POST":
        with open("static/data/article_data.json", "r") as file:
            data = json.load(file)
        with open("static/data/article_data.json", "w") as file:
            data["article_amount"] += 1
            json.dump(data, file)
        subject = request.form["subject"]
        content = request.form["content"]
        article_type = request.form["article_type"]
        article_img_url = request.form["article_img_url"]
        ishome = request.form["ishome"]
        home_delete_time = request.form["home_delete_time"]
        ishome_img = request.form["ishome_img"]
        home_img_delete_time = request.form["home_img_delete_time"]
        big_img_url = request.form["big_img_url"]
        article_owner_id = request.form["article_owner_id"]
        user_token = request.form["user_token"]
        article_dict = create_article({
            "subject": subject,  # 標題
            "content": content,  # 內文
            "article_type": article_type,  # 類型
            "article_img_url": article_img_url,  # 文章中圖片*
            "ishome": ishome,  # 顯示首頁中間區域
            "home_delete_time": home_delete_time,  # 首頁中間區域下架時間
            "ishome_img": ishome_img,  # 顯示首頁上方區域
            "home_img_delete_time": home_img_delete_time,  # 顯示首頁上方下架時間
            "big_img_url": big_img_url,  # 文章大圖片
            "article_owner_id": article_owner_id,  # user id
            "user_token": user_token  # user token
        })

        # return jsonify({"article_dict":""})
        return jsonify({
            "article_dict": article_dict,
            "user_token": login(article_owner_id)["user_token"]
        })
    elif request.method == "GET":
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
    elif request.method == "DELETE":
        with open("static/data/article_data.json", "r") as file:
            data = json.load(file)
        with open("static/data/article_data.json", "w") as file:
            data["article_amount"] += 1
            json.dump(data, file)
        article_id = request.form["article_id"]
        user_id = request.form["user_id"]
        user_token = request.form["user_token"]
        
        article_dict = create_article({
            "subject": subject,  # 標題
            "content": content,  # 內文
            "article_type": article_type,  # 類型
            "article_img_url": article_img_url,  # 文章中圖片*
            "ishome": ishome,  # 顯示首頁中間區域
            "home_delete_time": home_delete_time,  # 首頁中間區域下架時間
            "ishome_img": ishome_img,  # 顯示首頁上方區域
            "home_img_delete_time": home_img_delete_time,  # 顯示首頁上方下架時間
            "big_img_url": big_img_url,  # 文章大圖片
            "article_owner_id": article_owner_id,  # user id
            "user_token": user_token  # user token
        })

        # return jsonify({"article_dict":""})
        return jsonify({
            "article_dict": article_dict,
            "user_token": login(article_owner_id)["user_token"]
        })
    elif request.method == "PUT":
        return "ff"


@app.route('/data_update')  # update by uptime robot
def data_update():
    print(request.method)
    print("data_update success!")
    return "successful"


#當送出文章按鈕被按下 執行函式


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
    article_dict["article_id"] = create_article_id(article_type, amount, 5)
    article_dict["article_link"] = f"/article/{article_dict['article_id']}"
    article_dict["ischeck"] = False
    user_id = article_dict["article_owner_id"]
    article_dict["article_owner_name"] = id_data["user_id"][user_id][
        "view_name"]
    article_dict["article_owner_img"] = id_data["user_id"][user_id][
        "google_img"]
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
    return article_dict


#our_login_system
@app.route('/api/our_login', methods=["POST"])
def our_login():
    with open("static/data/ID_and_google.json") as file:
        data = json.load(file)
    email = request.form["mail"]
    password = request.form["password"]
    our_id = data["our_id"][email]
    if email in data["user_id"][our_id]["email"]:
        our_id = data["our_id"][email]
        if password == data["our_password"][our_id]:
            print("Login!")
            # return email + " is Logged in"
            return render_template("test.html",user=login(our_id),text=email+"登入成功~ ")
        else:
            print("Password Error")
            return "Password Error"
    else:
        print("Error")
        return "找不到這個帳號"


@app.route('/api/our_signup', methods=["POST"])
def our_signup():
    our_id = "user-" + str(uuid.uuid4())
    name = request.form["name"]
    email = request.form["mail"]
    password = request.form["password"]
    print(name, email, password)
    with open("static/data/ID_and_google.json", "r") as file:
        data = json.load(file)
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
                        "own_article_id": {},
                        "edit_article_id": {},
                        "role":
                        "visitor",
                        "ban":
                        "false",
                        "authorize":
                        "false",
                        "last_login_time":
                        datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        "login_times":
                        1,
                        "login_type":
                        "CSIEJAR ID",
                        "user_token":
                        "",
                        "user_id":
                        our_id
                    }
                    data["our_password"][our_id] = password
                    with open("static/data/ID_and_google.json", "w") as file:
                        json.dump(data, file)
                    print(login(our_id))
                    return render_template("test.html",
                                           user=login(our_id),
                                           text="註冊完成~ ")
                    
                else:
                    return "名稱不得為空"
            else:
                return "密碼長度不足六位"
        else:
            return "密碼不可空白或含有空格"
    else:
        return "Email不可空白或含有空格"


#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

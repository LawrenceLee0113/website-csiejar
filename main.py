from flask import Flask, render_template, request, json, jsonify ,redirect,url_for
import time,datetime,sys,codecs,uuid
from bs4 import BeautifulSoup
import datetime

# google login import
from google.oauth2 import id_token
from google.auth.transport import requests

app = Flask(__name__)



def component_html(tag, id, innerTags=False):
  with open("templates/index.html", "r",encoding="utf-8") as f:
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


@app.route('/')
def index_page():
    return redirect(url_for("page", pageName="home"))

@app.route('/test_uptimerobot')
def test_uptimerobot():
    return jsonify({"test":"success"})
@app.route('/<pageName>')
def page(pageName):
    component_html_obj = {
        "top_navbar_html": component_html("nav", "top_navbar"),
        "error_window_html": "".join([
          str(component_html("div", "errorModalCenter")),
          str(component_html("div", "loginModalCenter")),
          str(component_html("div", "unloginModalCenter"))
          ]),
        "header_info_html": component_html("div", "header_info", True)
    }
    if pageName == "home":
        return render_template("home.html", component_html_obj=component_html_obj)
    elif pageName == "news":
      return render_template("news.html", component_html_obj=component_html_obj)
    elif pageName == "curriculum":
      return render_template("curriculum.html", component_html_obj=component_html_obj)
    elif pageName == "resource":
      return render_template("resource.html", component_html_obj=component_html_obj)
    elif pageName == "classData":
      return render_template("classData.html", component_html_obj=component_html_obj)
    elif pageName == "calendar":
      return render_template("calendar.html", component_html_obj=component_html_obj)
    elif pageName == "article":
      return render_template("article.html", component_html_obj=component_html_obj)
    elif pageName == "manager":
      return render_template("manager.html", component_html_obj=component_html_obj)
    elif pageName == "article_page":
      return render_template("article_edit.html", component_html_obj=component_html_obj)
    else:
        return render_template("noPage.html", component_html_obj=component_html_obj)

def login_by_google(ac,name):
  with open("static/data/ID_and_google.json") as file:
    data = json.load(file)
  if ac in data["user_id"]:
    data["user_id"][ac]["login_times"]+=1
    data["user_id"][ac]["name"]=name
    with open("static/data/ID_and_google.json", "w") as file:
      json.dump(data, file)
    return True
  else:
    return False


def create_account(user_id,name,email,view_name,picture,login_type,id):
  with open("static/data/ID_and_google.json") as file:
    data = json.load(file)
  data["user_id"]["user-"+user_id] = {
      "user_id":"user-"+user_id,
      "admin":"false",
      "google_name":name,
      "view_name":view_name,
      "gmail":email,
      "google_img":picture,
      "own_article_id":{},
      "edit_article_id":{},
    "role":"visitor",
    "ban":"false",
    "authorize":"false",
    "last_login_time":datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "login_times":1,
    "login_type":login_type,
    "google_id":id
  }
  data["google_id"][id] = {
    "user_id":"user-"+user_id
  }
  with open("static/data/ID_and_google.json", "w") as file:
    json.dump(data, file)



def create_user_id(id):
  with open("static/data/ID_and_google.json") as file:
    data = json.load(file)
  user_id = str(uuid.uuid4())
  with open("static/data/ID_and_google.json", "w") as file:
    json.dump(data, file)
  return user_id



@app.route('/google',methods=["POST"])
def google_login():
  try:
    id = request.form.get("id")
    name = request.form.get("name")
    if login_by_google(id,name) == False:
      email = request.form.get("email")
      create_account(id,name,email)
    with open("static/data/amount.json") as file:
      data = json.load(file)
    click = data["accounts"][id]["basic"]["clicks"]
    
    return jsonify({"message":"true","passcode":create_user_id(id),"click":click})

  except Exception:
    return jsonify({"message":"false"})

@app.route('/google_check_test',methods=["POST"])
def google_check_test():
    token_id = request.form.get('token_id')
    client_id = request.form.get('client_id')
    user = {}
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token_id, requests.Request(), client_id)
        print(idinfo)
        user["user_id"] = idinfo['sub']
        user["user_email"] = idinfo["email"]
        user["view_name"] = idinfo["name"]
        user["user_given_name"] = idinfo["given_name"]
        user["user_family_name"] = idinfo["family_name"]
        user["img"] = idinfo["picture"]
        # user["user_locale"] = idinfo["locale"]
        with open("static/data/ID_and_google.json") as file:
          data = json.load(file)
        try:
          now_user_id = data["google_id"][idinfo['sub']]["user_id"]
        except KeyError:
          id = create_user_id(idinfo['sub'])
          create_account(
            id,
            idinfo["name"],
            idinfo["email"],
            idinfo["name"],
            idinfo["picture"],
            "google",
            idinfo['sub']
          )
          now_user_id = "user-"+id
        finally:
          with open("static/data/ID_and_google.json") as file:
              data = json.load(file)
          user = data["user_id"][now_user_id]
    except ValueError:
        # Invalid token
        user["user_id"] = "fail"
        pass
    return jsonify({"user":user})



  

# '''
# "GET"=>R
# "POST"=> C
# "PUT" => U
# "DELETE" => D
# '''
# @app.route('/api/article',methods=["GET","POST","PUT","DELETE"])
# def index_page():
#     if request.method=="GET":
#       a = request.args.get('文章類型')
#       return jsonify({})
#     elif request.method=="POST":
#       request.form.get("")

# '''
# GET:
# 文章類型
# 資料類型:
# 1 大照片 url
# 2 中照片 title content url 
# 3 all 

# '''


@app.route('/api/article', methods=["GET", "POST"])
def test():
  if request.method == "POST":
    subject = request.form["subject"]
    content = request.form["content"]
    article_type = request.form["article_type"]
    article_img_url = request.form["article_img_url"]
    home = request.form["home"]
    home_delete_time = request.form["home_delete_time"]
    home_img = request.form["home_img"]
    home_img_delete_time = request.form["home_img_delete_time"]
    big_img = request.form["big_img"]
    user_id = request.form["user_id"]
    user_token = request.form["user_token"]
    
    print({
        "subject": subject,  # 標題
        "content": content,  # 內文
        "article_type": article_type,  # 類型
        "article_img_url": article_img_url,  # 文章中圖片*
        "ishome": home,  # 顯示首頁中間區域
        "home_delete_time": home_delete_time,  # 首頁中間區域下架時間
        "ishome_img": home_img,  # 顯示首頁上方區域
        "home_img_delete_time": home_img_delete_time,  # 顯示首頁上方下架時間
        "big_img": big_img,  # 文章大圖片
        "article_owner_id": user_id,  # user id
        "user_token": user_token  # user token
    })

    # create_article({
    #     "subject": subject,  # 標題
    #     "content": content,  # 內文
    #     "article_type": article_type,  # 類型
    #     "article_img_url": article_img_url,  # 文章中圖片*
    #     "ishome": home,  # 顯示首頁中間區域
    #     "home_delete_time": home_delete_time,  # 首頁中間區域下架時間
    #     "ishome_img": home_img,  # 顯示首頁上方區域
    #     "home_img_delete_time": home_img_delete_time,  # 顯示首頁上方下架時間
    #     "big_img": big_img,  # 文章大圖片
    #     "article_owner_id": user_id,  # user id
    #     "user_token": user_token  # user token
    # })
    # article_id = create_article_id()
    # with open("static/data/article_data.json") as file:
    #   data = json.load(file)
    # # data = open("static/data/article_data.json", "w")
    # data["article_id"]["article-"+article_id] = {
    #     "article_id":"article-"+article_id
    # }
    # with open("static/data/article_data.json") as file:
    #     data = json.load(file)
    #     data["article_id"]["article-"+article_id] = {
    #         "subject": subject,  # 標題
    #         "content": content,  # 內文
    #         "article_type": article_type,  # 類型
    #         "article_img_url": article_img_url,  # 文章中圖片*
    #         "ishome": home,  # 顯示首頁中間區域
    #         "home_delete_time": home_delete_time,  # 首頁中間區域下架時間
    #         "ishome_img": home_img,  # 顯示首頁上方區域
    #         "home_img_delete_time": home_img_delete_time,  # 顯示首頁上方下架時間
    #         "big_img_url": big_img,  # 文章大圖片
    #         "article_owner_id": user_id,  # user id
    #         "user_token": user_token  # user token
    # }
    
    # with open("static/data/article_data.json", "w") as file:
    #     json.dump(data, file)
    return redirect(url_for("page", pageName="home"))

@app.route('/data_update')
def data_update():
  print(request.method)
  print("data_update success!")
  return "successful"
#當送出文章按鈕被按下 執行函式
def create_article_id():
  article_id = str(uuid.uuid4())
  return article_id
def create_article(article_dict):
    with open("static/data/ID_and_google.json") as file:
        id_data = json.load(file)
    article_dict["article_id"] = "article-"+create_article_id()
    article_dict["article_link"] = f"/article/{article_dict['article_id']}"
    article_dict["ischeck"] = False
    user_id = article_dict["article_owner_id"]
    article_dict["article_owner_name"] = id_data["user_id"][user_id]["view_name"]
    article_dict["article_owner_img"] = id_data["user_id"][user_id]["google_img"]
    article_dict["create_time"] = datetime.datetime.now()
    article_dict["last_edit_time"] = article_dict["create_time"]
    article_dict["last_editor_name"] = article_dict["article_owner_name"]
    article_dict["last_editor_id"] = user_id
    # article_dict["isupload"] 前端處理
    with open("static/data/article_data.json", "r") as file:
        data = json.load(file)
        
    data["article_id"][article_dict["article_id"]] = article_dict
    
    with open("static/data/article_data.json", "w") as file:
        json.dump(data, file)
    
    

    
#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

from flask import Flask, render_template, request, json, jsonify ,redirect,url_for
import time,datetime,sys,codecs,uuid
from bs4 import BeautifulSoup

app = Flask(__name__)



def component_html(tag, id, innerTags=False):
  with open("templates/index.html", "r", encoding='utf-8') as f:
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
       

@app.route('/api/article', methods=["get", "post"])
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
        "home": home,  # 顯示首頁中間區域
        "home_delete_time": home_delete_time,  # 首頁中間區域下架時間
        "home_img": home_img,  # 顯示首頁上方區域
        "home_img_delete_time": home_img_delete_time,  # 顯示首頁上方下架時間
        "big_img": big_img,  # 文章大圖片
        "user_id": user_id,  # user id
        "user_token": user_token  # user token
    })
    return redirect(url_for("page", pageName="home"))


#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

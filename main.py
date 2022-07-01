from flask import Flask, render_template, request, json, jsonify ,redirect,url_for
import time,datetime,sys,codecs,uuid
from bs4 import BeautifulSoup

app = Flask(__name__)

print(f"user-{str(uuid.uuid4())}")

def top_navbar_html():
  with open("templates/index.html", "r", encoding='utf-8') as f:
      text= f.read()
  soup = BeautifulSoup(text, "html.parser")
  result = soup.find("nav", {"id": "top_navbar"})
  return result

@app.route('/')
def index_page():
    return redirect(url_for("page",pageName="home"))

@app.route('/<pageName>')
def page(pageName):
    if pageName == "home":
        return render_template("home.html",top_navbar_html=top_navbar_html())
    elif pageName == "dc_news":
      return render_template("news.html",top_navbar_html=top_navbar_html())
    elif pageName == "curriculum":
      return render_template("curriculum.html",top_navbar_html=top_navbar_html())
    elif pageName == "resource":
      return render_template("resource.html",top_navbar_html=top_navbar_html())
    elif pageName == "classData":
      return render_template("classData.html",top_navbar_html=top_navbar_html())
    elif pageName == "calendar":
      return render_template("calendar.html",top_navbar_html=top_navbar_html())
    else:
        return render_template("noPage.html",top_navbar_html=top_navbar_html())
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

#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
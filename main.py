from flask import Flask, render_template, request, json, jsonify ,redirect,url_for
import time,datetime,sys,codecs
from bs4 import BeautifulSoup

app = Flask(__name__)

def component_html(tag,id):
  with open("templates/index.html", "r", encoding='utf-8') as f:
      text= f.read()
  soup = BeautifulSoup(text, "html.parser")
  result = soup.find(tag, {"id": id})
  return result

@app.route('/')
def index_page():
    return redirect(url_for("page",pageName="home"))

@app.route('/<pageName>')
def page(pageName):
    component_html_obj = {
      "top_navbar_html":component_html("nav","top_navbar"),
      "error_window_html":component_html("div","exampleModalCenter")
      }
    if pageName == "home":
        return render_template("home.html",component_html_obj=component_html_obj)
    elif pageName == "news":
      return render_template("news.html",component_html_obj=component_html_obj)
    elif pageName == "curriculum":
      return render_template("curriculum.html",component_html_obj=component_html_obj)
    elif pageName == "resource":
      return render_template("resource.html",component_html_obj=component_html_obj)
    elif pageName == "classData":
      return render_template("classData.html",component_html_obj=component_html_obj)
    elif pageName == "calendar":
      return render_template("calendar.html",component_html_obj=component_html_obj)
    elif pageName == "article":
      return render_template("article.html",component_html_obj=component_html_obj)
    elif pageName == "manager":
      return render_template("manager.html",component_html_obj=component_html_obj)
    else:
        return render_template("noPage.html",component_html_obj=component_html_obj)

      
#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
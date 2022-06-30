from flask import Flask, render_template, request, json, jsonify ,redirect,url_for
import time,datetime,sys


app = Flask(__name__)


@app.route('/')
def index_page():
    return redirect(url_for("page",pageName="home"))

@app.route('/<pageName>')
def page(pageName):
    if pageName == "home":
        return render_template("home.html")
    elif pageName == "news":
      return render_template("news.html")
    elif pageName == "curriculum":
      return render_template("curriculum.html")
    elif pageName == "resourseLink":
      return render_template("resourseLink.html")
    elif pageName == "classData":
      return render_template("classData.html")
    elif pageName == "calendar":
      return render_template("calendar.html")
    else:
        return render_template("noPage.html")

      
#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
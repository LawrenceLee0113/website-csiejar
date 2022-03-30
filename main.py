from flask import Flask, render_template, request, json, jsonify
import time
import uuid

# print(uuid.uuid4())

app = Flask(__name__)
def addViewAmount():
    with open("static/data/basicData.json", mode="r") as file:
        data = json.load(file)
        data["viewAmount"] += 1
    with open("static/data/basicData.json", mode="w") as file:
        json.dump(data, file)
    return data["viewAmount"]


def backup(pageName, data):
    backupData = {
        "time": time.ctime(time.time() + 28800),
        "pageName": pageName,
        "data": data,
        "other": ""
    }
    with open("static/data/backupPages.json", mode="r") as file:
        data = json.load(file)
        data["backupData"].append(backupData)
    with open("static/data/backupPages.json", mode="w") as file:
        data = json.dump(data, file)


#return csie index html
@app.route('/')
def hello_world():
    amount = addViewAmount()

    return render_template("index.html", viewAmount=amount)


#get page API
@app.route("/content/<htmlName>", methods=["GET"])
def getHtml(htmlName):
  
    with open("static/data/pages.json", mode="r") as file:
        data = json.load(file)
        output = data[htmlName]
    try:
        return jsonify(output)
    except Exception:
        return jsonify("none")


#edit page API
@app.route("/edit-get/<pageName>", methods=["GET", "POST"])
def getPage(pageName):
    if request.method == "GET":
        with open("static/data/pages.json", mode="r") as file:
            data = json.load(file)
            output = data[pageName]
        try:
            return jsonify(output)
        except Exception:
            return "none"
    elif request.method == "POST":
        # print(request.form["data"])
        postPasskey = request.form["passKey"]
        with open("static/data/editKey.json", mode="r") as file:
            data = json.load(file)
            passKey = data[pageName]["nowUploadKey"]
        if postPasskey == passKey:
            r_data = request.form["data"]
            with open("static/data/pages.json", mode="r") as file:

                data = json.load(file)
                data[pageName] = r_data
            try:
                backup(pageName, r_data)
                print(r_data)
                with open("static/data/pages.json", mode="w") as file:
                    json.dump(data, file)
                return jsonify("上傳成功")

            except Exception:
                return jsonify("上傳失敗")
        else:

            return jsonify("憑證碼錯誤")


#get json data API
@app.route("/data/<dataName>", methods=["GET"])
def returnDate(dataName):
    print(dataName)
    try:
        with open("static/data/" + dataName + ".json", mode="r") as file:
            data = json.load(file)
        return jsonify(data)
    except Exception:
        return jsonify({"data": "no data"})


#return editPage html
@app.route("/edit")
def editPage():
    return render_template("editPageHint.html")

    #return editPage html


@app.route("/edit/<pageName>")
def returnEditPageName(pageName):
    return render_template("editPage.html", editPageName=pageName)


#sent comment text Api
@app.route("/comment", methods=["GET","POST"])
def saveComment():
    if request.method == "GET":
        print("asdf")
        with open("static/data/editCommentData.json", mode="r") as file:
            data = json.load(file)
        output = data["commentData"]

        str1 = ""
        num = 0
        for i in output:
            num +=1
            str1 += "第" + str(num) +"條留言：<br> &nbsp;內容:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+i["comment"]+"<br>&nbsp;時間： &nbsp;"+i["time"]+"</p><br>"
        return str1
          

    elif request.method == "POST":
        if request.form["commentText"] == "":
            print("no Text")
            return jsonify("no data")
        else:
            with open("static/data/editCommentData.json", mode="r") as file:
                data = json.load(file)
                data["commentData"].append({
                    "time":
                    time.ctime(time.time() + 28800),
                    "comment":
                    request.form["commentText"]
                })
            with open("static/data/editCommentData.json", mode="w") as file:
                json.dump(data, file)
            return jsonify("感謝您的評論")
    elif request.method == "PUT":
        print("get")
    elif request.method == "DELETE":
        print("get")


#check edit page key API
@app.route("/checkEditKey/<pageName>", methods=["POST"])
def checkKey(pageName):
    postKey = request.form["key"]
    with open("static/data/editKey.json", mode="r") as file:
        data = json.load(file)
        key = data[pageName]["passkey"]

    if key == postKey:
        data[pageName]["nowUploadKey"] = uuid.uuid4()
        with open("static/data/editKey.json", mode="w") as file:
            json.dump(data, file)
        return jsonify({
            "mode": "pass",
            "nowUploadKey": data[pageName]["nowUploadKey"]
        })
    else:
        return jsonify({"mode": "unpass"})


#run server
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)

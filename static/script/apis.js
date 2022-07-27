var authenticationEndpoint = "https://csiejar.xyz/uploadImage";
var uploadData = true;
function change_user_token(new_token){
    user.token = new_token
}
function progress_controller(progressId, num,finish_func=()=>{}) {
    $("#" + progressId).parent().show()
    $("#" + progressId).css("width", `${num}%`).attr("aria-valuenow", `${num}`).html(`${num}%`);
    if (num == "100") {
      setTimeout(() => {
        $("#" + progressId).addClass("bg-success").html("上傳成功").removeClass("progress-bar-animated");
        finish_func()
      }, 500)
    }
  }
function imagekit_uploader({file_id,user_id,user_token,file_name,folder_name,file_type="png",status_func={}}){
    var file = document.getElementById(file_id);
    var formData = new FormData();
    formData.append("file", file.files[0]);
    formData.append("fileName", `${file_name}.${file_type}`);
    formData.append("publicKey","public_4YpxagNybX9kAXW6yNx8x9XnFX0=");
    formData.append("folder",`/web_v2${folder_name}/`);
    // formData.append("useUniqueFileName","false");//唯一照片
    // alert("upload success")
    // Let's get the signature, token and expire from server side
    status_func.status0()
    $.ajax({
        url: authenticationEndpoint,
        method: "POST",
        dataType: "json",
        data:{user_id,user_token},
        success: function (body) {
            // alert("get my web site key success")
            formData.append("signature", body.signature || "");
            formData.append("expire", body.expire || 0);
            formData.append("token", body.token);
            status_func.status1(body)
            // Now call ImageKit.io upload API
            status_func.status2()
            $.ajax({
                url: "https://upload.imagekit.io/api/v1/files/upload",
                method: "POST",
                mimeType: "multipart/form-data",
                dataType: "json",
                data: formData,
                processData: false,
                contentType: false,
                error: function (jqxhr, text, error) {
                    console.log(error)
                },
                success: function (body) {
                    // alert("get url success")
                    status_func.status3(body)
                    
                }
            });
        },
        
        error: function (jqxhr, text, error) {
            console.log(arguments);
        }
    });
}
function view_img(file_id,view_container_id,func=()=>{}){
    $("#"+file_id).change(function(){
        //當檔案改變後，做一些事 
        if(this.files && this.files[0]){
                var reader = new FileReader();
                let src;
                reader.onload = function (e) {
                    src = e.target.result
                $("#"+view_container_id).attr('src', src);
                }
                reader.readAsDataURL(this.files[0]);
                func(src)
        }
    });
}

//取得 文章類型

function article_data(func,req_obj={get_mode:"",article_id:""}){
    $.ajax({
        type: "get",
        url: "/api/article",
        data: req_obj,
        dataType: "json",
        success: function (response) {
            console.log(response)
            func(response)
            // return response.article_id
        }
    });
}


//login func
function setCookie(cvalue) {
    document.cookie = "usercookie" + "=" + JSON.stringify(cvalue)+";path=/";
}
function getCookie() {
    let name = "usercookie" + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return JSON.parse(c.substring(name.length, c.length));
        }
    }
    return "";
}
function deleteCookie(cname) {
    document.cookie = "usercookie" + "= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}
$(document).ready(function () {
    
    var user_cookie = getCookie()
    if (user_cookie == "") {//沒有 cookie 紀錄
        setCookie({
            login_type: "",
            user_token: "",
            user_id: ""

        })
    }

    user_cookie = getCookie()
    
    let pageName = location.pathname.split("/")[1]
    switch(pageName){
        case "article":
            let article_id = location.pathname.split("/")[2]
            if(article_id == undefined || article_id == ""){
                if (user_cookie.user_id == "") {
                    alert("此頁面需要登入才能使用 即將將您導向")
                    location.replace("/login")
                }
            }
            break;
        case "article_edit":
        case "manager":
            if (user_cookie.user_id == "") {
                alert("此頁面需要登入才能使用 即將將您導向")
                location.replace("/login")
            }
            break
    }
    if (user_cookie.user_id != "") {
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: user_cookie,
            dataType: "json",
            async: false,
            success: function (response) {
                console.log(response)
                if (response.message == "pass") {
                    user = response.user
                    login_success()
                }else if(response.message == "user token useless"){
                    logout()
                    alert("憑證碼過期 請重新登入!")
                    // location.replace("/login")

                }else if(response.message == "user id not defind"){
                    logout()
                    // alert("未查詢到使用者 請重新登入!")
                    // location.replace("/login")
                }else{                    
                    logout()
                    // alert("未知的錯誤 即將將您導向")
                    // location.replace("/login")
                }
            }
        
        });
    }

        
    
    $("#login_btn").removeClass("d-none")
});

function login_success() {
    $("#login_btn").html("登出");
    $("#login_btn").attr("data-target", "#unloginModalCenter");
    $("#login_btn").attr("data-toggle", "modal");

    $("#personnel_setting_view_name_input").val(user.view_name);
    $("#personnel_setting_user_id_label").html(user.user_id);
    $("#personnel_setting_role_label").html(user.role);
    $("#personnel_setting_login_type_label").html(user.login_type);
    $("#personnel_setting_img_url").val(user.img);
    $("#personnel_setting_view_img_container").html(`<img class="w-100"src="${user.img}">`);
    $("#article_owner_id").val(user.user_id);
    $("#user_token").val(user.user_token);

    $('#loginModalCenter').modal('hide')

    setCookie({
        user_id: user.user_id,
        user_token: user.user_token,
        login_type: user.login_type
    })

}
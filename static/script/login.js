function setCookie(cvalue) {
    document.cookie = "usercookie" + "=" + JSON.stringify(cvalue);
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
    } else if (user_cookie["login_type"] == "sign_out") {

    } else {

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
function setCookie(cname, cvalue, exdays) {
  document.cookie = cname + "=" + cvalue;
}

function getCookie(cname) {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}
function deleteCookie(cname) {
    document.cookie = cname+"= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
}

window.onload = function () {
  google.accounts.id.initialize({
    client_id: '513159013962-1bp03rago46o75rlq51ktj17qqk2d06t.apps.googleusercontent.com',
  callback: handleCredentialResponse,
    	auto_select: false,
      native_callback: handleResponse,
      State_cookie_domain:"https://csiejar.xyz/home"
  });
  google.accounts.id.prompt();
};

function handleResponse(params) {
    console.log(params)
}

function handleCredentialResponse(CredentialResponse) {
  console.log(CredentialResponse)
  $("#login_btn").html("登入中..");
  $("#login_btn").attr("data-target", "#");

 $.ajax({
    type: "POST",
    url: "/google_check_test",
    data: {"token_id":CredentialResponse.credential,"client_id":CredentialResponse.clientId},
    dataType: "json",
    success: function (data) {
        console.log(data)
        user = data.user
            let cred = {id: 'testid', password: 'testpw'};
        login_success()
    },error: function(XMLHttpRequest, textStatus, errorThrown) {
        alert("登入失敗 請重新登入");
        $("#login_btn").html("登入");
        $("#login_btn").attr("data-target", "#loginModalCenter");
     },
});
}
var user = {}
// user.view_name = "無敵臭臘腸"
// user.user_id = "user-654646844655646"
// user.role = "已認證"
// user.login_type = "google"
// user.img = "https://fakeimg.pl/350x200/ffbb00/000"

function login_success() {
  $("#login_btn").html("登出");
  $("#login_btn").attr("data-target", "#unloginModalCenter");

  $("#personnel_setting_view_name_input").val(user.view_name);
  $("#personnel_setting_user_id_label").html(user.user_id);
  $("#personnel_setting_role_label").html(user.role);
  $("#personnel_setting_login_type_label").html(user.login_type);
  $("#personnel_setting_img_url").val(user.img);
  $("#personnel_setting_view_img_container").html(`<img class="w-100"src="${user.img}">`);
    $("#article_owner_id").val(user.user_id);
    $("#user_token").val("user_token");

  $('#loginModalCenter').modal('hide')

    
}
window.onload = function () {
  google.accounts.id.initialize({
    client_id: '513159013962-1bp03rago46o75rlq51ktj17qqk2d06t.apps.googleusercontent.com',
    callback: handleCredentialResponse,
  });
  google.accounts.id.prompt();
};
function handleCredentialResponse(CredentialResponse) {
  console.log(CredentialResponse)
  $.post("/google_check_test", {"token_id":CredentialResponse.credential},
      function (data, textStatus, jqXHR) {
          console.log(data)
          user = data.user
          login_success()
      },
      "json"
  );
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
}
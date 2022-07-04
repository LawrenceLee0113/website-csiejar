function signOut() {//google signOut
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}
function logout() {
    let login_type = "google"
    switch (login_type) {
        case "google":
            signOut();
            break;
    }
    $("#login_btn").html("登入");
    $("#login_btn").attr("data-target", "#loginModalCenter");

}
$(document).ready(function () {
    $('.popover-dismiss').popover()//copied 下方框宣告
    progress_controller("personnel_setting_img_porgress", 55)//personnel img upload progress setting

    let view_name = "law"
    $("#personnel_setting_view_name_input").keyup(function (e) {
        //view_name 更改按鈕顯示 when 輸入跟一開始的name不一樣
        if ($(this).val() != view_name) {
            // alert("sss")
            $("#view_name_uploader").show();
        } else {
            $("#view_name_uploader").hide();
        }
    });
    $("#view_name_uploader").click(function (e) {
        //上傳 view_name

    });
    $("#personnel_setting_view_img_btn").click(function (e) {
        //選擇 img 檔案的按鈕
        $('#personnel_setting_img').trigger('click');
    });
    $("#personnel_setting_img").change(function (e) {
        //上傳 img 檔案至 image kit
        personnel_setting_img_upload();
    });
    $("#personnel_setting_user_id_copy_btn").click(function (e) {
        //copy user id 的 按鈕
        e.preventDefault();
        $('#personnel_setting_user_id_copy_btn').popover('hide')
        $('#personnel_setting_user_id_copy_btn').popover('show')
        $("#personnel_setting_user_id_copy").hide();
        $("#personnel_setting_user_id_copied").show();
        navigator.clipboard.writeText(user.user_id)
            .then(() => {
                console.log("Text copied to clipboard...")
            })
            .catch(err => {
                console.log('Something went wrong', err);
            })
    });
});
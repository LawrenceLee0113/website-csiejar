function signOut() {//google signOut

    google.accounts.id.disableAutoSelect();
    console.log('User signed out.');
    $('#unloginModalCenter').modal('hide')

    setCookie({
        user_id: "",
        user_token: "",
        login_type: "sign_out"
    })
}
function logout() {
    let login_type = "google"
    switch (login_type) {
        case "google":
            signOut();
            break;
    }
    $("#login_btn").html("登入");
    $("#login_btn").removeAttr("data-toggle")

    let pageName = location.pathname.split("/")[1]
    switch (pageName) {
        case "article":
        case "article_edit":
        case "manager":
            location.replace("/home")
            break
    }

}
$(document).ready(function () {
    $('.popover-dismiss').popover()//copied 下方框宣告

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
        $.ajax({
            type: "PUT",
            url: "https://csiejar.xyz/api/user",
            data: {
                change:"view_name",
                change_data:`{"view_name":"${$("#personnel_setting_view_name_input").val()}"}`,
                user_id:getCookie().user_id,
                user_token:getCookie().user_token,
            },
            dataType: "json",
            success: function (response) {
                console.log(response)
                let user = getCookie();
                user.user_token = response.user_token;
                setCookie(user)
                if(response.status == "success"){
                    $("#view_name_uploader").html("變更成功!").addClass("border-success text-success").prop("disabled", true);
                    setTimeout(() => {
                        $("#view_name_uploader").html("變更").removeClass("border-success text-success").prop("disabled", false);
                        $("#view_name_uploader").hide();
                    }, 2000);
                }else if(response.status == "token_error"){
                    ("#view_name_uploader").html("憑證失效!").addClass("border-danger text-danger").prop("disabled", true);
                    $("#personnel_setting_view_name_input").val(response.value);
                    setTimeout(() => {
                        $("#view_name_uploader").html("變更").removeClass("border-danger text-danger").prop("disabled", false);
                        $("#view_name_uploader").hide();
                    }, 2000);
                }
            }
        });
    });
    $("#personnel_setting_view_img_btn").click(function (e) {
        //選擇 img 檔案的按鈕
        $('#personnel_setting_img').trigger('click');
    });
    $("#personnel_setting_img").change(function (e) {
        //上傳 img 檔案至 image kit
        imagekit_uploader({
            file_id: "personnel_setting_img",
            user_id: getCookie().user_id,
            user_token: getCookie().user_token,
            file_name: "view_head_img",
            folder_name: `/user/${user.user_id}`,
            file_type: "png",
            useUniqueFileName:false,
            status_func: {
                status0: () => {//req send(self server)
                    console.log("status0")
                    progress_controller("personnel_setting_img_porgress", 25)
                },
                status1: (body) => {//res catch(self server)
                    console.log("status1")
                    
                    progress_controller("personnel_setting_img_porgress", 50)

                },
                status2: () => {//req send(imgkit server)
                    console.log("status2")
                },
                status3: (body) => {//res catch(imgkit server)
                    progress_controller("personnel_setting_img_porgress", 75)
                    console.log("status3")
                    console.log(body)

                    $.ajax({
                        type: "PUT",
                        url: "https://csiejar.xyz/api/user",
                        data: {
                            change:"img",
                            change_data:`{"img":"${ body.url}"}`,
                            user_id:getCookie().user_id,
                            user_token:getCookie().user_token,
                        },
                        dataType: "json",
                        success: function (response) {
                            console.log(response)
                            progress_controller("personnel_setting_img_porgress", 100)

                            let user = getCookie();
                            user.user_token = response.user_token;
                            setCookie(user)
                            if(response.status == "success"){
                                $("#personnel_setting_view_img_btn").html("變更成功!").addClass("border-success text-success").prop("disabled", true);
                                $("#personnel_setting_view_img_container").children("img").attr("src", response.value+"?v="+Math.random())
                                setTimeout(() => {
                                    $("#personnel_setting_view_img_btn").html("變更").removeClass("border-success text-success").prop("disabled", false);
                                }, 2000);
                            }else if(response.status == "token_error"){
                                ("#personnel_setting_view_img_btn").html("憑證失效!").addClass("border-danger text-danger").prop("disabled", true);
                                // $("#personnel_setting_view_name_input").val(response.value);
                                setTimeout(() => {
                                    $("#personnel_setting_view_img_btn").html("變更").removeClass("border-danger text-danger").prop("disabled", false);
                                    $("#personnel_setting_view_img_btn").hide();
                                }, 2000);
                            }
                        }
                    });
                }
            }
        })
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
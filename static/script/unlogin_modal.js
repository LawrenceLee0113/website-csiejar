function signOut() {//google signOut
    
  google.accounts.id.disableAutoSelect();
  console.log('User signed out.');
  $('#unloginModalCenter').modal('hide')

  setCookie({
    user_id:"",
    user_token:"",
    login_type:"sign_out"
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
    switch(pageName){
        case "article":
        case "article_edit":
        case "manager":
                location.replace("/home")
            break
    }

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
        let new_img_url = ""
        imagekit_uploader({
            file_id:"personnel_setting_img",
            user_id:user.user_id,
            user_token:user.user_token,
            file_name: user.user_id+"_img",
            folder_name:user.user_id,
            file_type:"png",
            status_func:{
                status0:()=>{//req send(self server)
                    console.log("status0")
                    progress_controller("personnel_setting_img_porgress",25)
                },
                status1:(body)=>{//res catch(self server)
                    console.log("status1")
                    change_user_token(body.user.user_token)
                    progress_controller("personnel_setting_img_porgress",50)
                    
                },
                status2:()=>{//req send(imgkit server)
                    console.log("status2")
                },
                status3:(body)=>{//res catch(imgkit server)
                    progress_controller("personnel_setting_img_porgress",75)
                    console.log("status3")
                    console.log(body)
                },
                status4:()=>{//finish
                    $.post("/user", {"img":new_img_url},
                    function (data, textStatus, jqXHR) {
                        progress_controller("personnel_setting_img_porgress",100)
                        console.log(data)
                        
                    },
                    "json"
                    );
                    console.log("status4")
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
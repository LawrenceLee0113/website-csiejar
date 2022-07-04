var authenticationEndpoint = "https://csiejar.xyz/uploadImage";
var uploadData = true;
function change_user_token(new_token){
    user.token = new_token
}
function progress_controller(progressId, num) {
    $("#" + progressId).parent().show()
    $("#" + progressId).css("width", `${num}%`).attr("aria-valuenow", `${num}`).html(`${num}%`);
    if (num == "100") {
      setTimeout(() => {
        $("#" + progressId).addClass("bg-success").html("上傳成功").removeClass("progress-bar-animated");
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
    // alert("upload success")
    // Let's get the signature, token and expire from server side
    status_func.status0()
    $.ajax({
        url: authenticationEndpoint,
        method: "GET",
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
    status_func.status4()
}
function personnel_setting_img_upload(){
  // setTimeout(() => {
  //     progress_controller("personnel_setting_img_porgress",25)
  //     setTimeout(() => {
  //       progress_controller("personnel_setting_img_porgress",50)
  //       setTimeout(() => {
  //         progress_controller("personnel_setting_img_porgress",75)
  //         setTimeout(() => {
  //           progress_controller("personnel_setting_img_porgress",100)
            
  //         }, 1000);
  //       }, 1000);
  //     }, 1000);
  //   }, 1000);
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
}
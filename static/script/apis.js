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
function view_img(file_id,view_container_id){
    $("#"+file_id).change(function(){
        //當檔案改變後，做一些事 
        if(this.files && this.files[0]){
                var reader = new FileReader();
                reader.onload = function (e) {
                $("#"+view_container_id).attr('src', e.target.result);
                }
                reader.readAsDataURL(this.files[0]);
        }
    });
}

//文章類型

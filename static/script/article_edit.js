var editor;//宣告內文編輯區 ckeditor obj
InlineEditor
.create(document.querySelector('#content_editor'), {
    cloudServices: {
        tokenUrl: 'https://90366.cke-cs.com/token/dev/d20e8fa470fade60fd1c8eb057600aff2f26e4cde07abe06302686ed03fd?limit=10',
        uploadUrl: 'https://90366.cke-cs.com/easyimage/upload/'
    }
})
.then(a => {
    editor = a
    editor.model.document.on('change:data', () => {
        const data = editor.getData();
        $("#content_editor_input").val(data);
    });
})
.catch(error => {
    console.error(error);
});
//ckeditor 宣告結束
$(document).ready(function () {
    $("#article_img_uploader_btn").click(function (e) {
        //article_img_uploader img 檔案的按鈕
        $('#article_img_uploader').trigger('click');
    });
    view_img("article_img_uploader","article_img_uploader_container_b")
    //預覽中圖片
    $("#big_img_uploader_btn").click(function (e) { 
        $('#big_img_uploader').trigger('click');
        
    });
    view_img("big_img_uploader","big_img_uploader_container_b")
    //預覽大圖片
    $("#home_top_controller").change(function (e) {
        //is 首頁top checked
        if (document.getElementById("home_top_controller").checked) {
            $(".big_img_checked").css("display", "flex");
        } else {
            $(".big_img_checked").hide();
        }
        $("#is_home_top").val(document.getElementById("home_top_controller").checked);
    });
    $("#home_middle_controller").change(function (e) {
        //is 首頁middle checked
        if (document.getElementById("home_middle_controller").checked) {
            $(".middle_img_checked").css("display", "flex");

        } else {
            $(".middle_img_checked").hide();
        }
        $("#is_home_middle").val(document.getElementById("home_middle_controller").checked);
    });


    //文章類型載入
    {
        $.get("/api/article_type", {},
            function (data, textStatus, jqXHR) {
                $("#article_type_selector").html("");
                jQuery('<option>', {
                    value: "選擇您的文章類型",
                    html: "選擇您的文章類型",
                    selected:true
                }).appendTo('#article_type_selector');
                for(var i of data){
                    jQuery('<option>', {
                        value: i,
                        html: i
                    }).appendTo('#article_type_selector');
                }
            },
            "json"
        );

    }

    $("#view_article_btn").click(function (e) { 
        // 預覽按鈕
        e.preventDefault();
        $(".article_view").show();
        $(".article_view .content").html($("#content_editor_input").val());
        $(".article_view .header_text .h3").html($("input[name=subject]").val());
        jQuery('<div>', {
            class: 'badge badge-danger h6',
            html: $("select[name=article_type]").val()
        }).appendTo('.article_view .header_text .h3');
        $(".owner_name").html(user.view_name);
        var now = new Date(Date.now());
        var formatted = `${now.getFullYear()}/${parseInt(now.getMonth())+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
        $(".article_view .header_middle .creat_time").html(formatted);
    });
    $("#edit_article_form button[type=submit]").click(function (e) { 
        // 送出新增表單
        e.preventDefault();
        $('#upload_modal').modal('show')
        
        let isSendAccept = false
        let _sendAccept = 0;
        function send_form(){
            _sendAccept++
            if (_sendAccept==2){
                refresh_upload_progress(15)
                $.ajax({
                    url:"/api/article",
                    type:"POST",
                    data:$("#edit_article_form").serialize()+'&form_name='+$("#edit_article_form").attr("name"),
                    success: function(data){
                        refresh_upload_progress(15)
                        $("#upload_hint_span").html("上傳成功 即將將你重新導向至'文章'");
                        setTimeout(() => {
                            location.replace(data.article_link);
                        }, 1200)
                    },
                });

            }
        }
        let _upload_progress_step = 0;
        function refresh_upload_progress(step){
            _upload_progress_step += step
            progress_controller("upload_progress",_upload_progress_step,()=>{
                
            })
        }
        {
            // 上傳中圖片
            imagekit_uploader({
                file_id:"article_img_uploader",
                user_id:user.user_id,
                user_token:"none",
                file_name:user.user_id,
                folder_name:"/article",
                file_type:"png",
                status_func:{
                    "status0":()=>{//開始send server
                        console.log("0")
                        refresh_upload_progress(5)
                    },
                    "status1":(body)=>{//取得到私鑰
                        refresh_upload_progress(10)
                        console.log(body)
                    },
                    "status2":()=>{//開始send imagekit
                        refresh_upload_progress(5)
                        console.log("2")
                        
                    },
                    "status3":(body)=>{//取得照片資訊
                        refresh_upload_progress(15)
                        console.log(body)
                        console.log(body.url)
                        $("#article_img_uploader_url").val(body.url);
                        send_form()
                    }
                }
            })
        }
        {
            // 上傳大圖片
            if($("#is_home_top").val()=="true"){
                imagekit_uploader({
                    file_id:"big_img_uploader",
                    user_id:user.user_id,
                    user_token:"none",
                    file_name:user.user_id,
                    folder_name:"/article",
                    file_type:"png",
                    status_func:{
                        "status0":()=>{//開始send server
                        refresh_upload_progress(5)
                        console.log("0")
                        },
                        "status1":(body)=>{//取得到私鑰
                        refresh_upload_progress(10)
                        console.log(body)
                        },
                        "status2":()=>{//開始send imagekit
                        refresh_upload_progress(5)
                        console.log("2")
                            
                        },
                        "status3":(body)=>{//取得照片資訊
                        refresh_upload_progress(15)
                        console.log(body)
                            console.log(body.url)
                            $("#big_img_uploader_url").val(body.url);
                            send_form()
                        }
                    }
                })
            }else{
                send_form()
            }
        }

        
    });
});
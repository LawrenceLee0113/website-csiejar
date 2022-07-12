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
        // imagekit_uploader({
        //     file_id:"big_img_uploader",
        //     user_id:"user-asdfkdvkx14",
        //     user_token:"none",file_name,
        //     folder_name:"test",
        //     file_type:"png",
        //     status_func:{
        //         "status1":(body)=>{
        //             alert(body)
        //         },
        //         "status2":()=>{
        //             alert("2")
                    
        //         },
        //         "status3":(body)=>{
        //             alert(body)
        //         },
        //         "status4":()=>{
        //             alert("4")
        //         }
        //     }
        // })
        
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
        // $.get("/api/article_type", {},
        //     function (data, textStatus, jqXHR) {
        //         $("#article_type_selector").html("");
        //         jQuery('<option>', {
        //             value: "選擇您的文章類型",
        //             html: "選擇您的文章類型",
        //             selected:true
        //         }).appendTo('#article_type_selector');
        //         for(var i of data.article_type){
        //             jQuery('<option>', {
        //                 value: i,
        //                 html: i
        //             }).appendTo('#article_type_selector');
        //         }
        //     },
        //     "json"
        // );

        var data = {
            article_type:["a","b","c"]
        }
        $("#article_type_selector").html("");
        jQuery('<option>', {
            value: "選擇您的文章類型",
            html: "文章類型",
            selected:true
        }).appendTo('#article_type_selector');
        for(var i of data.article_type){
            jQuery('<option>', {
                value: i,
                html: i
            }).appendTo('#article_type_selector');
        }
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
        var user = {
            user_name :"嗨嗨"
        }
        $(".owner_name").html(user.user_name);
        var now = new Date(Date.now());
        var formatted = `${now.getFullYear()}/${parseInt(now.getMonth())+1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
        $(".article_view .header_middle .creat_time").html(formatted);
    });
    $("#edit_article_form button[type=submit]").click(function (e) { 
        e.preventDefault();
        $.ajax({
            url:"/api/article",
            type:"POST",
            data:$("#edit_article_form").serialize()+'&form_name='+$("#edit_article_form").attr("name"),
            success: function(data){
                console.log(data)
            },
        });
    });
});
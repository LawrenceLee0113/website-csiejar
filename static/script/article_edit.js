
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
// 文章類型載入
var article_type;
{
    $.get("/api/article_type", {},
        function (data, textStatus, jqXHR) {
            $("#article_type_selector").html("");
            article_type = data
            jQuery('<option>', {
                value: "",
                html: "選擇您的文章類型",
                selected: true
            }).appendTo('#article_type_selector');
            for (var i in data) {
                jQuery('<option>', {
                    value: i,
                    html: data[i]
                }).appendTo('#article_type_selector');
            }
        },
        "json"
    );

}
var this_article;
//ckeditor 宣告結束
$(document).ready(function () {
    $("#article_img_uploader_btn").click(function (e) {
        //article_img_uploader img 檔案的按鈕
        $('#article_img_uploader').trigger('click');
    });
    $("#big_img_uploader_btn").click(function (e) {
        $('#big_img_uploader').trigger('click');

    });

    function checked_change() {
        //is 首頁top checked
        if (document.getElementById("home_top_controller").checked) {
            $(".big_img_checked").css("display", "flex");
        } else {
            $(".big_img_checked").hide();
        }
        $("#is_home_top").val(document.getElementById("home_top_controller").checked);

        //is 首頁middle checked
        if (document.getElementById("home_middle_controller").checked) {
            $(".middle_img_checked").css("display", "flex");

        } else {
            $(".middle_img_checked").hide();
        }
        $("#is_home_middle").val(document.getElementById("home_middle_controller").checked);
    }
    $("#home_top_controller").change(function (e) {
        checked_change()
    });
    $("#home_middle_controller").change(function (e) {
        checked_change()
    });
    var is_home_change = false;
    var is_home_img_change = false;

    $.ajax({
        type: "get",
        url: "/api/article",
        data: {
            article_id: now_article_id,
            get_mode: "full"
        },
        dataType: "json",
        success: function (response) {
            console.log(response);
            this_article = response.article[now_article_id];
            $("#edit_article_form input[name=subject]").val(this_article.subject);

            $("#edit_article_form input[name=content]").val(this_article.content);
            editor.setData(this_article.content);

            $("#article_type_selector").children("option").each(function () {
                if ($(this).val() == this_article.article_type) {
                    $(this).attr("selected", "selected");
                } else {
                    $(this).removeAttr("selected");
                }
            });

            $('#article_img_uploader_container_b').attr("src", this_article.article_img_url);


            $("#home_middle_controller").attr("checked", this_article.ishome == "true");
            $("#edit_article_form input[name=ishome]").val(this_article.ishome);
            $("#edit_article_form input[name=home_delete_time]").val(this_article.home_delete_time);



            $("#home_top_controller").attr("checked", this_article.ishome_img == "true");
            $("#edit_article_form input[name=is_home_top]").val(this_article.ishome_img);
            $("#edit_article_form input[name=home_img_delete_time]").val(this_article.home_img_delete_time);
            $('#big_img_uploader_container_b').attr("src", this_article.big_img_url);

            checked_change()

            $("#article_img_uploader_cancel_btn").click(function (e) {
                e.preventDefault();
                $("#article_img_uploader_cancel_btn").hide();

                $('#article_img_uploader_container_b').attr("src", this_article.article_img_url);
                is_home_change = false;

            });
            $("#big_img_uploader_cancel_btn").click(function (e) {
                e.preventDefault();
                $("#big_img_uploader_cancel_btn").hide();
                $('#big_img_uploader_container_b').attr("src", this_article.big_img_url);
                is_home_img_change = false;
            });


            //預覽中圖片
            view_img("article_img_uploader", "article_img_uploader_container_b", (src) => {
                if (src != this_article.article_img_url) {
                    $("#article_img_uploader_cancel_btn").show();
                    $("#article_img_uploader_cancel_btn").css("flex", "1");
                    is_home_change = true
                }
            })

            //預覽大圖片
            view_img("big_img_uploader", "big_img_uploader_container_b", (src) => {
                console.log($("#big_img_uploader_container_b").attr("src"), this_article.big_img_url)
                if (src != this_article.big_img_url) {
                    $("#big_img_uploader_cancel_btn").show();
                    $("#big_img_uploader_cancel_btn").css("flex", "1");
                    is_home_img_change = true
                }
            })



        }
    });


    $("#view_article_btn").click(function (e) {
        // 預覽按鈕
        e.preventDefault();
        $(".article_view").show();
        $(".article_view .content").html($("#content_editor_input").val());
        $(".article_view .header_text .h3").html($("input[name=subject]").val());
        jQuery('<div>', {
            class: 'badge badge-danger h6',
            html: article_type[$("select[name=article_type]").val()]
        }).appendTo('.article_view .header_text .h3');
        $(".owner_name").html(user.view_name);
        var now = new Date(Date.now());
        var formatted = `${now.getFullYear()}/${parseInt(now.getMonth()) + 1}/${now.getDate()} ${now.getHours()}:${now.getMinutes()}`;
        $(".article_view .header_middle .creat_time").html(formatted);
    });


    function foolproof() {
        let foolproof = true
        // console.log($("#edit_article_form input[name=subject]").val())
        // console.log($("#edit_article_form input[name=content]").val())
        // console.log($("#article_type_selector").val())
        // console.log($("#article_img_uploader").val())//article img file
        // console.log($("#edit_article_form input[name=article_img_url]").val())

        // console.log($("#edit_article_form input[name=ishome]").val())
        // console.log($("#edit_article_form input[name=home_delete_time]").val())

        // console.log($("#edit_article_form input[name=ishome_img]").val())
        // console.log($("#edit_article_form input[name=home_img_delete_time]").val())
        // console.log($("#big_img_uploader").val())//big img file
        // console.log($("#edit_article_form input[name=big_img_url]").val())

        let necessary = [
            $("#edit_article_form input[name=subject]"),
            $("#edit_article_form input[name=content]"),
            $("#article_type_selector"),
            $("#edit_article_form input[name=ishome]"),
            $("#edit_article_form input[name=ishome_img]"),

        ]

        for (let i of necessary) {
            if ($(i).val() == "") {
                console.log("foolproof false")
                $(i).css("border", "red solid 1px");
                if ($(i).attr("name") == "content") {
                    $("#content_editor").css("border", "red solid 1px");
                }
            } else {
                $(i).css("border", "1px solid #ced4da");
                if ($(i).attr("name") == "content") {
                    $("#content_editor").css("border", "1px solid black");
                }
            }
        }

        if (necessary.includes("")) {
            foolproof = false
        }

        if ($("#edit_article_form input[name=ishome]").val() == "true") {


            let ishome_necessary = [
                $("#edit_article_form input[name=home_delete_time]")
            ]

            for (let i of ishome_necessary) {
                if ($(i).val() == "") {
                    $(i).css("border", "red solid 1px");
                } else {
                    $(i).css("border", "1px solid #ced4da");
                }
            }

            if (ishome_necessary.includes("")) {
                foolproof = false
            }
        }

        if ($("#edit_article_form input[name=ishome_img]").val() == "true") {
            let ishome_img_necessary = [
                $("#edit_article_form input[name=home_img_delete_time]"),
                $("#big_img_uploader")
            ]

            for (let i of ishome_img_necessary) {
                if ($(i).val() == "") {
                    $(i).css("border", "red solid 1px");
                    if ($(i).attr("id") == "big_img_uploader") {
                        $("#big_img_uploader_container").css("border", "red solid 1px");
                    }
                } else {
                    $(i).css("border", "1px solid #ced4da");
                    if ($(i).attr("id") == "big_img_uploader") {
                        $("#big_img_uploader_container").css("border", "1px solid #ced4da");
                    }
                }
            }

            if (ishome_img_necessary.includes("")) {
                foolproof = false
            }
        }
        return foolproof
    }


    $("#edit_article_form button[type=submit]").click(function (e) {
        // 送出新增表單
        e.preventDefault();

        if (foolproof()) {
            console.log("fool complete")

            $('#upload_modal').modal('show')

            var changes = []
            function send_form() {
                refresh_upload_progress(15)
                for(let i in data){
                    if(data[i] != undefined){
                        changes.push(i)
                    }
                }
                console.log(changes)
                console.log(data)

                $.ajax({
                    url: "/api/article",
                    type: "PUT", 
                    data:{
                        change:changes.join(","),
                        change_data:JSON.stringify(data),
                        user_id:getCookie()["user_id"],
                        user_token:getCookie()["user_token"],
                        article_id:this_article.article_id
                    },
                    success: function (data) {
                        console.log(data)
                        refresh_upload_progress(15)
                        let user = getCookie()
                        user["user_token"] = data.user_token

                        setCookie(user)
                        $("#upload_hint_span").html("上傳成功 即將將你重新導向至'文章'");
                        setTimeout(() => {
                            location.replace(this_article.article_link);
                        }, 1200)
                    },
                });
            }
            let _upload_progress_step = 0;
            function refresh_upload_progress(step) {
                _upload_progress_step += step
                progress_controller("upload_progress", _upload_progress_step, () => {

                })
                if (_upload_progress_step == 70) {
                    send_form()
                }
            }
            function add_change_item(now_val, original_val) {
                if (now_val != original_val) {
                    return now_val
                }
            }

            var data = {
                subject: add_change_item($("#edit_article_form input[name=subject]").val(), this_article.subject),
                content: add_change_item($("#edit_article_form input[name=content]").val(), this_article.content),
                article_type: add_change_item($("#article_type_selector").val(), this_article.article_type),
                ishome: add_change_item($("#edit_article_form input[name=ishome]").val(), this_article.ishome),
                home_delete_time: add_change_item($("#edit_article_form input[name=home_delete_time]").val(), this_article.home_delete_time),
                ishome_img: add_change_item($("#edit_article_form input[name=ishome_img]").val(), this_article.ishome_img),
                home_img_delete_time: add_change_item($("#edit_article_form input[name=home_img_delete_time]").val(), this_article.home_img_delete_time),


            }
            console.log(data)


            {
                // 上傳中圖片
                if(is_home_change&&$("#article_img_uploader").val()!=""){

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
                                console.log(body)
                                console.log(body.url)
                                $("#article_img_uploader_url").val(body.url);
                                data.article_img_url = body.url;
                                refresh_upload_progress(15)
                            }
                        }
                    })
                }else{
                    refresh_upload_progress(35)

                }
            }
            {
                // 上傳大圖片
                if(is_home_img_change&&$("#big_img_uploader").val()!=""){
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
                                console.log(body)
                                    console.log(body.url)
                                    $("#big_img_uploader_url").val(body.url);
                                    data.big_img_url = body.url;
                            refresh_upload_progress(15)
                            }
                        }
                    })
                }else{
                    refresh_upload_progress(35)
                }
            }
        }

    });
});
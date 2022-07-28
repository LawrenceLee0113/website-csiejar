// var semester_selector_val = JSON.parse($("#semester_selector_val").val().replace(/'/g, "\"")).values;
// var active_target = JSON.parse($("#semester_selector_val").val().replace(/'/g, "\"")).target;
var manager_selector_setting = {
    article_manager: {
        "ischeck_selector": {
            title: "審核狀態",
            selector_mode: "select",
            target_id: "ischeck_selector",
            default_value: "全部",
            options: ["全部", "審核中", "審核通過", "審核不通過"],
            options_id: ["all", "ischeck", "ischeck_pass", "ischeck_not_pass"]
        },
        "article_type_selector": {
            title: "文章類別",
            selector_mode: "multi_select",
            target_id: "article_type_selector",
            default_value: [ "公告", "資源", "班級","作品"],
            options: [ "公告", "資源", "班級","作品"],
            options_id: ["news", "resource", "class", "project"]
        },
        "isupload_selector": {
            title: "上架狀態",
            selector_mode: "select",
            target_id: "isupload_selector",
            default_value: "全部",
            options: ["全部", "上架", "下架"],
            options_id: ["all", "isupload", "isupload_not"]
        },
        "other_selector": {
            title: "其他狀態",
            selector_mode: "multi_select",
            target_id: "other_selector",
            default_value: ["大圖區", "中圖區"],
            options: ["大圖區", "中圖區"],
            options_id: ["home_img", "home"]
        },
        "user_selector": {
            title: "使用者",
            selector_mode: "select",
            target_id: "user_selector",
            default_value: "全部",
            options: ["全部", "管理者", "認證", "未認證", "訪客"],
            options_id: ["all", "manager", "authorize", "unauthorize", "visitor"]
        }
    },
    user_manager: {
        "creat_time_sort_selector": {
            title: "建立時間排序",
            selector_mode: "select",
            target_id: "creat_time_sort_selector",
            default_value: "順序",
            options: ["順序", "倒序"],
            options_id: ["asc", "desc"]
        },
        "login_type_selector": {
            title: "登入方式",
            selector_mode: "multi_select",
            target_id: "login_type_selector",
            default_value: ["GOOGLE", "CSIEJAR_ID"],
            options: ["GOOGLE", "CSIEJAR_ID"],
            options_id: ["google", "csiejar_id"]
        },
        "identity_selector": {
            title: "身分類別",
            selector_mode: "multi_select",
            target_id: "identity_selector",
            default_value: ["管理者", "認證", "未認證", "訪客"],
            options: ["管理者", "認證", "未認證", "訪客"],
            options_id: ["manager", "authorize", "unauthorize", "visitor"]
        }
    }
};
// console.log(semester_selector_val)

for (let now_manager_page in manager_selector_setting) {
    //最上面的頁面 (文章管理 使用者管理...)
    let now_manager_setting = manager_selector_setting[now_manager_page];
    console.log("now_manager_page:", now_manager_page);
    for (let selector_setting in now_manager_setting) {
        //小選單 (審核 上架...)
        let default_value = now_manager_setting[selector_setting].default_value;
        let selector_mode = now_manager_setting[selector_setting].selector_mode;
        let options_id = now_manager_setting[selector_setting].options_id
        if (selector_mode == "select") {
            //add 小選單
            $(`#${now_manager_page} .selector_uis`).append(`
            <div class="dropdown mr-3">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="${selector_setting}"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${now_manager_setting[selector_setting].title}(<span class="now_value">${now_manager_setting[selector_setting].default_value}</span>)
                </a>

                <div class="dropdown-menu">
                    <h6 class="dropdown-header pt-0 tb-0">${now_manager_setting[selector_setting].title}</h6>
                </div>
            </div>
            `);
            console.log("selector_setting:", selector_setting);
            let options = now_manager_setting[selector_setting].options
            for (let option_num in options) {
                let class_active = ""
                let target_id = now_manager_setting[selector_setting].target_id;
                if (options[option_num] == default_value) {
                    class_active = "active"
                }
                $(`#${target_id}`).siblings(".dropdown-menu").append(`
                                    <a class="dropdown-item ${class_active}" href="#" data-value="${options_id[option_num]}">${options[option_num]}</a>
                                `)
            }
            $(`#${now_manager_page}`).children(".input_area").append(`
                <input type="hidden" value="${options_id[now_manager_setting[selector_setting].options.indexOf(default_value)]}" id="${selector_setting}_input">
            `)

        } else if (selector_mode == "multi_select") {
            //add 小選單
            $(`#${now_manager_page} .selector_uis`).append(`
            <div class="dropdown mr-3">
                <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="${selector_setting}"
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    ${now_manager_setting[selector_setting].title}
                </a>

                <div class="dropdown-menu">
                    <h6 class="dropdown-header pt-0 tb-0">${now_manager_setting[selector_setting].title}</h6>
                </div>
            </div>
            `);
            console.log("selector_setting:", selector_setting);
            let options = now_manager_setting[selector_setting].options
            let allow_id = []
            for (let option_num in options) {
                let class_active = ""
                let target_id = now_manager_setting[selector_setting].target_id;

                if (default_value.includes(options[option_num])) {
                    class_active = "checked"
                    allow_id.push(options_id[option_num])
                }
                $(`#${target_id}`).siblings(".dropdown-menu").append(`
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <div class="input-group-text">
                                <input class="dropdown-item" type="checkbox" aria-label="Checkbox for following text input" data-value="${options_id[option_num]}" ${class_active}>
                            </div>
                        </div>
                        <label class="form-control">${options[option_num]}</label>
                    </div>
                `)
            }
            $(`#${now_manager_page}`).children(".input_area").append(`
                <input type="hidden" value="${allow_id}" id="${selector_setting}_input">
            `)

        }
        
    }
    $(`#${now_manager_page} .selector_uis`).append(`
        <a class="query_icon d-flex  align-items-center" href="#" data-page_name="${now_manager_page}">
            <i class="bi bi-search"></i>
        </a>
    `);
}

$(document).ready(function () {
    $(".query_icon").click(function (e) { 
        e.preventDefault();
        query($(this).data("page_name"))

        
    });
    $("a.dropdown-item").click(function (e) {
        e.preventDefault();
        $(this).siblings(".dropdown-item").removeClass("active");
        $(this).addClass("active");
        let now_page_name = $(this).parents(".tab-pane").attr("id");
        let now_selector_name = $(this).parents(".dropdown").children("a").attr("id");
        $(`#${now_page_name}`).children(".input_area").children(`#${now_selector_name}_input`).val($(this).data("value"));

        $(this).parents(".dropdown").children("a").children(".now_value").html($(this).html());

        // console.log(now_selector_name,now_selector_name,now_val);

        // $(this).parents("tab-pane").children(".input_area").children(`#${$(this).parent().attr("id")}_input`).val($(this).data("value"));
        // query(now_page_name)
    });
    $("input[type=checkbox].dropdown-item").click(function (e) {
        let output_value = [];
        let a = $(this).parents(".dropdown-menu").find(".dropdown-item")
        $.each(a, function (i, v) {
            if ($(v).prop("checked")) {
                output_value.push($(v).data("value"));
            }

        });

        let now_page_name = $(this).parents(".tab-pane").attr("id");
        let now_selector_name = $(this).parents(".dropdown").children("a").attr("id");
        $(`#${now_page_name}`).children(".input_area").children(`#${now_selector_name}_input`).val(output_value);
        // alert($(this).prop("checked"))
        // query(now_page_name)
    });
});
function query(now_manager_page) {

    let manager_setting = {}

    $.each($(`#${now_manager_page}`).children(".input_area").children("input"), function (i, v) {
        let now_val = $(v).val();
        manager_setting[$(v).attr("id").replace("_input", "")] = now_val;
    });
    console.log(manager_setting);

    // $.ajax({
    //     type: "GET",
    //     url: "/api/manager",
    //     data: {
    //         manager_page:now_manager_page,
    //         manager_setting:manager_setting,
    //     },
    //     dataType: "dataType",
    //     success: function (response) {

    //     }
    // });
}






// fask link

$.ajax({
    type: "GET",
    url: "https://csiejar.xyz/api/fast_link",
    data: {},
    async:false,
    dataType: "json",
    success: function (response) {
        console.log(response)
        var fast_link = response.fast_link;
        
        for (let i in fast_link) {
            $("#link_edit_area").append(`
            <div class="input-group mb-3" data-link_id="${i}">
                <div class="input-group-prepend">
                <span class="input-group-text">標題</span>
                </div>
                <input type="text" class="form-control link_title" placeholder="連結標題" value="${fast_link[i].title}">
                <div class="input-group-prepend">
                    <span class="input-group-text">網址</span>
                </div>
                <input type="text" class="form-control link_url" placeholder="連結網址" value="${fast_link[i].link}" data-original="${fast_link[i].link}">
                <div class="ui_icons d-flex align-items-center">
                    <a href="#"  class="icon_ui ml-2 mr-2" data-action="PUT">
        
                        <i class="bi bi-check-circle-fill"></i>
                    </a>
                    <a href="#" class="icon_ui ml-2 mr-2" data-action="DELETE">
        
                        <i class="bi bi-trash"></i>
                    </a>
        
                </div>
        
            </div>
            `);
        }
        $("#links_manager").append(`
            <div class="d-flex justify-content-center w-100">
            
                <button type="button" class="btn btn-light w-25" id="add_fast_link_btn"><i class="bi bi-plus"></i></button>
            </div>
        `);
    }
});



var add_delay = true
$(document).ready(function () {
    $("#add_fast_link_btn").click(function (e) { 
        e.preventDefault();
        
        $("#link_edit_area").append(`
            <div class="input-group mb-3" data-link_id="">
                <div class="input-group-prepend">
                <span class="input-group-text">標題</span>
                </div>
                <input type="text" class="form-control link_title" placeholder="連結標題" value="">
                <div class="input-group-prepend">
                    <span class="input-group-text">網址</span>
                </div>
                <input type="text" class="form-control link_url" placeholder="連結網址" value="">
                <div class="ui_icons d-flex align-items-center">
                    <a href="#"  class="add_ui ml-2 mr-2" data-action="POST">

                        
                        <i class="bi bi-cloud-plus"></i>
                    </a>
                    <a href="#" class="add_ui ml-2 mr-2" data-action="DELETE">

                        <i class="bi bi-trash"></i>
                    </a>

                </div>

            </div>
        `);
        
        $(".add_ui").click(function (e) { 
    
            e.preventDefault();
            var now_obj = $(this)
            if($(this).data("action") == "POST"){
                if(add_delay){
                    add_delay = false
                    $.ajax({
                        type: $(this).data("action"),
                        url: "https://csiejar.xyz/api/fast_link",
                        data: {
                            user_id:getCookie().user_id,
                            user_token:getCookie().user_token,
                            title:$(this).parents(".input-group").find(".link_title").val(),
                            link:$(this).parents(".input-group").find(".link_url").val()
                        },
                        dataType: "json",
                        success: function (response) {
                            add_delay = true
                            console.log(response);
                            
                            if(response.status == "success"){
                                $(now_obj).parents(".input-group").remove();
                                $("#link_edit_area").append(`
                                    <div class="input-group mb-3" data-link_id="${response.fast_link.link_id}">
                                        <div class="input-group-prepend">
                                        <span class="input-group-text">標題</span>
                                        </div>
                                        <input type="text" class="form-control link_title" placeholder="連結標題" value="${response.fast_link.title}">
                                        <div class="input-group-prepend">
                                            <span class="input-group-text">網址</span>
                                        </div>
                                        <input type="text" class="form-control link_url" placeholder="連結網址" value="${response.fast_link.link}" data-original="${response.fast_link.link}">
                                        <div class="ui_icons d-flex align-items-center">
                                            <a href="#"  class="icon_ui ml-2 mr-2" data-action="PUT">
                                
                                                <i class="bi bi-check-circle-fill"></i>
                                            </a>
                                            <a href="#" class="icon_ui ml-2 mr-2" data-action="DELETE">
                                
                                                <i class="bi bi-trash"></i>
                                            </a>
                                
                                        </div>
                                
                                    </div>
                                    `);
    
                                edit_btn_lis()
        
                            }else{
                                alert(response.status);
                            }
            
                        }
                    });
            
                }
    
            }else if($(this).data("action") == "DELETE"){
                $(this).parents(".input-group").remove();
            }
        });
    });
    edit_btn_lis()
    
});
function edit_btn_lis(){
    $(".link_url").keyup(function (e) { 
        e.preventDefault();
        if($(this).val() != $(this).data("original")){
            $(this).parents(".input-group").find(".icon_ui[data-action=PUT]").html('<i class="bi bi-check-circle"></i>')
        
        }
    });
    $(".icon_ui").click(function (e) { 
        e.preventDefault();
        // $(this).parents(".input-group").data("link_id")
        // alert($(this).data("action"));
        var now_obj = $(this)
        if(add_delay){
            add_delay = false
            $.ajax({
                type: $(this).data("action"),
                url: "https://csiejar.xyz/api/fast_link",
                data: {
                    user_id:getCookie().user_id,
                    user_token:getCookie().user_token,
                    link_id:$(this).parents(".input-group").data("link_id"),
                    new_title:$(this).parents(".input-group").find(".link_title").val(),
                    new_link:$(this).parents(".input-group").find(".link_url").val()
                },
                dataType: "json",
                success: function (response) {
                    add_delay = true
                    console.log(response);
                    if(response.status == "success"){
                        if($(now_obj).data("action") == "PUT"){
                            $(now_obj).parents(".input-group").find(".link_title").val(response.new_fast_link.title)
                            $(now_obj).parents(".input-group").find(".link_url").val(response.new_fast_link.link)
                            $(now_obj).parents(".input-group").find(".icon_ui[data-action=PUT]").html('<i class="bi bi-check-circle-fill"></i>')
                            $(this).parents(".input-group").find(".link_url").attr("data-original",response.new_fast_link.link)
                            
                            alert("變更成功")
                        }else if($(now_obj).data("action") == "DELETE"){
                            $(now_obj).parents(".input-group").remove();
                             alert("刪除成功")
                        }else{
                            alert("wtf")
                        }
                    }else{
                        alert(response.status);
                    }
    
                }
            });
            }
        });
}
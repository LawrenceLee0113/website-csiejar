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

});
function downloadHtml(){
    $.ajax({
        type: "get",
        url: "https://web.csiejar.xyz/edit-get/" + editMode,
        data: {},
        dataType: "json",
        success: function (response) {
            $("#edit-input").val(response);
            alert("！！下載成功！！");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            alert("！！下載目前html失敗！！")
        }
    });
}
$(document).ready(function () {
    $("#download-btn").click(function (e) {
        e.preventDefault();
        if (confirm("是否下載" + editMode + "目前在網站上的html?")) {
            if (confirm("！！注意！！將會覆蓋現有的html檔")) {
                downloadHtml();
            }
        }
    });
    $("#view-btn").click(function (e) {
        e.preventDefault();
        var htmldata = $("#edit-input").val();
        $(".view-output").html(htmldata);
        

    });
    $("#upload-btn").click(function (e) {
        e.preventDefault();

        if(confirm("!重要! 是否上傳目前html到班網的"+editMode)){

            var data = $("#edit-input").val();
            data = data.trim();
            $.ajax({
                type: "POST",
                url: "https://web.csiejar.xyz/edit-get/" + editMode,
                data: { "passKey":passKey,"data": data },
                dataType: "json",
                success: function (response) {
                    alert(response)
                },
                 error: function (jqXHR, textStatus, errorThrown) {
                    alert(response)
                }
            });
        }else{
            alert("已取消!!")
        }

    });
    $("#submitComment").click(function (e) { 
        e.preventDefault();
        var data = $("#comment-input").val();

        $.ajax({
            type: "POST",
            url: "https://web.csiejar.xyz/comment",
            data: {"commentText":data},
            dataType: "json",
            success: function (response) {
                alert(response);
            }
        });
        
    });
});
$(document).ready(function () {
    if(getCookie()["user_id"] != ""){
        
        article_data((res)=>{
            let article_json = res.article
            console.log(article_json);
                let article_tmpl_html = `
                <div class="card mb-4 w-100 flex-row" style=""> <input type="hidden" value="" class="article_id"> <div class="view_img_container card-img-left p-3 " style="height: 158px;width: 158px;"> <div class="view_img_container_wrapper h-100 w-100 border d-flex align-items-center" style="overflow: hidden;"> <img src="https://fakeimg.pl/400x800/" class="w-100"> </div> </div> <div class="card-body"> <h5 class="card-title">article subject</h5> <p class="card-text"> <ul class="d-flex p-0"> <li class="d-inline"> &#9824<span>上架、下架</span> </li> <li class="d-inline"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16"> <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /> </svg> <span>2021年5月3日</span> </li> <li class="d-inline"> <span class="badge badge-danger">公告</span> </li> </ul> </p> <div class="article_edit_ui d-flex w-100 justify-content-end"> <a href="#" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"> <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" /> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" /> </svg> </a> <a href="#" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /> </svg> </a> <a href="/home" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" /> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" /> </svg> </a> <a href="#" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" class="isupload_t" fill="currentColor" class="bi bi-clipboard2-check-fill " viewBox="0 0 16 16"> <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z" /> <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5Zm6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708Z" /> </svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="isupload_f" class="d-none bi bi-clipboard2-check" viewBox="0 0 16 16"> <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z" /> <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z" /> <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z" /> </svg> </a> </div> </div> </div>
                    `
                
                for(let i in article_json){
                    console.log(i)
                    
                    let article_tmpl = $.parseHTML( article_tmpl_html )
    
                    $(article_tmpl).attr("id",`${article_json[i].article_id}_card`);
                    
                    $(article_tmpl).find(".card-title").html(article_json[i].subject)
                    $(article_tmpl).find(".d-inline").children("span:eq(0)").html(article_json[i].isupload)
                    $(article_tmpl).find(".d-inline").children("span:eq(1)").html(article_json[i].create_time)
                    $(article_tmpl).find(".d-inline").children("span:eq(2)").html(article_json[i].article_type)
                    $(article_tmpl).find(".article_edit_ui").children("a:eq(0)").attr("href",`/article_edit/${article_json[i].article_id}`)
                    // $(article_tmpl).find(".article_edit_ui").children("a:eq(1)").attr("href",`/delete`)
                    $(article_tmpl).find(".article_edit_ui").children("a:eq(1)").attr("onclick",`delete_article("${article_json[i].article_id}")`)
                    $(article_tmpl).find(".article_edit_ui").children("a:eq(2)").attr("href",`${article_json[i].article_link}`)
                    $(article_tmpl).find(".article_edit_ui").children("a:eq(3)").attr("onclick",`isupload_article("${article_json[i].article_id}","${article_json[i].isupload}")`)
                    isupload_show(article_tmpl,article_json[i].isupload)
                    $(article_tmpl).find(".article_id").val(article_json[i].article_id)
                    $(article_tmpl).find(".view_img_container").find("img").attr("src",article_json[i].article_img_url)
    
                    $("#article_card_container").append(article_tmpl);
                }
        },{"get_mode":"article","user_id":getCookie().user_id})
    }
});
function delete_article(article_id){
    if(confirm(`是否確定刪除"${article_id}"?(將永久刪除!)`)){

        let user_id = getCookie().user_id
        let user_token = getCookie().user_token
        $.ajax({
            type: "DELETE",
            url: "api/article",
            data: {
                article_id:article_id,
                user_id:user_id,
                user_token:user_token
            },
            dataType: "json",
            success: function (response) {
                console.log(response)
                let status = response.status
                if(status == "success"){
                    alert("刪除成功")
                    $(`#${article_id}_card`).remove();
                }else{
                    alert(status)
                }
    
                let new_user = getCookie()
                
                new_user.user_token = response.user_token
                setCookie(new_user)
    
            }
        });
    }

}

function isupload_show(obj,status){
    if(status=="true"){
        $(obj).find(".article_edit_ui").children("a:eq(3)").children(".isupload_t").show();
        $(obj).find(".article_edit_ui").children("a:eq(3)").children(".isupload_f").hide();
    }else{
        $(obj).find(".article_edit_ui").children("a:eq(3)").children(".isupload_f").show();
        $(obj).find(".article_edit_ui").children("a:eq(3)").children(".isupload_t").hide();
    }
}


function isupload_article(article_id,status){
    console.log("status",status)
    var status_str;
    var isupload = (status == "true")
    if(isupload){
        status_str = "下架"

    }else{
        status_str = "上架"

    }
    if(confirm(`是否確定${status_str}"${article_id}"?(上架:每個人可以看到,下架:只有管理員和你可以看到)`)){

        let user_id = getCookie().user_id
        let user_token = getCookie().user_token
        $.ajax({
            type: "PUT",
            url: "api/article",
            data: {
                article_id:article_id,
                user_id:user_id,
                user_token:user_token,
                change:"isupload",
                change_data:`{'isupload':'${!isupload}'}`
            },
            dataType: "json",
            success: function (response) {
                console.log(response)
                let status = response.status
                if(status == "success"){
                    alert("狀態更新成功")
                    isupload_show($(`#${article_id}_card`),(!isupload).toString())
                    $(`#${article_id}_card`).find(".article_edit_ui").children("a:eq(3)").attr("onclick",`isupload_article("${article_id}","${(!isupload).toString()}")`)
                    $(`#${article_id}_card`).find(".d-inline").children("span:eq(0)").html((!isupload).toString())

                }else{
                    alert(status)
                }
    
                let new_user = getCookie()
                
                new_user.user_token = response.user_token
                setCookie(new_user)
    
            }
        });
    }
}
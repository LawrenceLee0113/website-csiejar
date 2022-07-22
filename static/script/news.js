$(document).ready(function () {
    article_data((res)=>{
        let article_json = res.article
        console.log(article_json);
            let article_tmpl_html = `
<div class="card mb-2 w-100 flex-row" style=""> <div class="view_img_container card-img-left p-3 " style="height: 200px;width: 200px;"> <div class="view_img_container_wrapper h-100 w-100 border d-flex align-items-center " style="overflow: hidden;"> <img src="https://fakeimg.pl/400x800/" class="w-100"> </div> </div> <div class="card-body d-flex flex-column justify-content-between" style="width: calc(100% - 200px);"> <h5 class="card-title"><span class="subject"></span> <span class="badge badge-danger article_type">公告</span></h5> <div class="card-text view_content w-100" > </div> <div class="div article_uis w-100 d-flex justify-content-between"> <ul class="d-flex p-0 mb-0"> <li class="d-inline mr-3"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16"> <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/> </svg> <span></span> </li> <li class="d-inline mr-3"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16"> <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z" /> </svg> <span></span> </li> <li class="d-inline mr-3"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg> <span></span> </li> <li class="d-inline mr-3"> <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-chat-right-fill" viewBox="0 0 16 16"> <path d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/> </svg> <span></span> </li> </ul> <ul class="d-flex p-0 mb-0"> <li class="d-inline mr-3"> <a href="/home"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"></path> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"></path> </svg> <span>閱讀完整內容</span> </a> </li> </ul> </div> </div> </div>
            `
            
            for(let i in article_json){
                console.log(i)
                
                let article_tmpl = $.parseHTML( article_tmpl_html )
                
                $(article_tmpl).find(".card-title .subject").html(article_json[i].subject)
                $(article_tmpl).find(".view_content").html(article_json[i].content)
                $(article_tmpl).find(".article_uis .left_ul .d-inline").children("span:eq(0)").html(article_json[i].article_owner_name)
                $(article_tmpl).find(".article_uis .left_ul .d-inline").children("span:eq(1)").html(article_json[i].last_edit_time)
                // $(article_tmpl).find(".article_uis .d-inline").children("span:eq(2)").html(article_json[i].view_amount)
                // $(article_tmpl).find(".article_uis .d-inline").children("span:eq(3)").html(article_json[i].command_amount)
                
                console.log($(article_tmpl).find(".article_uis .right_ul .d-inline").children("a:eq(0)").attr("href"))


                $(article_tmpl).find(".view_img_container").find("img").attr("src",article_json[i].article_img_url)

                $("#article-news").append(article_tmpl);
            }
    },{"get_mode":"card","article_type":"news"})
});
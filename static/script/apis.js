var authenticationEndpoint = "https://csiejar.xyz/uploadImage";
var uploadData = true;
function change_user_token(new_token){
    user.token = new_token
}
function progress_controller(progressId, num,finish_func=()=>{}) {
    $("#" + progressId).parent().show()
    $("#" + progressId).css("width", `${num}%`).attr("aria-valuenow", `${num}`).html(`${num}%`);
    if (num == "100") {
      setTimeout(() => {
        $("#" + progressId).addClass("bg-success").html("上傳成功").removeClass("progress-bar-animated");
        finish_func()
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
    // formData.append("useUniqueFileName","false");//唯一照片
    // alert("upload success")
    // Let's get the signature, token and expire from server side
    status_func.status0()
    $.ajax({
        url: authenticationEndpoint,
        method: "POST",
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

//取得 文章類型

function article_data(func){
// function article_data({condition_type="article_type",article_type="none",other="none",user_id=user.user_id}){
    // $.ajax({
    //     type: "get",
    //     url: "/api/article",
    //     data: {
    //         "user_id":user_id,
    //         "condition_type":condition_type,// article_type other
    //         "article_type":article_type,
    //         "other":other//home home_img
            
    //     },
    //     dataType: "json",
    //     success: function (response) {
    //         console.log(response)
    //     }
    // });
    $.ajax({
        type: "get",
        url: "/static/data/article_data.json",
        data: {},
        dataType: "json",
        success: function (response) {
            console.log(response)
            func(response)
            // return response.article_id
        }
    });
}

function show_article({article_json,article_mode="home"}){
    

    switch(article_mode){
        case "full"://全頁文章
            

            break;
        case "card"://文章預覽

            break;
        case "home_img"://首頁大圖區
            console.log(article_json);
            let article_tmpl_html_full = `
            <div class="carousel-item " style="height: 400px;"> <a href="" class="w-100 d-flex justify-content-center align-items-center h-100"> <img class="" src="https://fakeimg.pl/1200x400/" alt="First slide" style="max-height: 100%;max-width: 100%;"> </a> </div>
            `

            let controler_tmpl_html_full = `
            <li data-target="#carouselExampleIndicator" data-slide-to="num" class="className"></li>
            `
            let _counter = 0
            for(let i in article_json){
                console.log(i)
                
                let article_tmpl = $.parseHTML( article_tmpl_html_full )
                
                $(article_tmpl).find("img").attr("src",article_json[i].big_img_url)
                $(article_tmpl).find("a").attr("href",article_json[i].article_link)

                
                //ol---------
                let className = ""



                //first setting
                
                if(_counter == 0){
                    className = "active"
                    $(article_tmpl).addClass("active")

                }


                $("#carouselExampleIndicator").find(".carousel-inner").append(article_tmpl);
                $("#carouselExampleIndicator").find("ol").append(controler_tmpl_html_full.replace("num", `${_counter}`).replace("className", `${className}`));
                _counter++
            }
            break;
        case "home"://首頁區

        console.log(article_json);
        let article_tmpl_html_home = `
        <div class="card" style="width: 16rem;"> <a class="img_wrapper card-img-top d-flex justify-content-center align-items-center" style="height: 200px;background-color: #9B9B9B;" href=""> <img class="" src="https://fakeimg.pl/900x500/" alt="Card image cap" style="max-height: 100%;max-width: 100%;"> </a> <div class="card-body"> <h5 class="card-title">Card title</h5> <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> <a href="#" class="btn btn-primary">Go somewhere</a> </div> </div>
        `
        
        for(let i in article_json){
            console.log(i)
            
            let article_tmpl = $.parseHTML( article_tmpl_html_home )
            
            $(article_tmpl).find("img").attr("src",article_json[i].ishome_img)
            $(article_tmpl).find(".card-title").html(article_json[i].subject)
            $(article_tmpl).find(".card-text").html(article_json[i].content)
            $(article_tmpl).children(".card-body").find("a").attr("href",article_json[i].article_link)
            $(article_tmpl).children("a").attr("href",article_json[i].article_link)

            $(".cards_area").append(article_tmpl);
        }

            
            break;
        case "article"://文章分頁
            console.log(article_json);
            let article_tmpl_html = `
                <div class="card mb-2 w-100 flex-row" style=""> <div class="view_img_container card-img-left p-3 " style="height: 158px;width: 158px;"> <div class="view_img_container_wrapper h-100 w-100 border d-flex align-items-center" style="overflow: hidden;"> <img src="https://fakeimg.pl/400x800/" class="w-100"> </div> </div> <div class="card-body"> <h5 class="card-title">article subject</h5> <p class="card-text"> <ul class="d-flex p-0"> <li class="d-inline"> &#9824<span>上架、下架</span> </li> <li class="d-inline"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen-fill" viewBox="0 0 16 16"> <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001z"/> </svg> <span>2021年5月3日</span> </li> <li class="d-inline"> <span class="badge badge-danger">公告</span> </li> </ul> </p> <div class="article_edit_ui d-flex w-100 justify-content-end"> <a href="#" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16"> <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" /> <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z" /> </svg> </a> <a href="#" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" /> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" /> </svg> </a> <a href="/home" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-up-right" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z" /> <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z" /> </svg> </a> <a href="#" class="btn btn-link"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2-check-fill " viewBox="0 0 16 16"> <path d="M10 .5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5.5.5 0 0 1-.5.5.5.5 0 0 0-.5.5V2a.5.5 0 0 0 .5.5h5A.5.5 0 0 0 11 2v-.5a.5.5 0 0 0-.5-.5.5.5 0 0 1-.5-.5Z" /> <path d="M4.085 1H3.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1h-.585c.055.156.085.325.085.5V2a1.5 1.5 0 0 1-1.5 1.5h-5A1.5 1.5 0 0 1 4 2v-.5c0-.175.03-.344.085-.5Zm6.769 6.854-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708.708Z" /> </svg> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="d-none bi bi-clipboard2-check" viewBox="0 0 16 16"> <path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z" /> <path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z" /> <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z" /> </svg> </a> <a href="#" class="btn btn-link"> </a> <a href="#" class="btn btn-link"> </a> </div> </div> </div>
                `
            
            for(let i in article_json){
                console.log(i)
                
                let article_tmpl = $.parseHTML( article_tmpl_html )
                
                $(article_tmpl).find(".card-title").html(article_json[i].subject)
                $(article_tmpl).find(".d-inline").children("span:eq(0)").html(article_json[i].isupload)
                $(article_tmpl).find(".d-inline").children("span:eq(1)").html(article_json[i].create_time)
                $(article_tmpl).find(".d-inline").children("span:eq(2)").html(article_json[i].article_type)
                $(article_tmpl).find(".article_edit_ui").children("a:eq(0)").attr("href",`/article_edit/${article_json[i].article_id}`)
                $(article_tmpl).find(".article_edit_ui").children("a:eq(1)").attr("href",`/delete`)
                $(article_tmpl).find(".article_edit_ui").children("a:eq(2)").attr("href",`${article_json[i].article_link}`)
                $(article_tmpl).find(".article_edit_ui").children("a:eq(3)").attr("href",`/check`)


                $(article_tmpl).find(".view_img_container").find("img").attr("src",article_json[i].article_img_url)

                $("#article_card_container").append(article_tmpl);
            }
            break;

    }
}
$(document).ready(function () {
    
    article_data((res)=>{
        
        show_article({article_json:res.article_id,article_mode:"home"})
    })
    article_data((res)=>{
        
        show_article({article_json:res.article_id,article_mode:"home_img"})
    })

});
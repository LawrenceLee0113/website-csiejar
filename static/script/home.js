$(document).ready(function () {
    
    article_data((res)=>{
        let article_json = res.article
        console.log(article_json);
        let article_tmpl_html_home = `
        <div class="card" style=""> <a class="img_wrapper card-img-top d-flex justify-content-center align-items-center" style="height: 200px;background-color: #9B9B9B;" href=""> <img class="" src="https://fakeimg.pl/900x500/" alt="Card image cap" style="max-height: 100%;max-width: 100%;"> </a> <div class="card-body"> <h5 class="card-title">Card title</h5> <p class="card-text view_content">Some quick example text to build on the card title and make up the bulk of the card's content.</p> <a href="#" class="btn btn-primary">Go somewhere</a> </div> </div>
        `
        
        for(let i in article_json){
            console.log(i)
            
            let article_tmpl = $.parseHTML( article_tmpl_html_home )
            
            $(article_tmpl).find("img").attr("src",article_json[i].article_img_url)
            $(article_tmpl).find(".card-title").html(article_json[i].subject)
            $(article_tmpl).find(".card-text").html(article_json[i].content)
            $(article_tmpl).children(".card-body").find("a").attr("href",article_json[i].article_link)
            $(article_tmpl).children("a").attr("href",article_json[i].article_link)

            $(".cards_area").append(article_tmpl);
        }
    },{get_mode:"home"})
    article_data((res)=>{
        
        let article_json = res.article
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
    },{get_mode:"home_img"})

    $.ajax({
        type: "GET",
        url: "/api/fast_link",
        data: {},
        dataType: "json",
        success: function (response) {
            console.log(response.fast_link)
            for(let i in response.fast_link){
                console.log(i)
                jQuery('<a>', {
                    style: 'flex:33%',
                    href: response.fast_link[i].link,
                    html: response.fast_link[i].title,
                    class:"btn-link"
                }).appendTo('.link_container');
            }
        }
    });
});
$(document).ready(function () {
    
    article_data((res)=>{
        
        show_article({article_json:res.article,article_mode:"home"})
    },{get_mode:"home"})
    article_data((res)=>{
        
        show_article({article_json:res.article,article_mode:"home_img"})
    },{get_mode:"home_img"})

});
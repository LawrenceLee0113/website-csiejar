$(document).ready(function () {
    article_data((res)=>{
        show_article({article_json:res.article,article_mode:"article"})
    },{"get_mode":"article","user_id":user.user_id})
});
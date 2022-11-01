var emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

function verifyPassLength(password1, password2) {

    //check empty password field
    if (password1 != password2) {
    
        alert("兩次密碼不相符!");
        return false;
    }
    if(password1 == "")
    {
        alert("密碼不得為空值...!");
        return false;
    }
    
    //Password minimum length
    if(password1.length < 6) 
    {
        alert("密碼長度需要至少6字元!");
        return false;
    }

    //Password maximum length
    if(password1.length > 12)
    {
        alert("密碼長度需要小於12字元!");
        return false;
    }
    if(!((password1.match(/[a-z]/g) || password1.match(/[A-Z]/g)) && password1.match(/[0-9]/g))){
        alert("密碼至少一個英文與數字!");
        return false;
    }
    return true;
}
function email_change(obj){
    
    if($(obj).val().search(emailRule)!= -1){
        $(obj).css("border-color","#2ecc71");
        return true;
    }else{
        $(obj).css("border-color","red");
        return false;
    }
}
function name_check(obj){

    if($(obj).val().trim().length < 6){
        $(obj).css("border-color","red");
        return false;
    }
    
    if($(obj).val().trim()=="" || $(obj).val()==null || $(obj).val()==undefined){
        $(obj).css("border-color","red");
        return false;
    }else{
        $(obj).css("border-color","#2ecc71");
        return true;
    }
}
$(document).ready(function () {
    $("#signup_form input[name=mail]").change(function (e) { 
        e.preventDefault();
        email_change(this);
    });

    $("#signup_form input[type=submit]").click(function (e) { 
        e.preventDefault();
        var now_mail = $("#signup_form input[name=mail]").val()
        if(verifyPassLength($("#password1").val(),$("#password2").val()) && email_change($("#signup_form input[name=mail]")) && name_check($("#signup_form input[name=name]")))(
            $.ajax({
                url:"/api/our_signup",
                type:"POST",
                data:$("#signup_form").serialize()+'&form_name='+$("#signup_form").attr("name"),
                success: function(data){
                    switch(data.status){
                        case "傳送成功":
                            console.log(data);
							
                            // window.location.href = "/send_mail_success";
                            $(".container").html(`
                            <div class="hint_box w-50 bg-light border d-flex justify-content-center flex-column">
                            <h1 class="text-center">註冊成功</h1>
                            <div class="hint_text d-flex justify-content-center">
                
                                <p class="w-75"><span id="email_hint">aaa@gmail.com</span>信件已成功寄出 請至自己的電子信箱裡點擊連結註冊CSIEJAR_ID</p>
                            </div>
                            <div class="link_area justify-content-center d-flex">
                
                                <a href="/home" class="btn btn-link btn-primary bg-primary text-light">首頁按此</a>
                            </div>
                
                        </div>
                            `);
                            $(".container").addClass("justify-content-center").addClass("d-flex");
                            $("#email_hint").html(now_mail);
                            break;
                        case "名稱不得為空":
                            alert("名稱不得為空");
                            break;
                        case "密碼長度不足六位":
                            alert("密碼長度不足六位");
                            break;
                        case "密碼不可空白或含有空格":
                            alert("密碼不可空白或含有空格");
                            break;
                        case "Email不可空白或含有空格":
                            alert("Email不可空白或含有空格");
                            break;
                        case "Email已被使用":
                            alert("Email已被使用");
                            $("#signup_form input[name=mail]").css("border-color","red");
                            break
                    }
                },
            })
        )
    });
    
    $("#signin_form input[type=submit]").click(function (e) { 
        e.preventDefault();
            $.ajax({
                url:"/api/our_login",
                type:"POST",
                data:$("#signin_form").serialize()+'&form_name='+$("#signin_form").attr("name"),
                success: function(data){
                    // console.log(data.sta);
                    switch(data.status){
                        case "success":
                            console.log(data);
                            setCookie({
                                user_id: data.user.user_id,
                                user_token: data.user.user_token,
                                login_type: data.user.login_type
                            })
                            window.location.href = "/home";
                            break;
                        case "Password Error":
                            alert("密碼錯誤");
                            break;
                        case "Account is not define":
                            alert("沒有與此email相符合的帳號");
                            break;
                    }
                },
            })
    });
});
function return_img_uploader(finish_func){
  //上傳 img 檔案至 image kit
  let new_img_url = ""
  imagekit_uploader({
      file_id:"return_img_uploader",
      user_id:user.user_id,
      user_token:user.user_token,
      file_name: "error_"+user.user_id,
      folder_name:"/error",
      file_type:"png",
      status_func:{
          status0:()=>{//req send(self server)
              console.log("status0")
              progress_controller("return_img_progress",25)
          },
          status1:(body)=>{//res catch(self server)
              console.log("status1")
              // change_user_token(body.user.user_token)
              progress_controller("return_img_progress",50)
              
          },
          status2:()=>{//req send(imgkit server)
              // progress_controller("return_img_progress",75)
              console.log("status2")
          },
          status3:(body)=>{//res catch(imgkit server)
              progress_controller("return_img_progress",75)
              console.log("status3")
              console.log(body)
              $("#return_img_uploader_url").val(body.url)
              finish_func(body)
          }
      }
  })
}
$(document).ready(function () {
  let option_template = $("#btnGroupDrop1_li a");
  let output_html = ""
  $.each($("#top_nav_ul").children(".nav-item").children(".nav-link"), function (i, v) {
    //取得各個分業名稱 並加入output_html
    output_html += $(option_template).html($(v).html()).prop('outerHTML')
  });
  $("#btnGroupDrop1_li").append(output_html);//把output_html 加入選項
  $(option_template).html("選擇分頁")//初始化設定(first one)
  $("#btnGroupDrop1_li a").click(function (e) {
    // 把選項加入input裡
    e.preventDefault();
    let option = $(this).html();
    $("#btnGroupDrop1").html(option);
    $("#return_page_input").val(option);
  });
  $("#return_submit").click(function (e) {
    // 送出回報錯誤表單
    return_img_uploader((body)=>{
      let return_obj = {
        "return_page_input": $("#return_page_input").val(),
        "return_title_input": $("#return_title_input").val(),
        "return_content_input": $("#return_content_input").val(),
        "return_img_url_input": $("#return_img_uploader_url").val(),
        "return_mail_input": $("#return_mail_input").val()
      }
      console.log(return_obj)
      $.post("/returnError", return_obj,
        function (data, textStatus, jqXHR) {
          progress_controller("return_img_progress",100)

          console.log(data)
        },
        "json"
      );

    })
    
  });
  $("#return_img_uploader_btn").click(function (e) {
    //報錯 img 檔案的按鈕
    $('#return_img_uploader').trigger('click');
  });


  view_img("return_img_uploader","return_img_uploader_container_b")

});
// progress_controller("return_img_progress", 87)//測試 上傳img

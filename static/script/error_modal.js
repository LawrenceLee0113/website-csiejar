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
    e.preventDefault();
    let return_obj = {
      "return_page_input": $("#return_page_input").val(),
      "return_title_input": $("#return_title_input").val(),
      "return_content_input": $("#return_content_input").val(),
      "return_img_url_input": $("#return_img_url_input").val(),
      "return_mail_input": $("#return_mail_input").val()
    }
    console.log(
      $("#return_page_input").val(),
      $("#return_title_input").val(),
      $("#return_content_input").val(),
      $("#return_img_url_input").val(),
      $("#return_mail_input").val()
    )
    $.post("/return", { return_obj: return_obj },
      function (data, textStatus, jqXHR) {
        console.log(data)
      },
      "json"
    );
  });
});
progress_controller("return_img_progress", 87)//測試 上傳img

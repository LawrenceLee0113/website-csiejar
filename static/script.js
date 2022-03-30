var menuMode = 1;
function doanimation(i) {
  if (i == 0) {//off
    $(".menu").animate({
      width: "0px"

    },function(){
      $(".menu").hide();

    })
    return 1;
  } else if (i == 1) {//on
    $(".menu").animate({
      width: "180px"

    })
    $(".menu").show();

    return 0;
  } else {
    alert("unknown error");
  }
}

function changeIconStyle(href){
  var $urls = $(".menu-content-item a");
  $.each($urls, function (indexInArray, valueOfElement) { 
    var url = $(valueOfElement).attr("href")
    if(url == href){ 
      console.log("asdf");
      $(valueOfElement).parents(".menu-content-item").css("background-color","rgb(106, 167, 202)");
      var str = $(valueOfElement).find("ion-icon").attr("name");
      if(str.slice(-8)=="-outline"){
        str = str.slice(0,-8)+"";

      }
      
      $(valueOfElement).find("ion-icon").attr("name",str);
    }else{
      $(valueOfElement).parents(".menu-content-item").css("background-color","");
      var str = $(valueOfElement).find("ion-icon").attr("name");
      if(str.slice(-8)!="-outline"){
        str += "-outline";
        $(valueOfElement).find("ion-icon").attr("name",str);
      }
    }

  });
  // $.each(collection, function (indexInArray, valueOfElement) { 
     
  // });
}

var nowPage = "";
$(document).ready(function () {
  menuMode = doanimation(1);//menu default movement

  

  $(".menu-btn a").click(function (e) { //open or close menu animation
    e.preventDefault();

    menuMode = doanimation(menuMode);
  });
  
  
  $(".side-menu-btn").mouseenter(function () { //auto open menu
    menuMode = doanimation(1);
  });
  $(".content").mouseenter(function () { //auto close menu
    menuMode = doanimation(0);
  });

  $(".menu-content-item a").click(function (e) { //menu a item
    e.preventDefault();
    var href = $(this).attr("href");
    changeIconStyle(href);

  });
  
});


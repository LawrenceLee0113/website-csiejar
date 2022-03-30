var colors = ["rgb(72, 141, 182)","rgb(255, 255, 255)","rgb(84, 100, 109)"]

var num = 0;
$(document).ready(function () {
    $("#changeColorBtn").click(function (e) { 
        e.preventDefault();
        $(".head").css("background-color",colors[num++]);
        // $(".menu").css("background-color",colors[num++]);
        
    });
    let input = document.querySelector('input');
    

// input.onchange = handleChange;

function handleChange(e) {
  var color = e.target.value;
  $(".menu").css("background-color",color);
  $(".head").css("background-color",color);
  
}
});

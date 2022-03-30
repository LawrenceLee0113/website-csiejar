var editMode = "none";
function changeStyle() {
    var select = $(".inner-content");
    $.each(select, function (i, v) {

        // var data = $(v).children("a").css("color","red")
        var data2 = $(v).parent().attr("class");



        if (editMode == data2) {
            $(v).children("a").css("color", "rgb(255, 238, 0)")
            $(v).children("a").css("font-weight", "bolder")
            $(v).children("a").css("font-size", "25px")

            var data = $(v).children().html();

            $("#page-hint").html(data);
        } else {
            $(v).children("a").css("color", "aliceblue")
            $(v).children("a").css("font-weight", "normal")
            $(v).children("a").css("font-size", "15px")

        }
    });
}

function changeEditMode(href) {
    window.location.href = "https://web.csiejar.xyz/edit/" + href;

}

var nowPagesChineseName = [];
$.get("https://web.csiejar.xyz/data/basicData", {},
    function (data, textStatus, jqXHR) {
        nowPagesChineseName = data.pages;
    },
    "json"
);
function addChinesePageName(pagesName) {
    return nowPagesChineseName[pagesName]
}
$(document).ready(function () {


    editMode = $("#dataDiv").html();

    changeStyle();
    // alert(addChinesePageName(editMode))
    // $("#labHead3").html(addChinesePageName(editMode));


    $(".inner-content a").click(function (e) {

        e.preventDefault();

        var href = $(this).parent().parent().attr("class");

        changeEditMode(href);
    });
});
// $(".menu-content-item a").click(function (e) { //menu a item
// e.preventDefault();

// var href = $(this).attr("href");
// });
function addPage(href, mode = 0) {//add tag-div to contentText

    var content = $(".contentText").children("div");

    let hrefPageId = urlToId(href);

    let gate = true;
    $.each(content, function (i, v) {
        var $vj = $(v);
        var vjId = $vj.attr("id");


        if (vjId == hrefPageId) {
            gate = false;
        }
    });

    if (gate) {



        // console.log(a);
        $.ajax({
            type: "get",
            url: "https://web.csiejar.xyz/content/" + href.slice(0, -5),
            data: {},
            dataType: "json",
            success: function (response) {
                // alert(response)

                if (mode == 0) {
                    var content = $(".contentText").children("div");

                    let hrefPageId = urlToId(href);

                    let gate = true;
                    $.each(content, function (i, v) {
                        var $vj = $(v);
                        var vjId = $vj.attr("id");


                        if (vjId == hrefPageId) {
                            gate = false;
                        }
                    });
                    if (gate) {

                        $(".contentText").append("<div style='display:none;' id='" + href.slice(0, -5) + "-page'>" + response + "</div>");
                    }


                } else if (mode == 1) {

                    $(".contentText").append("<div id='" + href.slice(0, -5) + "-page'>" + response + "</div>");
                }
            }
        });


    }

}
function loadAllPage() {
    var items = $(".menu-content-item a");
    $.each(items, function (i, v) {

        let href = $(v).attr("href");
        addPage(href);
    });
}
function switchPage(id) {
    var content = $(".contentText").children("div");
    $.each(content, function (i, v) {
        var $vj = $(v);
        var vjId = $vj.attr("id");

        if (vjId == id) {
            $vj.show();
            nowPage = id;

            // console.log("asdf");

        } else {
            $vj.hide();
        }
    });
}

function urlToId(href) {//tiny tool
    return href.slice(0, -5) + "-page"
}
$(document).ready(function () {
    addPage("home.html", 1);

    $(".menu-content-item a").click(function (e) { //menu a item
        e.preventDefault();

        var href = $(this).attr("href");

        // addPage(href);

        switchPage(urlToId(href));

    });


    //load section


    var loadAll = true;
    $("body").mouseenter(function () {
        if (loadAll) {
            loadAllPage();
        }
        loadAll = false;
    })
});
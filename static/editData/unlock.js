var passKey = "";
        var pass = false;
        function requestKey(key){
            $.ajax({
                type: "POST",
                url: "https://web.csiejar.xyz/checkEditKey/"+editMode,
                data: {"key":key},
                dataType: "json",
                success: function (response) {
                    // var passMode = "pass";
                    var passMode = response.mode;
                    console.log(response);

                    if(passMode == "pass"){
                        alert("~~通過~~")
                        pass = true;
                        passKey = response.nowUploadKey;
                        alert(passKey)
                    }else if(passMode == "unpass"){
                        alert("密碼不正確ㄟ 去跟班代要")

                        pass = false;

                    }

                    showEditPage();


                }
            });
        }

        function showEditPage(){
            if(pass&&editMode!="none"){
                $("#lock-hint-area").hide();
                $("#lock-area").show();
                downloadHtml();
            }else if(pass && editMode == "none"){
                $("#input-area").hide();
                $("#hint-text").show();
            }
        }

        $(document).ready(function () {
            $("#lock-area").hide();
            $("#keySubmit").click(function (e) { 
                e.preventDefault();

                var inputKey = $("#keyInput").val();
                requestKey(inputKey);
            });
        });
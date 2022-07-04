var user = {}
      user.view_name = "無敵臭臘腸"
      user.user_id = "user-654646844655646"
      user.role = "已認證"
      user.login_type = "google"
      user.img = "https://fakeimg.pl/350x200/ffbb00/000"
      function onSignIn(googleUser) {
        var profile = googleUser.getBasicProfile();
        console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
        var id_token = googleUser.getAuthResponse().id_token;
        $.post("/google_login", { 'id_token': id_token },
          function (data, textStatus, jqXHR) {
            console.log(data)
            user = data.user
          },
          "json"
        );
        login_success()
      }
      function login_success() {
        $("#login_btn").html("登出");
        $("#login_btn").attr("data-target", "#unloginModalCenter");

        $("#personnel_setting_view_name_input").val(user.view_name);
        $("#personnel_setting_user_id_label").html(user.user_id);
        $("#personnel_setting_role_label").html(user.role);
        $("#personnel_setting_login_type_label").html(user.login_type);
        $("#personnel_setting_img_url").val(user.img);
        $("#personnel_setting_view_img_container").html(`<img class="w-100"src="${user.img}">`);
      }
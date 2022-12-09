module.controller("PortalController", function(userInfo, $scope) {
    $scope.login = function(userNameLogin, passwordLogin) {

        //ニフクラ mobile backendにログインする
        NCMB.User.logIn(userNameLogin, passwordLogin, {
            success: function(user) {
                userInfo.refresh();
                myNavigator.pushPage("mainPage.html");
            },
            error: function(user, error) {
                ons.notification.alert({
                    message: error.message,
                    title: "ログイン失敗",
                    buttonLabel: "OK",
                    animation: "default"
                });
            }
        });
    };
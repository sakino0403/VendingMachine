var ncmb = new NCMB
("a59165a217e09aae15a26c95a9e51f8510ea7fbb8da9ad8c15686fa1c5b449e7", "32551b9f4f6afa631f1fc4b63df334ab33683be35b820813931f0e6c156aa4c3");

    var reader = new FileReader();
    reader.onload = function(e) {
      var dataUrl = reader.result;
      document.getElementById("image").src = dataUrl;
    }

    function downloadImage(){
      // ファイル名からファイルを取得
      var fileName = "D00000001.png";// TODO

      // ダウンロード（データ形式をblobを指定）
      ncmb.File.download(fileName, "blob")
           .then(function(blob) {
           // ファイルリーダーにデータを渡す
           reader.readAsDataURL(blob);
           })
           .catch(function(err) {
              console.error(err);
           })
    }
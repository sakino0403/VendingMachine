preview/* 画像プレビュー */
function imgPreView(event) {
  var file = event.target.files[0];
  var reader = new FileReader();
  var preview = document.getElementById("preview");
  var previewImage = document.getElementById("previewImage");
   
  if(previewImage != null) {
    preview.removeChild(previewImage);
  }
  reader.onload = function(event) {
    var img = document.createElement("img");
    img.setAttribute("src", reader.result);
    img.setAttribute("id", "previewImage");
    preview.appendChild(img);
  };
 
  reader.readAsDataURL(file);
}

// APIキーの設定とSDK初期化
  // API key.
  var applicationKey = "63c09d140ca840c6cb5cf58ed0cba0f65c12de5909076e21ad2768bf3e6a4a19";
  var clientKey = "cbc0ec451d1e8e1b5c00dcaee6f86be29bf40a1eb2fbcde09ea6dd209ca8961a";
  // SDK initialization.
  var ncmb = new NCMB(applicationKey, clientKey);

    // 共通機能
    const wait = (sec) => { // タイマ
      return new Promise((resolve, reject) => {
        setTimeout(resolve, sec*1000);
        //setTimeout(() => {reject(new Error("エラー！"))}, sec*1000);
      });
    };

    async function transition() {
      try {
        document.getElementById("loader-wrap").style.visibility = 'visible';
        await wait(3); // ここで処理待ち
        document.location.href='insertFixed.html';
      } catch (err) {
        console.error(err);
      }
    }

    // 画像アップロード用スクリプト
    function imgUpload(imageData) {
      // ncmbに画像をアップロード
      var fileName = makeUUID() + ".jpg";
      var fileData = toBlob(imageData, "image/jpeg");
      ncmb.File.upload(fileName, fileData);
      return fileName;
    }

    // Blob作成
    function toBlob(base64, mime_type) {
      var bin = atob(base64.replace(/^.*,/, ''));
      var buffer = new Uint8Array(bin.length);
      for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
      }

      try {
        var blob = new Blob([buffer.buffer], {
          type: mime_type
        });
      } catch (e) {
        return false;
      }
      return blob;
    }

    //UUID生成
    function makeUUID() {
      var d = +new Date();
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          return (c == 'X' ? r : (r & 0x3 | 0x8)).toString(16);

        });
    }

    // カテゴリーを書き換える
    function changeCategory(){
      var category = document.getElementById("category").value;
      switch (category){
            case '1':
              category = "おもちゃ・ゲーム";
              break;
            case '2':
              category = "アニメ";
              break;
            case '3':
              category = "本・テキスト";
              break;
            case '4':
              category = "音楽・ＤＶＤ";
              break;
            case '5':
              category = "服・コスメ";
              break;
            case '6':
              category = "キッチン";
              break;
            case '7':
              category = "スポーツ";
              break;
            case '8':
              category = "PC・スマホ用品";
              break;
            case '100':
              category = "その他";
              break;
            default:
              break;
          }
      return category;
    }

    // 商品状態を書き換える
    function changeItemStatus(){
      var item_status = document.getElementById("item_status").value;
      switch (item_status){
            case '1':
              item_status = "新品";
              break;
            case '2':
              item_status = "ほぼ新品";
              break;
            case '3':
              item_status = "多少の傷あり";
              break;
            case '4':
              item_status = "傷・汚れあり";
              break;
            case '5':
              item_status = "状態が悪い";
              break;
            default:
              break;
          }
      return item_status;
    }

    // 受け渡し時間帯を書き換える
    function changeDtime(){
      var delivery_time = document.getElementById("delivery_time").value;
      switch (delivery_time){
            case '1':
              delivery_time = "１コマ目終了後";
              break;
            case '2':
              delivery_time = "昼休み";
              break;
            case '3':
              delivery_time = "３コマ目終了後";
              break;
            case '4':
              delivery_time = "４コマ目終了後";
              break;
            default:
              break;
          }
      return delivery_time;
    }

    // 受け渡し場所を書き換える
    function changeLocation(){
      var location = document.getElementById("location").value;
      switch (location){
            case '1':
              location = "本校舎3Fホール";
              break;
            case '2':
              location = "本校舎4Fホール";
              break;
            case '3':
              location = "本校舎5F";
              break;
            case '4':
              location = "本校舎6Fホール";
              break;
            case '5':
              location = "本校舎7F";
              break;
            case '6':
              location = "本校舎8F";
              break;
            case '7':
              location = "2号館入口";
              break;
            case '8':
              location = "3号館入口";
              break;
            case '9':
              location = "3号館ホール";
              break;
            case '100':
              location = "その他";
              break;
            default:
              break;
          }
      return location;
    }


    // ここから譲渡関連機能
    function give_newDeal(){ 
      // 画像ファイル生成
      var imageData = document.getElementById("previewImage");
      var src = previewImage.getAttribute('src');
      var item_image = imgUpload(src);// 先行して画像をアップロード。画像の名前を返す

      var category = document.getElementById("category").value;
      var delivery_end_date = document.getElementById("delivery_end_date").value;
      var delivery_start_date = document.getElementById("delivery_start_date").value;
      var delivery_time = document.getElementById("delivery_time").value;

      var item_info = document.getElementById("item_info").value;
      var item_name = document.getElementById("item_name").value;
      var item_status = document.getElementById("item_status").value;
      var location = document.getElementById("location").value;

      //give_user_idの取得
      var give_user_id = getCurrentUserId();


      // 
      var Give = ncmb.DataStore("give");
      // クラスインスタンスの生成
      var give = new Give();
      // データを設定して保存する
      give.set("category", category)
        .set("deal_status", "成立待ち")
        .set("delivery_end_date", delivery_end_date)
        .set("delivery_start_date", delivery_start_date)
        .set("delivery_time", delivery_time)
        .set("give_user_id", give_user_id)
        .set("item_image", item_image)
        .set("item_info", item_info)
        .set("item_name", item_name)
        .set("item_status", item_status)
        .set("location", location)
        .save();
        localStorage.setItem("flag","give");
        localStorage.setItem("item_image",item_image);
        transition();
      }

      //入力チェック
      function createNewGiveCheck(){
          console.log("チェックイン");
          var item_name = document.getElementById("item_name").value;
          var item_info = document.getElementById("item_info").value;
          var delivery_start_date = document.getElementById("delivery_start_date").value;
          var delivery_end_date = document.getElementById("delivery_end_date").value;

          var returnNameFlag = false;
          var returnInfoFlag = false;
          var returnDateFlag = false;

          //商品名チェック
          if(item_name === ""){
              document.getElementById('errMessageName').innerHTML = "商品名は必須入力です";
              returnNameFlag = true;
          } else {
              document.getElementById('errMessageName').innerHTML = "";
              returnNameFlag = false;
          }
          //商品説明チェック
          if(item_info === ""){
              document.getElementById('errMessageInfo').innerHTML = "商品説明は必須入力です";
              returnInfoFlag = true;
          } else {
              document.getElementById('errMessageInfo').innerHTML = "";
              returnInfoFlag = false;
          }


          //受け渡し期間チェック
          if((delivery_start_date === "") || (delivery_end_date === "")){
              document.getElementById('errMessageDate').innerHTML = "受け渡し期間は必須入力です";
              returnDateFlag = true;
          } else {
              document.getElementById('errMessageDate').innerHTML = "";
              returnDateFlag = false;
          }

          if(!returnNameFlag && !returnInfoFlag && !returnDateFlag){
              give_modal_open();

          }

      }
      // モーダル表示用スクリプト
      function give_modal_open(){
        const open = document.getElementById('d_open');
        const ok = document.getElementById('d_ok');
        const close = document.getElementById('d_cancel');
        const modal = document.getElementById('d_modal');
        const mask = document.getElementById('mask');
        
        open.addEventListener('click',()=>{
          // 値を置き換える関数を呼ぶ
          var category = changeCategory();
          var item_status = changeItemStatus();
          var delivery_time = changeDtime();
          var location = changeLocation();
          
          // モーダルの値を書き換える
          document.getElementById('m_item_name').innerHTML = document.getElementById("item_name").value;
          document.getElementById('m_category').innerHTML = category;
          document.getElementById('m_item_status').innerHTML = item_status;
          document.getElementById('m_item_info').innerHTML = document.getElementById("item_info").value.replace(/\n/g, '<br>');
          document.getElementById('m_delivery_date').innerHTML = document.getElementById("delivery_start_date").value + "<br><span class='wave'>～</span><br>" + document.getElementById("delivery_end_date").value;
          document.getElementById('m_delivery_time').innerHTML = delivery_time;
          document.getElementById('m_location').innerHTML = location;
          // 表示
          modal.classList.remove('hidden');
          mask.classList.remove('hidden');
        });
        
        close.addEventListener('click',()=>{
          modal.classList.add('hidden');
          mask.classList.add('hidden');
        });
        
        mask.addEventListener('click',()=>{
          close.click();
        });
      }


      // ここから交換関連機能
      function trade_newDeal(){ 
      // 画像ファイル生成
      var imageData = document.getElementById("previewImage");
      var src = previewImage.getAttribute('src');
      var item_image = imgUpload(src);// 先行して画像をアップロード。画像の名前を返す

      var category = document.getElementById("category").value;
      var delivery_end_date = document.getElementById("delivery_end_date").value;
      var delivery_start_date = document.getElementById("delivery_start_date").value;
      var delivery_time = document.getElementById("delivery_time").value;
      var item_info = document.getElementById("item_info").value;
      var swap_item_info = document.getElementById("swap_item_info").value;
      var item_name = document.getElementById("item_name").value;
      var item_status = document.getElementById("item_status").value;
      var location = document.getElementById("location").value;

      //trade_user_idの取得
      var trade_user_id = getCurrentUserId();

      // 
      var Trade = ncmb.DataStore("trade");
      // クラスインスタンスの生成
      var trade = new Trade();
      // データを設定して保存する
      trade.set("category", category)
        .set("deal_status", "成立待ち")
        .set("delivery_end_date", delivery_end_date)
        .set("delivery_start_date", delivery_start_date)
        .set("delivery_time", delivery_time)
        .set("item_image", item_image)
        .set("item_info", item_info)
        .set("swap_item_info", swap_item_info)
        .set("trade_user_id", trade_user_id)
        .set("item_name", item_name)
        .set("item_status", item_status)
        .set("location", location)
        .save();
        localStorage.setItem("flag","trade");
        localStorage.setItem("item_image",item_image);
        transition();
      }

      //入力チェック
      function createNewTradeCheck(){
          console.log("チェックイン");
          var item_name = document.getElementById("item_name").value;
          var item_info = document.getElementById("item_info").value;
          var delivery_start_date = document.getElementById("delivery_start_date").value;
          var delivery_end_date = document.getElementById("delivery_end_date").value;
          var swap_info = document.getElementById("swap_item_info").value;

          var returnNameFlag = false;
          var returnInfoFlag = false;
          var returnDateFlag = false;
          var returnSwapFlag = false;

          //商品名チェック
          if(item_name === ""){
              document.getElementById('errMessageName').innerHTML = "商品名は必須入力です";
              returnNameFlag = true;
          } else {
              document.getElementById('errMessageName').innerHTML = "";
              returnNameFlag = false;
          }
          //商品説明チェック
          if(item_info === ""){
              document.getElementById('errMessageInfo').innerHTML = "商品説明は必須入力です";
              returnInfoFlag = true;
          } else {
              document.getElementById('errMessageInfo').innerHTML = "";
              returnInfoFlag = false;
          }


          //受け渡し期間チェック
          if((delivery_start_date === "") || (delivery_end_date === "")){
              document.getElementById('errMessageDate').innerHTML = "受け渡し期間は必須入力です";
              returnDateFlag = true;
          } else {
              document.getElementById('errMessageDate').innerHTML = "";
              returnDateFlag = false;
          }

          //交換希望品チェック
          if(swap_info === ""){
              document.getElementById('errMessageSwapInfo').innerHTML = "交換希望品は必須入力です";
              returnSwapFlag = true;
          } else {
              document.getElementById('errMessageSwapInfo').innerHTML = "";
              returnSwapFlag = false;
          }

          if(!returnNameFlag && !returnInfoFlag && !returnDateFlag &&!returnSwapFlag){
              trade_modal_open();
          }

      }

      // モーダル表示用スクリプト
      function trade_modal_open(){
        const open = document.getElementById('d_open');
        const ok = document.getElementById('d_ok');
        const close = document.getElementById('d_cancel');
        const modal = document.getElementById('d_modal');
        const mask = document.getElementById('mask');
        
        open.addEventListener('click',()=>{
          // 値を置き換える関数を呼ぶ
          var category = changeCategory();
          var item_status = changeItemStatus();
          var delivery_time = changeDtime();
          var location = changeLocation();
          
          // モーダルの値を書き換える
          document.getElementById('m_item_name').innerHTML = document.getElementById("item_name").value;
          document.getElementById('m_category').innerHTML = category;
          document.getElementById('m_item_status').innerHTML = item_status;
          document.getElementById('m_item_info').innerHTML = document.getElementById("item_info").value.replace(/\n/g, '<br>');
          document.getElementById('m_swap_item_info').innerHTML = document.getElementById("swap_item_info").value.replace(/\n/g, '<br>');
          document.getElementById('m_delivery_date').innerHTML = document.getElementById("delivery_start_date").value + "<br><span class='wave'>～</span><br>" + document.getElementById("delivery_end_date").value;
          document.getElementById('m_delivery_time').innerHTML = delivery_time;
          document.getElementById('m_location').innerHTML = location;
          // 表示
          modal.classList.remove('hidden');
          mask.classList.remove('hidden');
        });
        
        close.addEventListener('click',()=>{
          modal.classList.add('hidden');
          mask.classList.add('hidden');
        });
        
        mask.addEventListener('click',()=>{
          close.click();
        });
      }

      //カレントユーザーのID取得
      function getCurrentUserId() {
      // カレントユーザー情報の取得
      var currentUser = ncmb.User.getCurrentUser();
      console.log("currentUser:" + currentUser);
      if (currentUser != null) {
        console.log("ログイン中のユーザー: " + currentUser.get("userName"));
        return currentUser.get("objectId");
      } else {
        console.log("未ログインまたは取得に失敗");
        return null;
      }

    }

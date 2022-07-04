剛剛那個 top_navbar的改版:
  每個page 的 top_navbar 都是複製 index.html裡的 top_navbar
  so 若要更改 top_navbar 就可以從 index.html 的 top_navbar 其他就可以都更改
目前bug=> home 頁時 home 的 nav_icon 沒有 active class;
  解決辦法=>js 讀取網址 +> 相關 nav_icon add class "active"

test 見裡基底分之

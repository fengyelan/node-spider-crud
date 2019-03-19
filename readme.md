##### 网络爬虫

* 爬取的是https://pixabay.com/zh/photos这个网站的图片

* 爬取到图片之后，在本地的pics的文件夹保存了一份爬取到的相关图片，并且把图片的相关信息保存在数据库里面

* 存储图片的文件夹：/pics/东方明珠1521084196584  ，文件夹命名方式是图片关键词+时间戳 

##### 启动命令

* nodemon app.js 
 
  ps :默认是是爬取的华山的图片相关信息

* nodemon app.js 爬取图片的名称  

  ps: 例如 nodemon app.js 故宫








##### nodejs对数据库mongodb的CRUD操作
* 数据库图片的信息在表格中展示出来，可以进行删除，编辑，以及根据关键字进行查找

服务器

启动命令 nodemon server.js

技术：express

数据库：mongodb

前端

启动命令 cd fe && npm run dev

技术：element + vue + axios





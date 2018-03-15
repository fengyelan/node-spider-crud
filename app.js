var superagent = require('superagent'),
    cheerio = require('cheerio'),
    fs = require('fs-extra'),
    url = require('url'),
    path = require('path');


//连接数据库
var mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1/test");



var Schema = mongoose.Schema;

//声明Schema
var pictureSchema = new Schema({
    index:Number,
    title: String,
    lables:String,
    picUrl: String
}, {
    versionKey: false
});

// //创建模型
var pictureModel = mongoose.model('Picture', pictureSchema);


//下面是一个图片网站，搜索某个特定的XX
var q = process.argv[2] || '华山';
var picUrl = "https://pixabay.com/zh/photos/?q=" + encodeURIComponent(q);

var dir = path.join(__dirname+'/pics', '/' + q + new Date().getTime());
fs.mkdir(dir);

superagent.get(picUrl)
    .end(function(err, res) {
        if (err) {
            return console.log(err);
        }

        var $ = cheerio.load(res.text);

        $(".item").each(function(id, el) {
            var $el = $(el),
                $img = $el.find("a img"),
                pic_url = $img.attr("data-lazy") || $img.attr("src"),
                lables = $img.attr("title"),
                title = q,
                index = id;

            console.log(id);
            //保存到数据库
            saveDB(index,title, lables,pic_url);


            var filename = pic_url.split('/').pop();

            //下载到本地文件夹
            download(dir, filename, pic_url);


        });
    });

/*
 *@desc 保存图片链接和名称到数据库
 *
 */
var i=0;
function saveDB(index,title, lables,pic_url) {
    //创建实体
    var pictureEntity = new pictureModel({
        index:index,
        title: title,
        lables:lables,
        picUrl: pic_url
    });

    //存入数据库
    pictureEntity.save(function(err) {
        if (err) {
            return console.log(err);
        } else {
            i++;
            console.log("success"+i);
        }

    });
}





/*
 *@desc 下载文件到本地文件夹
 *@param dir:需要放在本地的文件夹名称
 *@param filename:图片名字
 *@param url:图片链接
 */
function download(dir, filename, url) {
    superagent.get(url)
        .pipe(fs.createWriteStream(path.join(dir, filename)));
}
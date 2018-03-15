/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-03-13 17:49:48
 * @version $Id$
 */

var express = require('express');
var app = express();

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

function setHeader(res){
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type","text/html;charset=UTF-8" );
}

//获取总的记录条数
app.get("/count",function(req,res){
    setHeader(res);
    var search = req.query.search;
    var find_s = search ? {title:search} : {};
    pictureModel.find(find_s).count().exec(function(err,result){
        res.json({
            code:0,
            data:result
        });
    })
})

//查询数据
app.get('/find', function(req, res) {
    var limit = parseInt(req.query.limit) || 5;
    var start = parseInt(req.query.start) || 0;
    var search = req.query.search;

    setHeader(res);

    var find_s = search ? {title:search} : {};
    pictureModel.find(find_s).limit(limit).skip(start).exec(function(err,result){
        if (err) return console.log(err);
        res.json({
            code:0,
            data:result
        });
    });
});

//更新数据
app.get("/update",function(req,res){
    setHeader(res);
    var param = req.query.param;
    param = decodeURIComponent(param);
    param = JSON.parse(param);
    
    var title = param.title.now,
        lables = param.lables.now,
        picUrl = param.picUrl.now;
    console.log(title,lables,picUrl);
	pictureModel.update({title:param.title.pre,lables:param.lables.pre,picUrl:param.picUrl.pre},{$set:{title:title,lables:lables,picUrl:picUrl}},function(err,result){
		if(err) return console.log(err);
		console.log("update:"+JSON.stringify(result)); //update:{"n":1,"nModified":0,"ok":1}
        res.json({
            code:0,
            msg:"ok"
        })
	});
})

//delete数据
app.get("/del",function(req,res){
    setHeader(res);
	var index = parseInt(req.query.i);

	if(!index&&index!=0){
		return console.log("请在参数上添加需要删除的index")
	}

	pictureModel.remove({index:index},function(err,result){
		if(err) return console.log(err);
		console.log("remove:"+JSON.stringify(result));//remove:{"n":1,"ok":1}
        res.json({
            code:0,
            msg:"ok"
        })
	})

});


app.listen(3000, () => {
  console.log(`server running 3000`)
})
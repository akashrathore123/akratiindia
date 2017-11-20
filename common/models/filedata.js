var mkdirp = require('mkdirp');
var util = require('../util/util');
var CONTAINERS_URL = '/api/containers/';
module.exports = function(Filedata) {

    Filedata.upload = function (ctx,options,cb) {

        if(!options) options = {};
        ctx.req.params.container = ctx.req.header('container');

        // Filedata.app.models.Container.createContainer("../assets/images/"+ctx.req.header('container'),function(err,container){
        //
        //   if(err){
        //     cb(err);
        //   }
        // })
        mkdirp('./client/assets/images/'+ctx.req.header('container'), function (err) {
       console.log(err);
   });
        Filedata.app.models.Container.upload(ctx.req,ctx.result,options,function (err,fileObj) {
            if(err) {
              cb(util.getGenericError("Error",500,"Error occured while upload"+err));
              return;
            } else {
                var fileInfo = fileObj.files.file[0];
                console.log(fileInfo);
                Filedata.create({
                    name: fileInfo.name,
                    type: fileInfo.type,
                    container: fileInfo.container,
                    url: 'assets/images/Products/'+ctx.req.header('container')+'/'+fileInfo.name
                },function (err,obj) {
                    if (err !== null) {
                      cb(util.getGenericError("Error",500,"Unable to add file info"+err));
                      return;
                    } else {
                        cb(null, obj);
                    }
                });
            }
            if(ctx.req.header('container') == "ProductSheets"){

              ctx.fileName = fileInfo.name;
              Filedata.app.models.Product.uploadSheet(ctx,function(err,instance){
                if(err){
                  cb(util.getGenericError("Error",500,"Internal Server Error"));
                }
              })
            }
        });

    };

    Filedata.remoteMethod(
        'upload',
        {
            description: 'Uploads a file',
            accepts: [
                { arg: 'ctx', type: 'object', http: { source:'context' } },
                { arg: 'options', type: 'object', http:{ source: 'query'} }
            ],
            returns: {
                arg: 'fileObject', type: 'object', root: true
            },
            http: {verb: 'post'}
        }
    );

};

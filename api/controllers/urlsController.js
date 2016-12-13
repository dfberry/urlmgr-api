
/**
 * urlsController
 *
 * @description :: Server-side logic for managing urls
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let UrlMgr= require('../../shared/url.js');

module.exports = {

  /**
   * `urlsController.index()`
   */
  index: function (req, res) {
    console.log('urlsController.index');
    urls.find().exec(function (err, items) {

    console.log(items);

      return res.json(items);
    });
  },
  /**
   * `urlsController.create()`
   */
  create: function (req, res) {
    console.log('sails urlsController.create');

    let url = req.body.url; 

    //console.log("sails create url = " + url);
    if(!url) return res.json({failure: 'empty url'});

    let isValid = sails.validurl.isUri(url);
    console.log("sails create url isValid = " + isValid);
    if(!isValid) return res.json({failure: 'url is not valid'});   

    let urlMgr = new UrlMgr();

    urlMgr.get(url, obj => {

      console.log("insert object ");
      console.log(obj);

        urls.create(obj).exec(function createCB(err,created){ 
          if (err){
            return res.negotiate(err);
          } else {
            return res.ok(created); 
          }
        });
    });
  },
  /**
   * `urlsController.show()`
   */
  show: function (req, res) {
    return res.json({
      todo: 'show() is not implemented yet!'
    });

  },


  /**
   * `urlsController.edit()`
   */
  edit: function (req, res) {
    return res.json({
      todo: 'edit() is not implemented yet!'
    });
  },


  /**
   * `urlsController.delete()`
   */
  delete: function (req, res) {

    console.log('delete requested');

    let id = req.body.id; 
    console.log("id " + id);

    let purge = req.body.purge;
    if (purge && (id == -1 || id == '-1')){
      urls.destroy({}).exec(function (err){
        console.log("purge exec returned");
        if (err) {
          return res.negotiate(err);
        }
        //sails.log('Deleted url with `id: ${id}`, if it existed.');
        return res.ok();
      });
    } else if (id) {
      urls.destroy({
        id: id
      }).exec(function (err){
        console.log("exec returned");
        if (err) {
          return res.negotiate(err);
        }
        //sails.log('Deleted url with `id: ${id}`, if it existed.');
        return res.ok();
      });
    } else {
        sails.log('delete requested without valid params');
        return res.negotiate("delete requested without valid params");
    }

  }
};


"use strict";

let rp = require('request-promise'),
    url = require('url'),
    cheerio = require('cheerio');

let Html = {

  mimeTypes: function(){
    return [
        'application/rss+xml',
        'application/xml',
        'application/rdf+xml',
        'application/atom+xml',
    ].sort();
  },
  getHtml: function(url) {
      return new Promise(function(resolve, reject) {
        if(!url) reject("url not provided");

        rp.get(url).then(resolve).catch(reject);
    });
  },
  getLinks: function(html){
      let list = [];
      let $ = cheerio.load(html);
      $('link').each( function () {
          let type = $(this).attr("type");
          let href = $(this).attr("href");
          if (type){
              type = type.replace('\\"','');
              type = type.replace('\\"','');

              if (href){
                  href = href.replace('\\"','');
                  href = href.replace('\\"','');
              }
              list.push({type: type, href: href});
          }         
      });
      return list.sort();
  },
  getTitle: function(html){
      let $ = cheerio.load(html);
      return $("title").text();
  },
  getFeeds: function(html){   

    if (!html) return ret;
    let ret = [];

    let links = this.getLinks(html);
    if (links.length === 0) return ret;

    for(let i = 0; i < links.length; i += 1) {
        if(this.mimeTypes().indexOf(links[i].type) > -1){
            let urlReturned = url.parse(links[i].href);

            // exclude relative links
            if(urlReturned.hostname) ret.push( urlReturned );
        }
    }
    return (ret); 
  }
}

module.exports = Html;
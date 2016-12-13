"use strict";
const liteUrl = require('lite-url');
const request = require('request');
const jsonStringifyPlus = require('json-stringify-plus');
const http = require('http'); 
//const Urls = require('./url');
const getFeeds = require('get-feeds');

module.exports = class UrlMgr{

    constructor(){
        this.urlObj = {
            url: null,
            feeds: [],
            title: null,
            html: null
        }
    }

    get(url, cb) {

        if(!url) return cb();

        this.urlObj.url = url;

        this.getHtml(url, (res) => {

            // need html to find feeds
            if (!res || res.status!=200 || !res.text) return cb(this.urlObj);

            this.urlObj.html = res;
 
            this.getFeed(url, res.text, (feeds) => {

                // doesn't matter if feeds are found/empty
                this.urlObj.feeds = feeds;

                this.getTitle(url, res.text, feeds, (title) => {

                    this.urlObj.title = title;

                    delete this.urlObj.html.text;
                    return cb(this.urlObj);
                });
            });
        });
    }   
    getFeed(url, html, cb){
        if(!html || !url ) return cb(null);

        let urlParts = new liteUrl(url);
        let feeds = getFeeds(html,{url: urlParts.protocol + "\//" + urlParts.hostname});
 
        return cb(JSON.parse(jsonStringifyPlus(feeds)));   
    }
    /***
     * order of search
     * 
     * 1) feeds[0].title
     * 2) html <title>
     * 3) url
     */
    getTitle(url, html, feeds, cb){
        if(!url && !html && !feeds) return cb('');

       if (feeds && Array.isArray(feeds) && feeds.length>0 && feeds[0].hasOwnProperty('title')) {
            return cb(feeds[0].title);
        } else {
            if(html) {
                let arrMatches = html.match(/<title>(.*?)<\/title>/);
                if(arrMatches && arrMatches.length>1 && arrMatches[1]){
                    return cb(arrMatches[1]);
                } else {
                    return cb(url);
                }
            } else {
                return cb(url);
            }
        }
    }
    getHtml(url, cb){

        if (!url) return cb();

        request.get(url, (error, res, body ) => {

            if(error)cb(err);

            let rawData = body;

            if(res.headers['content-type']=='application/json')
                rawData = JSON.parse(body);

            let obj = JSON.parse(jsonStringifyPlus({
                status: res.statusCode,
                statusMessage: res.statusMessage,
                headers: res.headers,
                text: rawData
            }));
            return cb(obj);
            
        });
    }
}
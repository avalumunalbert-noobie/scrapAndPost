const cheerio=require("cheerio");
const axios=require("axios");
const fs= require("fs");
const request=require("request");


// bellow are the scrape and post functions exported 
const postXclusiveNewsJs=require("./postXclusiveNews");
const webHostingjs=require("./webHosting");
const postEntertainmentJs=require("./postEntertainment");
const postAfricanDiasporaJs=require("./postAfricanDiaspora");
const postLongNewsJs=require("./postLongNews");

postXclusiveNewsJs.scrapeAndPost(cheerio, axios,fs ,request);
webHostingjs.scrapeAndPost(cheerio, axios,fs ,request);
postEntertainmentJs.scrapeAndPost(cheerio, axios,fs ,request);
postAfricanDiasporaJs.scrapeAndPost(cheerio, axios,fs ,request);
postLongNewsJs.scrapeAndPost(cheerio, axios,fs ,request);

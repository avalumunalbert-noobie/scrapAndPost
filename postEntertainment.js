const cheerio = require("cheerio");
const axios = require("axios");
const fs=require("fs");
const request=require("request");


function scrapeAndPost(cheerio, axios,fs,request){

async function scrapeHomeWebsite(url, elementClass, attribute) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const elements = $(`.${elementClass}`);
        const links = [];
        elements.each(function(index, element) {
            const attributeValue = $(element).attr(attribute);
            links.push(attributeValue);
        });
        return links;
    } catch (error) {
        throw error;
    }
};
//the function that scrapes the web page content of an individual link from the links

async function scrapeWebsite(url1,classimg, classtitle, classcontent){
    try{
        const response=await axios.get(url1);
        const html=response.data;
        const myCheerio=cheerio.load(html); //this stands for $ sign of my cheerio
        const scrapedData=[];

        const title=myCheerio(`${classtitle}`).text();
        const img=myCheerio(`${classimg} img`).attr("src");
        const content=myCheerio(`${classcontent}`).eq(0).text();
        
        

        let result={
            contentTitle:"",
            imgSrc:"",
            newsContent:""
        };
        result.contentTitle=title;
        result.imgSrc=img;
        result.newsContent=content;
        
        scrapedData.push(result);
        
        return scrapedData;
        
    }catch(error){
        console.error(`Error scraping website:${error}`);
    }
};

//the function that iterates the each urls and scrapes it from the scrapeWebsite function
async function scrapeMultipleUrls(classimg,classtitle,classcontent){
    const homeUrl = "https://xclusiveloaded.com/entertainment/";
    const elementClass = "nf-image-link";
    const attribute = "href";
    
    try{
        const urls=await scrapeHomeWebsite(homeUrl, elementClass, attribute);
        const scrapedDataArray=[];
        for(const url of urls){
            const scrapedData=await scrapeWebsite(url,classimg,classtitle,classcontent);
            scrapedDataArray.push(...scrapedData);
            
        };
        const jsonData=JSON.stringify(scrapedDataArray,null, 2);
        
        fs.writeFileSync("scraped-entertainment-news.json", jsonData);
        return scrapedDataArray;
    }catch(error){
console.error( `Error scraping multiple websites:  ${error}`);
    }
    
};
// below is the variables that will work the function that scrapes the contents from each url saved in the urlsFile constant with its timeout



//below is a code that will posts the scraped data to all the facebook pages


const CONFIG_FILE = 'entertainmentPages.json';

// Function to read JSON data from file
function readJsonFile(filename) {
  const data = fs.readFileSync(filename, 'utf8');
  return JSON.parse(data);
}

// Load configurations from JSON file
const configurations = readJsonFile(CONFIG_FILE);

// Function to handle changes to JSON file
function handleJsonChange(eventType, filename) {
  if (filename === NEWS_FILE) {
    console.log(`File ${filename} changed. Reloading data...`);
    const newData = readJsonFile(NEWS_FILE);
    // Do something with the new data
  }
}

// Function to post images for a specific configuration
async function postImages(config) {
    const { name, pageId, accessToken } = config;
  
    // Read the image data for the specific configuration
    const titleId = "h1";
    const imageId = ".img-wrap";
    const contentId = "p";
  
    try {
      const postsData = await scrapeMultipleUrls(imageId, titleId, contentId);
  
      postsData.forEach((postData, index) => {
        setTimeout(() => {
          const options = {
            method: 'POST',
            url: `https://graph.facebook.com/${pageId}/photos`,
            qs: {
              access_token: accessToken,
            },
            formData: {
              source: request(postData.imgSrc),
              caption: '' + postData.contentTitle + '\n',
            },
          };
  
          request(options, (error, response, body) => {
            if (error) throw new Error(error);
            console.log(body);
          });
        }, index * 50 * 60 * 1000); // Delay the post by index * 50 minutes
      });
    } catch (error) {
      console.error('Error posting images:', error);
    }
  }
// Load initial data and post images for each configuration
configurations.forEach((config) => {
  postImages(config);
});

};

module.exports={
  scrapeAndPost
};
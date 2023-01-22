const RSS_URLS = [
  "https://cors-anywhere.herokuapp.com/https://www.economist.com/finance-and-economics/rss.xml",
  "https://cors-anywhere.herokuapp.com/https://www.cnbc.com/id/100727362/device/rss/rss.html",
  "https://cors-anywhere.herokuapp.com/https://www.marketwatch.com/rss/marketpulse",
  "https://cors-anywhere.herokuapp.com/https://www.forbes.com/business/feed/",
  "https://cors-anywhere.herokuapp.com/https://www.ft.com/rss/home/us",
  "https://cors-anywhere.herokuapp.com/https://www.businessinsider.com/rss",
  "https://cors-anywhere.herokuapp.com/http://rss.cnn.com/rss/money_news_international.rss",
  "https://cors-anywhere.herokuapp.com/https://www.newyorktimes.com/services/xml/rss/nyt/Business.xml",
  "https://cors-anywhere.herokuapp.com/https://rssfeeds.usatoday.com/UsatodaycomBusiness-TopStories",
  "https://cors-anywhere.herokuapp.com/https://www.investors.com/feed/",
  "https://cors-anywhere.herokuapp.com/https://www.entrepreneur.com/rss/topic/business",
  "https://cors-anywhere.herokuapp.com/https://www.venturebeat.com/category/business/feed/",
  "https://cors-anywhere.herokuapp.com/https://techcrunch.com/startups/feed/",
  "https://cors-anywhere.herokuapp.com/https://thenextweb.com/feed/", 
  "https://cors-anywhere.herokuapp.com/https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml",
  "https://cors-anywhere.herokuapp.com/https://www.finance.yahoo.com/news/rss/"
];

const fetchFeed = async (url) => {
  const response = await fetch(url);
  const text = await response.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, 'application/xml');
  return xml;
};

const displayTitles = async () => {
  const titles = new Set();
  const container = document.getElementById('rss-feed-container');
  for (const url of RSS_URLS) {
    const feed = await fetchFeed(url);
    const item = feed.querySelector('item');
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    if (!titles.has(title)) {
      titles.add(title);
      const titleElement = document.createElement('a');
      titleElement.href = link;
      titleElement.innerHTML = title;
      container.appendChild(titleElement);
      container.appendChild(document.createElement('br'));
    }
  }
};

displayTitles();

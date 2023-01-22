const RSS_URLS = [
  "https://www.economist.com/finance-and-economics/rss.xml",
  "https://www.cnbc.com/id/100727362/device/rss/rss.html",
  "https://www.marketwatch.com/rss/marketpulse",
  "https://www.forbes.com/business/feed/",
  "https://www.ft.com/rss/home/us",
  "https://www.businessinsider.com/rss",
  "http://rss.cnn.com/rss/money_news_international.rss",
  "https://www.newyorktimes.com/services/xml/rss/nyt/Business.xml",
  "https://rssfeeds.usatoday.com/UsatodaycomBusiness-TopStories",
  "https://www.investors.com/feed/",
  "https://www.entrepreneur.com/rss/topic/business",
  "https://www.venturebeat.com/category/business/feed/",
  "https://techcrunch.com/startups/feed/",
  "https://thenextweb.com/feed/", 
  "https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml",
  "https://www.finance.yahoo.com/news/rss/"
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
      document.body.appendChild(titleElement);
      document.body.appendChild(document.createElement('br'));
    }
  }
};

displayTitles();

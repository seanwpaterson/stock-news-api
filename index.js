const PORT = 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const res = require('express/lib/response');
const app = express();

const sites = [
    {
        name: 'Forbes',
        address: 'https://www.forbes.com/investing',
        filter: ''
    },
    {
        name: 'Bloomberg',
        address: '',
        filter: ''
    },
    {
        name: 'WSJ',
        address: 'https://www.wsj.com/news/markets/stocks',
        filter: '.WSJTheme--headline--unZqjb45 a'
    }
]

articles = [];

sites.forEach(site => {
    axios.get(site.address)
        .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);

            $(site.filter, html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');

                articles.push({
                    title,
                    url,
                    source: site.name
                });
            });
        });
});

app.get('/', (req, res) => {
    res.json("Welcome to my Stock News API");
});

app.get('/news', (req, res) => {
    res.json(articles);
});

app.listen(PORT, () => console.log(`server is running on Port: ${PORT}`));
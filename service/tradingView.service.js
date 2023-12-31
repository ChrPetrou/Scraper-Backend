var puppeteer = require("puppeteer");
var _ = require("lodash");
const { Error } = require("mongoose");

/**
 *
 * @param {puppeteer.Browser} browser
 * @param {*} url
 * @param {*} symbol
 * @returns
 */
async function getRates(browser, url, symbol, retry = 0) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto(url);

  await page.waitForSelector(
    ".container-pAUXADuj.containerWithButton-pAUXADuj h1"
  );

  const title = await page.$eval(
    ".container-pAUXADuj.containerWithButton-pAUXADuj h1",
    (el) => {
      return el.innerText;
    }
  );

  await page.waitForSelector(".lastContainer-JWoJqCpY span");

  const rate = await page.$$eval(".lastContainer-JWoJqCpY span", (el) => {
    return el[0].innerText;
  });

  await page.waitForSelector(".block-sjmalUvv button");

  let prog = await page.$$eval(".block-sjmalUvv button", (el) => {
    return Array.from(el).map((x) => x.innerText);
  });

  prog = prog.map((x) => {
    return [
      _.camelCase(x.split("\n")[0].split(" ").reverse().join("")),
      parseFloat(x.split("\n")[1].replace("−", "-").split("%")[0] / 100),
    ];
  });
  prog = Object.fromEntries(prog);

  if (rate.length === 0) {
    if (retry < 2) {
      return getRates(browser, url, symbol, retry + 1);
    } else {
      throw new Error("Rate limit Error");
    }
  }
  return { title, rate: parseFloat(rate), ...prog, symbol };
}

const tradingViewService = {
  getRatesForSymbols: async (symbols) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--window-size=1920,1040"], //open page with this dimensions
      defaultViewport: null,
    });

    const results = await Promise.all(
      symbols.map(async (esymbol, index) => {
        const { rate, symbol, title } = await getRates(
          browser,
          `https://www.tradingview.com/symbols/${esymbol}/?exchange=FX`,
          esymbol
        ).catch((err) => ({})); // return empty object if error occurs
        return { rate, symbol, title };
      })
    );

    //   console.log(results);
    await browser.close();
    return results.filter((a) => !!a.rate);
  },
  getPerformanceForSymbols: async (symbols) => {
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--window-size=1920,1040"], //open page with this dimensions
      defaultViewport: null,
    });

    const [page1, page2, page3] = await Promise.all([
      browser.newPage(),
      browser.newPage(),
      browser.newPage(),
    ]);

    const results = await Promise.all(
      symbols.map(async (symbol, index) => {
        return getRates(
          browser,
          `https://www.tradingview.com/symbols/${symbol}/?exchange=FX`,
          symbol
        ).catch((err) => null);
      })
    );

    await browser.close();
    return results.filter((a) => !!a);
  },
};

module.exports = tradingViewService;

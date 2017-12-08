var express = require('express');
var request = require('request');
var app = express();
var gdax_product_id = 'BTC-USD';
var gdax_url = `https://api.gdax.com/products/${gdax_product_id}/ticker`;
var gdax_call_options = {
  url: gdax_url,
  headers: {
    'User-Agent': '.NET Framework Test Client'
  }
};


app.get('/', (req, user_res) => {

  //get BTC INR value from CoinDelta
  request('https://coindelta.com/api/v1/accounts/pricetickers/', (err, res, body) => {
    if (err) console.log(err);
    let btc_delta_inr = JSON.parse(body)['btc'];

    //get BTC USD value from Gdax
    request(gdax_call_options, (err, res, body) => {
      if (err) console.log(err);
      let btc_gdax_usd = parseFloat(JSON.parse(body)['price']);

      //get Current USD - INR conversion price
      request('https://api.fixer.io/latest?base=USD', (err, res, body) => {
        if (err) console.log(err);
        let usd_inr_rate = JSON.parse(body)["rates"]["INR"];
        let btc_delta_usd = btc_delta_inr / usd_inr_rate;
        let us_in_arb_profit_pct = (((btc_delta_usd - btc_gdax_usd) / btc_delta_usd) * 100.00);
        let currency_vs_arb_profit_pct = (((btc_delta_usd - btc_gdax_usd) / btc_gdax_usd) * 100.00);

        //return BTC values to USD
        user_res.json({
          btc_gdax_usd,
          btc_delta_usd,
          us_in_arb_profit_pct,
          currency_vs_arb_profit_pct
        });
      });
    });
  });
});

app.listen(3000, () => console.log('Listening on port 3000'));
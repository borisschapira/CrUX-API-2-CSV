# Get data from CrUX API

A script to gather the latest CrUX data from different origins

## Usage

1. Clone the repo
2. Install: `npm install`
3. Modify the content of origins.json to list your origins.
4. Use the script to get the data with your CrUX API Key

```
CRUX_KEY=XXXXXXXXXXXXXXXX node crux_to_csv.js
```

## Result

A CSV table 

 **ORIGIN**                | **Percentage of good LCP** | **Percentage of good CLS (%)** | **Percentage of good FID (%)** 
---------------------------|----------------------------|--------------------------------|--------------------------------
 https://contentsquare.com | 64.85%                     | 43.15%                         | 96.77%                         
 https://www.dareboost.com | 81.33%                     | 76.76%                         | 97.32%                         



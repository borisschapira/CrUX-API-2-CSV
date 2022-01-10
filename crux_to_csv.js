const https = require("follow-redirects").https;
const fs = require("fs");

const origins = JSON.parse(fs.readFileSync("./origins.json"));
const noData_origins = [];

const options = {
  method: "POST",
  hostname: "chromeuxreport.googleapis.com",
  path: `/v1/records:queryRecord?key=${process.env.CRUX_KEY}`,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  maxRedirects: 20,
};

function newReq(origin) {
  return https.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      var body = Buffer.concat(chunks);
      if (JSON.parse(body).record) {
        record = JSON.parse(body).record;
        console.log(
          [
            record.key.origin,
            record.metrics.largest_contentful_paint.histogram[0].density.toFixed(
              4
            ),
            (record.key.origin,
            record.metrics.cumulative_layout_shift.histogram[0]
              .density).toFixed(4),
            (record.key.origin,
            record.metrics.first_input_delay.histogram[0].density).toFixed(4),
          ].join("\t")
        );
      } else {
        noData_origins.push(origin);
      }
    });

    res.on("error", function (error) {
      console.error(error);
    });
  });
}

function newPostData(origin) {
  return JSON.stringify({
    metrics: [
      "largest_contentful_paint",
      "cumulative_layout_shift",
      "first_input_delay",
    ],
    origin: `https://${origin}`,
  });
}

if (!process.env.CRUX_KEY) {
  console.log("Usage:\nCRUX_KEY=XXXXXXXX node crux_to_csv.js");
  return;
}

if (!origins || origins.length == 0) {
  console.log("Please define origins in origins.json");
  return;
}

if (origins && origins.length > 0) {
  console.log("ORIGIN\tPercentage of good LCP\tPercentage of good CLS (%)\tPercentage of good FID (%)");
  for (let origin of origins) {
    const req = newReq(origin);
    const postData = newPostData(origin);
    req.write(postData);
    req.end();
  }
}

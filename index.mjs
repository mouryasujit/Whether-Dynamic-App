import http from "http";
import fs from "fs";
import requests from "requests";

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
  temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
  temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);
  temperature = temperature.replace("{%location%}", orgVal.name);
  return temperature;
};
const indexFile = fs.readFileSync("app.html", "utf-8");
const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Mumbai&appid=993d535273da0e26f98fc01394a36d61"
    )
      .on("data", function (chunk) {
        const onjdata = JSON.parse(chunk);
        const newarr = [onjdata];
        // console.log(newarr[0].main.temp - 273.15);
        const realdata = newarr
          .map((val) => replaceVal(indexFile, val))
          .join("");
        res.write(realdata);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  }
});

server.listen(5500, "127.0.0.1");

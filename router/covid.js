const express = require("express");
const fs = require("fs");
const axios = require("axios");
const path = require("path");
const dateFormat = require("dateformat");

const router = express.Router();

const countries = [
  "USA",
  "India",
  "Brazil",
  "Russia",
  "UK",
  "France",
  "Turkey",
  "Italy",
  "Spain",
  "Germany",
  "Colombia",
  "Argentina",
  "Mexico",
  "Poland",
  "Iran",
  "Thailand",
];

router.get("/covid", async (req, res) => {
  const { data } = await axios.get(
    `https://disease.sh/v3/covid-19/historical?lastdays=30`
  );
  const saveJson = JSON.stringify(data);
  fs.writeFile("./data/historical.json", saveJson, (error) => {
    if (error) {
      return res.status(400).send({ message: "UpdateFailed" });
    }
  });
  return res.send({ message: "Update Success" });
});

router.get("/covid/:day", async (req, res) => {
  const covidObjArr = JSON.parse(
    fs.readFileSync("./data/historical.json", "utf8")
  );
  const day = req.params.day;

  const today = new Date(2021, 0, 7);
  const priorDate = new Date(2021, 0, 7).setDate(today.getDate() - day);
  const dateAgo = dateFormat(priorDate, "mm/dd/yy");
  const splitDate = dateAgo.split("/");

  const covidWithDay = covidObjArr
    .map((covid) => {
      const covidObj = { ...covid };
      const country = covidObj.country;
      const province = covidObj.province;
      const dateFormat = `${parseInt(splitDate[0])}/${parseInt(
        splitDate[1]
      )}/${parseInt(splitDate[2])}`;
      const covidTimelineCase =
        covid.timeline.cases[
          `${parseInt(splitDate[0])}/${parseInt(splitDate[1])}/${parseInt(
            splitDate[2]
          )}`
        ];
      return { country, province, covidTimelineCase };
    })
    .filter((covid) => {
      const covidObj = { ...covid };
      const country = covidObj.country;
      const province = covidObj.province;
      if (countries.includes(country) && !province) {
        return covid;
      }
    });

  return res.send({ covidWithDay, date: dateAgo });
});

module.exports = router;

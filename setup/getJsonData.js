import * as XLSX from "xlsx";
import { writeFileSync } from "fs";

const ROOT_URL = "https://www.vendeeglobe.org";
const LEADERSHIP_URL = `${ROOT_URL}/classement`;

function getTimeStamp(xlsxUrl) {
  const t = xlsxUrl.split("_");
  let hour = t.pop().split(".")[0];
  let date = t.pop().split(".")[0];
  date = date.split("");
  date.splice(4, 0, "-");
  date.splice(7, 0, "-");
  date = date.join("");
  hour = hour.split("");
  hour.splice(2, 0, ":");
  hour.splice(5, 0, ":");
  hour = hour.join("");
  return new Date(`${date} ${hour}Z`).getTime();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchIds() {
  const response = await (await fetch(`${LEADERSHIP_URL}`)).text();
  const matching = response.match(
    /x-data="selector\({ options: (.+), defaultOptionId/
  );
  const decoded = matching[1].replaceAll("&quot;", '"');
  return JSON.parse(decoded).map((el) => el.id);
}

async function getData(id) {
  const response = await (await fetch(`${LEADERSHIP_URL}?report=${id}`)).text();
  const match = response.match(
    /(\/sites\/default\/files\/ranking\/vendeeglobe_leaderboard.+)"/
  );
  if (!match?.[0]) return;

  const xlsxUrl = match[1];
  const timeStamp = getTimeStamp(xlsxUrl);

  const workbook = XLSX.read(
    await (await fetch(`${ROOT_URL}/${xlsxUrl}`)).arrayBuffer()
  );
  let data = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]], {
    range: 4,
    header: "A",
  });
  return { timeStamp, data };
}

async function getAndPushForId(id) {
  const resp = await getData(id);
  await sleep(1000);
  console.log(`OK for ${id}`);
  return resp;
}

//////////////////////

const ids = await fetchIds();

const allData = [];

for (const id of ids) {
  const resp = await getAndPushForId(id);
  if (resp) allData.push(resp);
}

writeFileSync("data.json", JSON.stringify(allData));

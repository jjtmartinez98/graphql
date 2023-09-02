import { GeneratePieGraph } from "./auditRatioGraph.js";
import { BuildLineGraphData } from "./progressGraph.js";
import { drawCustomChart } from "./drawCustomChart.js";

const navBar = document.getElementById("nav");
const loginArea = document.getElementById("loginArea");
const passwordBox = document.getElementById("password");
const usernameOrEmail = document.getElementById("usernameOrGmail");
const submitButton = document.getElementById("submitButton");
const logOutButton = document.getElementById("logoutButton");
const app = document.getElementById("app");

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  const credentials = btoa(`${usernameOrEmail.value}:${passwordBox.value}`);
  const response = await fetch("https://01.kood.tech/api/auth/signin", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });
  if (response.ok) {
    console.log("login successful");
    const token = await response.json();
    localStorage.setItem("jwt", token); // Store the JWT in local storage for future API requests
    loadMainPage(token);
  } else {
    console.log("wrong credentials");
    console.log(response.json());
  }
});

logOutButton.addEventListener("click", () => {
  loginArea.style.display = "flex";
  navBar.style.display = "none";
  app.style.display = "none";
  localStorage.removeItem("jwt");
});

async function loadMainPage(token) {
  app.style.display = "flex";
  loginArea.style.display = "none";
  navBar.style.display = "flex";

  const dataArr = await getDataFromGraphql(token);
  BuildLineGraphData(dataArr[0]);
  GeneratePieGraph(dataArr[1], dataArr[2]);

  const transactions = dataArr[3];

  const xpovertime = transactions
    .filter((it) => it.type === "xp")
    .map((t) => {
      const inDate = new Date(t.createdAt);
      const outDate = `${inDate.getUTCFullYear()}-${(inDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${inDate.getUTCDate().toString().padStart(2, "0")}`;
      return {
        date: outDate,
        xp: t.amount,
      };
    });

  const levelovertime = transactions
    .filter((it) => it.type === "level")
    .map((t) => {
      const inDate = new Date(t.createdAt);
      const outDate = `${inDate.getUTCFullYear()}-${(inDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${inDate.getUTCDate().toString().padStart(2, "0")}`;
      return {
        date: outDate,
        xp: t.amount,
      };
    });

  const updownovertime = transactions
    .filter((it) => it.type === "up" || it.type === "down")
    .map((t) => {
      const inDate = new Date(t.createdAt);
      const outDate = `${inDate.getUTCFullYear()}-${(inDate.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}-${inDate.getUTCDate().toString().padStart(2, "0")}`;
      return {
        date: outDate,
        xp: t.amount,
      };
    });

    const amountovertype = transactions
    .map((t) => {
      return {
        date: t.type,
        xp: t.amount,
      };
    });

    drawCustomChart(xpovertime, "chart1");
    drawCustomChart(levelovertime, "chart2");
    drawCustomChart(updownovertime, "chart3");
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const getDataFromGraphql = async (token) => {
  let results = await fetch("https://01.kood.tech/api/graphql-engine/v1/graphql", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `{
            user{
              id
              attrs
              auditRatio
              totalUp
              totalDown
              transactions(order_by: { createdAt: desc }) {
                id
                type
                amount
                createdAt
                path
              }
            }
          }`,
    }),
  });
  let data = await results.json();

  const userObj = data.data.user[0];

  //get data to build welcome message
  const firstName = userObj.attrs.firstName;
  const lastName = userObj.attrs.lastName;
  const phone = userObj.attrs.tel;
  const mail = userObj.attrs.email;

  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.innerHTML = "Hello, " + firstName + " " + lastName + "\n" + phone + "\n" + mail;

  //get data to build audit audit ratio graph
  const auditRatio = userObj.auditRatio;
  let auditUp = userObj.totalUp;
  let auditDown = userObj.totalDown;

  const auditTextBox = document.getElementById("auditTextBox");
  auditTextBox.innerHTML = "your audit ratio is : " + roundUpToDecimal(auditRatio, 1);

  auditUp = Math.ceil(auditUp / 1000) / 1000;
  auditDown = Math.ceil(auditDown / 1000) / 1000;

  let lineData = [
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
  ];

  userObj.transactions.forEach((element) => {
    if (element.type === "xp" && !element.path.includes("piscine")) {
      if (element.createdAt.includes("2023-01")) {
        lineData[0].value += Math.ceil(element.amount / 1000);
      } else if (element.createdAt.includes("2023-02")) {
        lineData[1].value += Math.ceil(element.amount / 1000);
      } else if (element.createdAt.includes("2023-03")) {
        lineData[2].value += Math.ceil(element.amount / 1000);
      } else if (element.createdAt.includes("2023-04")) {
        lineData[3].value += Math.ceil(element.amount / 1000);
      } else if (element.createdAt.includes("2023-05")) {
        lineData[4].value += Math.ceil(element.amount / 1000);
      } else if (element.createdAt.includes("2023-06")) {
        lineData[5].value += Math.ceil(element.amount / 1000);
      } else {
        return;
      }
    }
  });
  let previousMonth = 0;
  for (let i = 0; i < lineData.length; i++) {
    if (lineData[i].value === 0) {
      lineData[i].value = previousMonth;
    } else {
      lineData[i].value += previousMonth;
      previousMonth = lineData[i].value;
    }
  }

  return [lineData, auditUp, auditDown, userObj.transactions];
};

function roundUpToDecimal(number, decimalPlaces) {
  const factor = 10 ** decimalPlaces;
  return Math.ceil(number * factor) / factor;
}


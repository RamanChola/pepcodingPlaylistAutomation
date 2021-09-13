const puppeteer = require("puppeteer");

let page;
(async function fn() {
  try {
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: [
        "--start-fullscreen",
        "--window-size=1920,1040",
        "--disable-notifications",
      ],
    });
    page = await browser.newPage();
    // await page.goto("https://www.youtube.com/playlist?list=PL-Jc9J83PIiFj7YSPl2ulcpwy-mwj1SSk");
    //
    const movieUrl =
      "https://youtube.com/playlist?list=PLu0W_9lII9agS67Uits0UnJyrYiXhDS6q";
    await page.goto(movieUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector("h1[id='title']");
    let titleElement = await page.$("h1[id='title']");
    let title = await page.evaluate(txtElem, titleElement);
    let statElementArr = await page.$$(
      "#stats .style-scope.ytd-playlist-sidebar-primary-info-renderer"
    );
    let videoCount = await page.evaluate(txtElem, statElementArr[0]);
    let viewsCount = await page.evaluate(txtElem, statElementArr[1]);
    console.log("Name of the Playlist : " + title);
    console.log("Total Videos of the playList : " + videoCount);
    console.log("Total Views Till Now : " + viewsCount);


    let videoNameElementList = await page.$$("a[id='video-title']");
    // console.log("videoNameElementList", videoNameElementList.length);
    // last video
    let lastVideo = videoNameElementList[videoNameElementList.length - 1];
    // last video -> view
    await page.evaluate(function (elem) {
      elem.scrollIntoView();
    }, lastVideo);

    let timeList = await page.$$("span[id='text']");
    console.log("Actual Number of videos : " + timeList.length);

    let videosArr = [];
    let timeInSecs = 0;
    //console.log(timeList);
    for (let i = 0; i < timeList.length; i++) {
      let timeNTitleObj = await page.evaluate(
        getTimeAndTitle,
        timeList[i],
        videoNameElementList[i]
      );
      videosArr.push(timeNTitleObj);

      let k = timeNTitleObj.time.includes(":");
      // console.log(k);
      if (k == true) {
        let timePartArr = timeNTitleObj.time.split(":");
        // console.log(timePart[0]+"----"+timePart[1]);
        // console.log(timePartArr.length);
        if (timePartArr.length == 3) {
          timeInSecs +=
            Number(timePartArr[0]) * 3600 +
            Number(timePartArr[1]) * 60 +
            Number(timePartArr[2]);
        } else {
          timeInSecs += Number(timePartArr[0]) * 60 + Number(timePartArr[1]);
        }
      } else {
        timeInSecs += 0;
      }
    }

    // console.log(timeInSecs);
    // let time = 203355;
    // console.table(videosArr);
    console.log("Total length of playlist : ");
    const lengthOfPlaylist = totalLength(timeInSecs);
    console.log(lengthOfPlaylist);
    console.log("------------------------------------");
    console.log("Total length of playlist At 1.25x : ");
    const LengthOfPlaylistAt1_25 = playing1_25(timeInSecs);
    console.log(LengthOfPlaylistAt1_25);
    console.log("------------------------------------");
    console.log("Total length of playlist At 1.5x :");
    const LengthOfPlaylistAt1_5 = playing1_5(timeInSecs);
    console.log(LengthOfPlaylistAt1_5);
    console.log("------------------------------------");
    console.log("Total length of playlist At 1.75x :");
    const LengthOfPlaylistAt1_75 = playing1_75(timeInSecs);
    console.log(LengthOfPlaylistAt1_75);
    console.log("------------------------------------");
    console.log("Total length of playlist At 2x :");
    const LengthOfPlaylistAt2 = playing2(timeInSecs);
    console.log(LengthOfPlaylistAt2);
    console.log("------------------------------------");
    let avgTime = Math.floor(timeInSecs / timeList.length);
    console.log("Average length of video : ");
    const averageLengthOfVideo = totalLength(avgTime);
    console.log(averageLengthOfVideo);
    console.log("------------------------------------");
  } catch (error) {
    console.log(error);
  }
})();

function txtElem(element) {
  return element.textContent.trim();
}

function getTimeAndTitle(element1, element2) {
  return {
    time: element1.textContent.trim(),
    title: element2.textContent.trim(),
  };
}




function totalLength(timeInSecs) {
  let secs = timeInSecs % 60;
  let totalMin = Math.floor(timeInSecs / 60);
  let min = totalMin % 60;
  let tothrs = Math.floor(totalMin / 60);
  let hrs = tothrs % 24;
  let days = Math.floor(tothrs / 24);
  // console.log(secs);
  // console.log(totalMin);
  // console.log(min);
  // console.log(hrs);
  return (
    days + " Days " + hrs + " hours " + min + " minutes " + secs + " seconds"
  );
}

function playing1_25(timeInSecs) {
  let timeIn1_25 = Math.floor(timeInSecs / 1.25);
  return totalLength(timeIn1_25);
}

function playing1_5(timeInSecs) {
  let timeIn1_5 = Math.floor(timeInSecs / 1.5);

  return totalLength(timeIn1_5);
}

function playing1_75(timeInSecs) {
  let timeIn1_75 = Math.floor(timeInSecs / 1.75);

  return totalLength(timeIn1_75);
}

function playing2(timeInSecs) {
  let timeIn2 = Math.floor(timeInSecs / 2);

  return totalLength(timeIn2);
}

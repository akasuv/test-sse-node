const express = require("express");
const fs = require("fs");
const app = express();
const port = 3003;
const cors = require("cors");
app.use(cors());

app.get("/api/sse", (req, res) => {
  let index = 0;

  const data = fs.readFileSync("./test.txt", "utf8");

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const dataArr = data.split(" ");

  // Send initial message to client
  // res.write("data:\n\n");

  // Set interval to send messages to client
  const intervalId = setInterval(() => {
    if (index === dataArr.length) {
      clearInterval(intervalId);
      return;
    }

    res.write(`data: ${dataArr[index++]}\n\n`);
  }, 100);

  // Handle client disconnect
  req.on("close", () => {
    clearInterval(intervalId);
  });
});

app.listen(port, () => {
  console.log(`Server-sent events API running on port ${port}`);
});

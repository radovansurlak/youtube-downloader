const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();

app.use(cors());

app.get('/', (req, res) => {
  res.send('<h1>hello world</h1>');
});

app.get('/test', (req, res) => {
  res.send('<h1>test world</h1>');
});

app.get('/download/:id', (req, res) => {
  const { id } = req.params;

  console.log(`RECEIVED ${id}`);

  const URL = `https://www.youtube.com/watch?v=${id}`;

  const stream = ytdl(URL, {
    filter: 'audioonly',
  });

  stream.on('info', (videoInfo, formatInfo) => {
    res.setHeader(
      'Content-disposition',
      `attachment; filename=${videoInfo.videoDetails.title}.${formatInfo.container}`,
    );
    res.setHeader('Content-type', `${formatInfo.mimeType}`);
  });

  stream.pipe(res);
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

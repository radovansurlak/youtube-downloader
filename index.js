const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');
const https = require('https');
const urlLib = require('url');

const app = express();

const corsOptions = {
  exposedHeaders: 'filename',
  origin: '*',
};

const PORT = process.env.PORT || 4000;

app.use(cors(corsOptions));

app.post('/download/:id', (req, res) => {
  const { id } = req.params;

  const URL = `https://www.youtube.com/watch?v=${id}`;

  const stream = ytdl(URL, {
    filter: 'audioonly',
  });

  stream.on('info', (videoInfo, formatInfo) => {
    const parsed = urlLib.parse(formatInfo.url);

    parsed.method = 'HEAD';
    https
      .request(parsed, (response) => {
        console.log({
          filename: `${videoInfo.videoDetails.title}.${formatInfo.container}`,
          'Content-disposition': `attachment; filename=${videoInfo.videoDetails.title}.${formatInfo.container}`,
          'Content-type': `${formatInfo.mimeType}`,
          'Content-length': response.headers['content-length'],
        });
        res.set({
          filename: `${videoInfo.videoDetails.title}.${formatInfo.container}`,
          'Content-disposition': `attachment; filename=${videoInfo.videoDetails.title}.${formatInfo.container}`,
          'Content-type': `${formatInfo.mimeType}`,
          'Content-length': response.headers['content-length'],
        });
      })
      .end();
  });

  stream.pipe(res);
});

app.listen(PORT, () => {
  console.log(`Server IS ON !!! At port ${PORT}`);
});

const express = require('express');
const ytdl = require('ytdl-core');
const cors = require('cors');

const app = express();

const corsOptions = {
  exposedHeaders: 'filename',
};

app.use(cors(corsOptions));

app.post('/download/:id', (req, res) => {
  const { id } = req.params;

  const URL = `https://www.youtube.com/watch?v=${id}`;

  const stream = ytdl(URL, {
    filter: 'audioonly',
  });

  stream.on('info', (videoInfo, formatInfo) => {
    res.set({
      filename: `${videoInfo.videoDetails.title}.${formatInfo.container}`,
      'Content-disposition': `attachment; filename=${videoInfo.videoDetails.title}.${formatInfo.container}`,
      'Content-type': `${formatInfo.mimeType}`,
    });
  });

  stream.pipe(res);
});

app.listen(4000, () => {
  console.log('Server IS ON !!! At port 4000');
});

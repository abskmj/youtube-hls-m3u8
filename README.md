Many public broadcasts are now available on YouTube as live videos. I was looking for a way to add these to my Android TV as digital channels. As a result, I created this service to get the live feed of a YouTube video as an HLS or M3U streaming link. I then add it as a channel to any IPTV client. If you are interested, [here is a GitHub repository](https://github.com/abskmj/iptv-youtube-live/blob/main/channels.csv) with a list of channels available on YouTube.

Although I have taken great care to keep the service stable, please note that the service is currently hosted on a basic tier of a cloud provider to keep the cost minimal. It might not have sufficient resources to handle numerous requests at a time. If you need a stable service, I would suggest you deploy this service with your cloud provider. An executable of this service is available at [my blog](https://abskmj.github.io/notes/posts/projects/youtube-hls-server/).

# Youtube IPTV Channels
It creates a permanent link for a Youtube live channel or video, which adds it to any IPTV client.

## For a Youtube Channel
It picks up the live feed of a YouTube channel. It works well when a YouTube channel has a single live feed or goes live frequently. It does not work when a channel has multiple live feeds simultaneously. Please use the video link for this case. 

```bash
# format of the link
https://ythls-v3.onrender.com/channel/$youtube_channel_id.m3u8

# example
https://ythls-v3.onrender.com/channel/UCt4t-jeY85JegMlZ-E5UWtA.m3u8
```

## For a Youtube Video
It picks up the live feed of a YouTube video. The video should be live for it to work.

```bash
# format of the link
https://ythls-v3.onrender.com/video/$youtube_video_id.m3u8

# example
https://ythls-v3.onrender.com/video/Nq2wYlWFucg.m3u8
```

# Support
Please include a link to this GitHub repository if you use this service.

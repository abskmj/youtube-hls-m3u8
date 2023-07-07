Many public broadcasts are now available on Youtube as videos. I was looking for a way to add these to my Android TV as digital channels. As a result, I created this service to get the live feed of a Youtube video as an HLS or M3U streaming link and pass it to any IPTV client. If you are interested, [here](https://github.com/abskmj/iptv-youtube-live/blob/main/channels.csv) is a list of channels available on Youtube.

Although I have taken great care to keep the service stable, please note that the service is currently hosted on a basic tier of a cloud provider to keep the cost minimal. It might not have sufficient resources to handle numerous requests at a time. If you need a stable service, I would suggest you deploy this service with your cloud provider. If you need help deploying this service, [email me](mailto:contact-ythls.dragonclaw@erine.email).

# Youtube IPTV Channels
It creates a permanent link for a Youtube live channel or video which adds a channel to any IPTV client.

## For a Youtube Channel
It picks up the most recent live feed when the channel has multiple live feeds.

```bash
# format of the link
https://ythls.onrender.com/channel/$youtube_channel_id.m3u8

# example
https://ythls.onrender.com/channel/UCt4t-jeY85JegMlZ-E5UWtA.m3u8
```

## For a Youtube Video

```bash
# format of the link
https://ythls.onrender.com/video/$youtube_video_id.m3u8

# example
https://ythls.onrender.com/video/Nq2wYlWFucg.m3u8
```

# Support
Please include a link to this GitHub repository if you use this service.

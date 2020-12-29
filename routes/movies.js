const axios = require("axios");
const client = require("../services/redis");

exports.findDataFromOmdbApi = async (req, res) => {
  const cacheMovie = await client.getAsync(req.query.t + req.query.y + "ombd");
  if (!cacheMovie) {
    const movieData = await axios({
      method: "get",
      url: "http://www.omdbapi.com/",
      params: { t: req.query.t, y: req.query.y, apikey: "94667a57" },
    });
    await client.setAsync(
      req.query.t + req.query.y + "ombd",
      JSON.stringify(movieData.data)
    );
    res.send(movieData.data);
  } else {
    res.send(JSON.parse(cacheMovie));
  }
};

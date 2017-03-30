const superagent = require("superagent");
//const yt         = require("ytdl-core");
const ytk        = require("../src/config.json").youtube;

const formats   = ["249", "250", "251", "140", "141", "171"];

module.exports = {

	async search(query) {
		let results = await superagent.get("https://www.googleapis.com/youtube/v3/search").query({
			part       : "snippet",
			maxResults : "3",
			type       : "video",
			q          : query,
			key        : ytk
		}).catch(err => {
			return [];
		})

		return results.body.items;
	},

	async videoInfo(id) {

		let result = await superagent.get("https://www.googleapis.com/youtube/v3/videos").query({
			part       : "snippet",
			id         : id,
			key        : ytk
		}).catch(err => {
			return [];
		})

		return result.body.items;
	},

	async getDuration(id) {

		let req = await superagent.get('https://www.googleapis.com/youtube/v3/videos').query({
			part: 'contentDetails',
			id: id,
			key: ytk
		}).catch(err => {
			return 0;
		});

		if (!req || !req.body || req.body.items.length === 0)
			return 0;

		return module.exports.getSeconds(req.body.items[0].contentDetails.duration);

	},

	getSeconds(duration) {
		let match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
		if(!match) return 0;
		let hours = (parseInt(match[1]) || 0) * 3600;
		let minutes = (parseInt(match[2]) || 0) * 60;
		let seconds = parseInt(match[3]) || 0;

		return hours + minutes + seconds;
	}

}

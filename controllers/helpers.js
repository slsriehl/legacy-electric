

const helpers = {
	timeConvert: (time) => {
		let newTime = parseInt(time);
		if(newTime > 1259) {
			newTime = newTime - 1200;
			newTime = `${newTime}pm`;
		} else {
			newTime = `${newTime}am`;
		}

		let t = Array.from(newTime);
		console.log(t);
		if(t.length == 5) {
			return `${t[0]}:${t[1]}${t[2]} ${t[3]}${t[4]}`;
		} else {
			return `${t[0]}${t[1]}:${t[2]}${t[3]} ${t[4]}${t[5]}`;
		}
	}
}

module.exports = helpers;

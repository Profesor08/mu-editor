const https = require('https');
const fs = require('fs');


(async () => {

	async function load(url) {
		return new Promise(resolve => {
			https.get(url, response => {
				resolve(response);
			});
		});
	}

	async function loadItems(g, id) {
		const all = [];

		all.push(load(`https://mu.playdeon.com/images/items/${g}-${id}.gif`));

		for (let level = 0; level <= 15; level++) {
			all.push(load(`https://mu.playdeon.com/images/items/${g}-${id}-${level}.gif`));
		}

		return await Promise.all(all);
	}


	const g = 15;
	const lv = 15;

	for (let id = 0; id < 512; id++) {

		const lResponses = await loadItems(g, id);

		if (lResponses[0].statusCode === 200) {
			const file = fs.createWriteStream(`${id}.gif`);
			lResponses[0].pipe(file);
		}

		for (let level = 1; level < lResponses.length; level++) {
			if (lResponses[level].statusCode === 200) {
				const file = fs.createWriteStream(`${id}-${level-1}.gif`);
				lResponses[level].pipe(file);
			}
		}

	}


})();
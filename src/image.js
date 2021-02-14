const {createCanvas, loadImage,Image} = require("canvas");
const fs = require("fs");
const Canvas = require('canvas');

/**
 *
 * @param config is an array with 4 entries
 * Each entry is an object with the following properties:
 * distance: from the middle of the image to the middle of the circle at the current layer. The bigger the number, the further is the layer from the center
 * count: circles in the current layer
 * radius: of the circles in this layer
 * users: list of users to render in the format {avatar:string}
 * @returns {Promise<void>}
 */
module.exports = async function render(config) {
    const width = 1493;
    const height = 840;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // fill the background
	fs.readFile(__dirname + '/../bgg.jpg', function(err, data) {
		if (err) throw err;
		let img = new Canvas.Image;
		img.src = data;
		ctx.drawImage(
			img,
			0,
			0,
			width,
			height
		);

	});

    let j = 0;
    // loop over the layers
    for (const [layerIndex, layer] of config.entries()) {

        const {users} = layer;
        let baseX = 70;
        let baseY = 80;

        let row = 0;
        // loop over each circle of the layer
        for (let i = 0; i < users.length; i++) {
        	if (j > 32){
        		continue
			}
            if (j === 11 || j === 22) {
                row = 0;
            }

            if (j <= 10) {
                baseY = 80;
            } else if (j < 22) {
                baseY = 340;
            } else {
                baseY = 610;
            }
            const defaultAvatarUrl =
                "https://abs.twimg.com/sticky/default_profile_images/default_profile_200x200.png";
            const avatarUrl = users[i].avatar || defaultAvatarUrl;
            const img = await loadImage(avatarUrl);

            //president's avatar
            if (layerIndex === 0) {
                ctx.drawImage(
                    img,
                    660,
                    40,
                    150,
                    150
                );
				ctx.font = "18px Arial";
				ctx.strokeText(users[i].screen_name, 660+((33-(users[i].screen_name.length*3))), 230);
				ctx.font = "28px Arial";
				ctx.fillText(users[i].screen_name, 105, 47);
            }else{
                let n = 0;
                if (j > 5 && j <= 10) {
                    n = 164
                }
                if ((j > 16 && j <= 21) || (j > 27)) {
                    n = 45
                }

                if (j === 16 || j === 27) {
                    n = 30
                }

                console.log("writing ",users[i].screen_name);
                ctx.drawImage(
                    img,
                    baseX + n + (row * 118),
                    baseY,
                    110,
                    110
                );

				ctx.font = "16px Arial";
				ctx.fillText(users[i].screen_name, (users[i].screen_name.length > 11?1:11)+baseX + n + (row * 118), baseY+155);
            }
            ctx.restore();

            j++;
            row++;
        }
    }

    // write the resulting canvas to file
    const out = fs.createWriteStream("./dst/" + process.env.USER_ID + ".png");
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    out.on("finish", () => console.log("Done!"));
};

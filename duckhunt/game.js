function draw() {
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');

	var img = new Image();
	img.src = "assets/duckhunt.png";

	ctx.drawImage(img, 0, 400, 900, 500, 0, 0, 800, 600);
	ctx.drawImage(img, 0, 275, 80, 175, 50, 10, 250, 690);
	ctx.drawImage(img, 65, 0, 54, 45, 250, 465, 100, 100);
	ctx.drawImage(img, 35, 155, 40, 40, 250, 350, 75, 75);
	ctx.drawImage(img, 260, 198, 40, 40, 600, 200, 75, 75);
	ctx.drawImage(img, 210, 115, 40, 40, 50, 110, 75, 75);
	ctx.drawImage(img, 0, 115, 40, 40, 500, 100, 75, 75);
	ctx.drawImage(img, 345, 155, 30, 40, 700, 400, 70, 70);
}

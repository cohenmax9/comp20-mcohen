function draw() {
	canvas = document.getElementById('game');
	ctx = canvas.getContext('2d');

	var img = new Image();
	img.src = "assets/duckhunt.png";

	ctx.drawImage(img, 0, 400, 900, 500, 0, 0, 800, 600);
	ctx.drawImage(img, 0, 275, 80, 175, 50, 10, 250, 690);

	
}


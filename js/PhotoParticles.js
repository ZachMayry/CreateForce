/**
 * Copyright (C) 2011 by Paul Lewis
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 * Credit to Paul Truong for the idea that inspired me: 
 * http://www.monocubed.com/2010/10/29/make3d-native-drag-drop-in-browser/
 *
 * And HTML5Doctor for the DnD code tutorial:
 * http://html5doctor.com/native-drag-and-drop/
 */
var AEROTWIST = AEROTWIST || {};
AEROTWIST.PhotoParticles = new function()
{
	var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) isMobile = true;
	// internal vars
	var camera,
		scene,
		renderer,
		mode,
		image,
		canvas,
		context,
		target,
		colors,
		particleSystem,
		particles		= [],
		timeout 		= null,
		mouseMoving 	= false,
		bounceParticles	= false,
		$container 		= $('#container'),
	// constants
		WIDTH			= $container.width(),
		HEIGHT			= $container.height(),
		DENSITY			= 10,
		SIZE			= 10,
		OFFSET			= 10,
		OPACITY			= 0.65,
		NEAR			= 1,
		FAR				= 5000,
		DEPTH			= HEIGHT*1.5,
		MAX_DISTANCE	= 420,
		MIN_DISTANCE	= 80,
		MAX_VELOCITY	= 10,
		RATIO,
		NUMX,
		NUMY;
	
	/**
	 * Initializes the experiment and kicks
	 * everything off. Yay!
	 */
	this.init = function()
	{
		// set up the canvas, camera and scene
		canvas						= document.createElement('canvas');
		canvas.width				= WIDTH;
		canvas.height				= HEIGHT;
		// the canvas is only used to analyse our pic
		context						= canvas.getContext('2d');
		camera 						= new THREE.Camera(45, WIDTH / HEIGHT, NEAR, FAR);
	    scene 						= new THREE.Scene();
	    renderer 					= new THREE.WebGLRenderer();
	    // setup camera
	    camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = DEPTH;
	    // start the renderer
	    renderer.setSize(WIDTH, HEIGHT);
	    $container.append(renderer.domElement);
	    // add listeners
	    addEventListeners();
	    // add target
	    addTarget();
		// create a new image
	    $container.addClass('live');
		var imageData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAACgAAAAWgCAMAAACl3urtAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////////VXz1bAAAAAJ0Uk5T/wDltzBKAAA8Q0lEQVR42uzd0XarOrJAUfj/n76P3bfHTgKoJFWV5nw9iW0kIZaxd851AwBwlMsQAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAEICGAABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACAAhAAAAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAEIAAAAhAAAAEIAAAAhAAAAEIAIAABABA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GwACEPQfAAhAaBuABg0AAQhnBaAxA0AAwlEFaMAAEIBwVAIaLAAEIBzVgMYJAAEIJzWgEQJAAMI5FWhcABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAABoCAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEAEIAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAgAAEABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEAEAAAgAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAtAQAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAgAAEABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEAAAAQgAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAAACEABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAQgAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAACEAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAQgAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAAAIQAAABCAAAAIQAAABCACAAAQAQAACACAAAQAEIAAAAhAAAAEIAIAABABAAAIAIAABABCAAACs9X8CDABgm4VeIL+qtAAAAABJRU5ErkJggg==';
		image 		= document.createElement('img');
		image.src 	= imageData;
		// give the browser chance to
		// create the image object
		setTimeout(function(){
			
			// split the image
			addParticles();
		}, 100);

	    // start rendering, which will
	    // do nothing until the image is dropped
	    update();
	};

	function updateDensityForMobile(image) {
		if ((WIDTH <= 1280 && HEIGHT <= 980) || (HEIGHT <= 1280 && WIDTH <= 980)) {
			DENSITY -= 2;
			// SIZE 	-= 1;
		}
		if ((WIDTH <= 1024 && HEIGHT <= 768) || (HEIGHT <= 1024 && WIDTH <= 768)) {
			DENSITY -= 2;
			SIZE 	-= 1;
		}
		if ((WIDTH <= 640 && HEIGHT <= 360) || (HEIGHT <= 640 && WIDTH <= 360)) {
			DENSITY -= 2;
			// SIZE 	-= 1;
		}
		if ((WIDTH <= 480 && HEIGHT <= 320) || (HEIGHT <= 480 && WIDTH <= 320)) {
			DENSITY -= 2;
			SIZE 	-= 4;
		}
		if (HEIGHT > WIDTH) {
			OFFSET = HEIGHT/4;
		}
		RATIO			= 1 / Math.max(image.width/(WIDTH), image.height/(HEIGHT));
		MAX_DISTANCE 	*= RATIO;
		MIN_DISTANCE 	*= RATIO;
		MAX_VELOCITY 	*= RATIO;
 	}
	
	/**
	 * Sets up the event listeners for window resize
	 */
	function addEventListeners()
	{
		// container DnD event
		var container = $container[0];
		
		// window resize event
		$(window).resize(callbacks.windowResize);
		$('#container').mousemove(callbacks.mousePosition);

	}

	function addTarget()
	{
		var transparentMaterial			= new THREE.MeshLambertMaterial({opacity: 0});
		target 							= new THREE.Mesh( new Sphere( .01, 1, 1 ), transparentMaterial);
		target.position.y 				= -50;
		scene.addChild(target);
	}
	
	/**
	 * Kills off the particles, wipes the
	 * canvas clean and does a bit of gc
	 */
	function removeParticles()
	{
		scene.removeChild(particleSystem);
		particleSystem = null;
		context.clearRect(0,0,3000,3000);
	}
	
	/**
	 * Adds the particles to the scene
	 * based on the image that has been
	 * last uploaded
	 */
	function addParticles()
	{
		updateDensityForMobile(image);

		// draw in the image, and make sure it fits the canvas size :)
		scaledWidth		= image.width * RATIO;
		scaledHeight	= image.height * RATIO;
		context.drawImage(image, 0, 0, scaledWidth, scaledHeight);
		// now set up the particle material
		var material 	= new THREE.ParticleBasicMaterial( { 
									blending: THREE.BillboardBlending, 
									map: ImageUtils.loadTexture("images/particle.png"), 
									size: SIZE, 
									opacity: OPACITY, 
									vertexColors:true, 
									sizeAttenuation:true 
								} );
		var geometry	= new THREE.Geometry();
		var pixels		= context.getImageData(0,0,WIDTH,HEIGHT);
		var step		= DENSITY * 2;
		var x = 0, y = 0;
		// go through the image pixels
		var i = 0;
	    for(x = 0; x < WIDTH * 4; x+= step)
	    {
	    	i++;
	    	var j = 0;
	    	for(y = HEIGHT; y >= 0 ; y -= DENSITY/2)
	    	{
	    		j++;
	    		var p = ((y * WIDTH * 4) + x);
	    		// grab the actual data from the
	    		// pixel, ignoring any transparent ones
	    		if(pixels.data[p+3] > 0)
			    {
			    	var pixelCol	= (pixels.data[p] << 16) + (pixels.data[p+1] << 8) + pixels.data[p+2];
			    	var color 		= new THREE.Color(pixelCol);
			    	var vector 		= new THREE.Vector3(-(WIDTH/2) + x/4, (HEIGHT/2) - OFFSET - y, 0);
			    	// push on the particle
			    	geometry.vertices.push(new THREE.Vertex(vector));
			    	geometry.colors.push(color);
			    }
	    	}
	    }
	    NUMX = i;
	    NUMY = j;
	    // now create a new system
	    particleSystem 	= new THREE.ParticleSystem(geometry, material);
	    particleSystem.sortParticles = true;
	    // grab a couple of cacheable vals
	    particles		= particleSystem.geometry.vertices;
		colors			= particleSystem.geometry.colors;
		// add some additional vars to the
		// particles to ensure we can do physics
		// and so on
		var ps = particles.length;
		while(ps--)
		{
			var particle 		= particles[ps];
			particle.velocity	= new THREE.Vector3();
			particle.origPos	= particle.position.clone();
		}
		// gc and add
		pixels = null;
		scene.addObject(particleSystem);
	}
	
	/**
	 * Updates the velocity and position
	 * of the particles in the view
	 */
	function update()
	{
		var ps = particles.length;	
		while(ps--)
		{
			var particle 		= particles[ps];
			// if we are attracting we add
			// the velocity
			if(mouseMoving) {
				var col				= colors[ps];
				var colArray		= [col.r, col.g, col.b];
				// get the distance of the particle to the centre in question
				// and add on the resultant acceleration
				var origDist 		= particle.position.distanceTo(particle.origPos),
					dist			= particle.position.distanceTo(target.position),
					force,
					acceleration;
					
				
				if (dist < MAX_DISTANCE) {
					force			= (MAX_DISTANCE / dist);
					acceleration	= (new THREE.Vector3())
									.sub(target.position,particle.position)
									.normalize()
									.multiplyScalar(force);
					particle.velocity.subSelf(acceleration);
				} else if (origDist < MIN_DISTANCE) {
					particle.velocity = new THREE.Vector3();
				}
				if (origDist >= 1) {
					force			= (MAX_DISTANCE / (MAX_DISTANCE-origDist));
					acceleration	= (new THREE.Vector3())
									.sub(particle.origPos,particle.position)
									.normalize()
									.multiplyScalar(force);
					particle.velocity.addSelf(acceleration);
				} 
				// move the particles next to it. 
				// if ()
			}
			if (particle.velocity.length() > MAX_VELOCITY) {
				particle.velocity.normalize().multiplyScalar(MAX_VELOCITY);
			}
			if (particle.velocity.length() == 0) {
				particle.position = new THREE.Vector3(particle.origPos.x, particle.origPos.y);
			} else {
				particle.position.addSelf(particle.velocity);
			}
			// particle.position.z = 0;
		}
		// set up a request for a render
		requestAnimationFrame(render);
	}
	
	/**
	 * Renders the current state
	 */
	function render()
	{
		// only render if we have
		// an active image
		if(image) {
			renderer.render( scene, camera );
		}
		// set up the next frame
		update();
	}
	
	/**
	 * Our internal callbacks object - a neat
	 * and tidy way to organise the various
	 * callbacks in operation.
	 * 
	 * Note: this could do with some optimising
	 * because of the repetition.
	 */
	 
	callbacks = {
		mousePosition: function (e) {
			mouseMoving = true;
		    target.position.x = (e.clientX - WIDTH/2) * 1.25;
		    target.position.y = -(e.clientY - HEIGHT/2) * 1.25;
		},
		windowResize: function() {
			WIDTH			= screen.width,
			HEIGHT			= screen.height,
			camera.aspect 	= WIDTH / HEIGHT,
			renderer.setSize(WIDTH, HEIGHT);
			camera.updateProjectionMatrix();
			removeParticles();
			setTimeout(function(){
				
				// split the image
				addParticles();
			}, 200);
		}
	};
};

// Split photos to particles...?
$(document).ready(function(){
	if(Modernizr.webgl) {
		// Go!
		AEROTWIST.PhotoParticles.init();
	}
});



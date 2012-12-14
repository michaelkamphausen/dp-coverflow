# Coverflow

A wordpress plugin that allows you to pick a gallery from the [NextGen Gallery](http://wordpress.org/extend/plugins/nextgen-gallery/) plugin and display it as coverflow. The coverflow is displayed with optional reflection and lighting using photon.js. The lighting can be coupled with the accelerometer to make it change depending on the way you are holding a device that supports the Accelerometer API.

The wordpress plugin php code is based on [JJ NextGen JQuery Carousel](http://wordpress.org/extend/plugins/jj-nextgen-jquery-carousel/).

To use it without the wordpress stuff, just pick the JavaScript and CSS files.
The HTML code looks like this:

	<ul class="dpCoverflow hasReflection">
		<li><a href=""><img src="" alt=""/</a></li>
		<li><a href=""><img src="" alt=""/</a></li>
		<li><a href=""><img src="" alt=""/</a></li>
	</ul>

The project requires modernizr, jQuery, hammer.js, jQuery.hammer.js, rAF.js and photon.js.
Load these resources plus dp-coverflow.js and dp-coverflow.css in your code.

## License

Licensed under the terms of the [MIT License](LICENSE).
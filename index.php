<!doctype html>
<html class="wf-loading">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>ScrollTie | Animate Your Things on Scroll</title>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="viewport" content="width=1280, initial-scale=1">
        <link href="css/style.css" rel="stylesheet">
        <link href='http://fonts.googleapis.com/css?family=Amatic+SC:700' rel='stylesheet' type='text/css'>
        <script type="text/javascript" src="js/modernizr.custom.js"></script>
    </head>
    <body>

    	<section id="mainstage">
    		<header>
				<h1>ScrollTie</h1>
				<h2>a jQuery plugin that ties a CSS property to user scroll</h2>
			</header>
            
	        <div class="block translateY"></div>
	        <div class="block translateX"></div>
	        <div class="block rotate"></div>
	        <div class="block scale"></div>
	        <div class="block background-position"></div>

	    </section>


        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="js/scrollTie.min.js"></script>
        <script>

            $('.translateY').scrollTie({
                property: 'translateY',
                reverseDirection: true,
                speed: 0.4
            });

            $('.translateX').scrollTie({
                property: 'translateX',
                reverseDirection: true,
                speed: 0.1
            });

            $('.rotate').scrollTie({
                property: 'rotate',
                speed: 0.7
            });

            $('.scale').scrollTie({
                property: 'scale',
                speed: 0.1,
                stopAtValue: 3.2,
                afterStop: function(el) {
                	$(el).addClass('finished');
                },
                onStart: function(el) {
                	$(el).removeClass('finished');
                }
            });

            $('.background-position').scrollTie({
                property: 'backgroundPositionX',
                speed: 0.4
            });

        </script>
    </body>
</html>
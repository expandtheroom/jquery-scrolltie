<!doctype html>
<html class="wf-loading">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>ScrollTie | Animate Your Things on Scroll</title>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="viewport" content="width=1280, initial-scale=1">
        <link rel="stylesheet" href="css/style.css">
        <link href='http://fonts.googleapis.com/css?family=Amatic+SC:700' rel='stylesheet' type='text/css'>
        <script type="text/javascript" src="js/modernizr.custom.js"></script>

        <style>
            body {
            	height: 4000px;
                background: url(/img/ground.jpg) 0 -400px no-repeat;
                background-size: auto 150%;
                background-attachment: fixed;
            }
            .block {
                position: fixed;
                bottom: -50px;
                left: 100px;
                width: 100px;
                height: 100px;
                background: #000000;
                transform: translate(0, 30px);
                transition: opacity 0.25s ease-in-out;
            }
            .block.traveling {
                opacity: 0.5;
            }
            .two {
                background: purple;
                left: 320px;
            }
            .three {
                background: salmon;
                left: 530px;
            }
            .four {
                background: silver;
                left: 740px;
            }

        </style>
    </head>
    <body>

    	<div class="ground">
            
	        <div class="block"></div>
	        <div class="block two"></div>
	        <div class="block three"></div>
	        <div class="block four"></div>

	        <div class="clouds"></div>

	    </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="js/src/scrollTie.js"></script>
        <script>

            $('.block').scrollTie({
                property: 'translateY',
                reverseDirection: true,
                speed: 0.3,
                delay: function(el) {
                    return el.offsetLeft * 1.3 - 200;
                },
                onStart: function(el) {
                    $(el).addClass('traveling');
                }
            });

            $('body').scrollTie({
                property: 'backgroundPositionY',
                stopAtValue: 0,
                speed: .05,
            });

        </script>
    </body>
</html>
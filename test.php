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
                height: 4000px
            }
            .block {
                position: fixed;
                top: 100px;
                left: 50%;
                width: 100px;
                height: 100px;
                background: #000000;
                transform: rotate(30deg) translate(45px, -30px);
                transition: opacity 0.25s ease-in-out;
            }
            .block.traveling {
                opacity: 0.5;
            }
            .two {
                background: purple;
                top: 320px;
            }
            .three {
                background: salmon;
                top: 530px;
            }
            .four {
                background: silver;
                top: 740px;
            }

        </style>
    </head>
    <body>
            
        <div class="block"></div>
        <div class="block two"></div>
        <div class="block three"></div>
        <div class="block four"></div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="js/src/scrollTie.js"></script>
        <script>

            $('.block').scrollTie({
                property: 'scale',
                speed: 0.3,
                stopAtValue: 5,
                delay: function(el) {
                    return el.offsetTop - 50;
                },
                onStart: function(el) {
                    $(el).addClass('traveling');
                }
            });

            $('body').scrollTie({
                property: 'backgroundPositionY',
                speed: 1.7,
            });

        </script>
    </body>
</html>
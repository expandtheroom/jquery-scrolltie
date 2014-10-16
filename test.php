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
                background: white;
                height: 3000px
            }
            .block {
                position: fixed;
                top: 20%;
                left: 50%;
                margin-left: -200px;
                width: 100px;
                height: 100px;
                background: #000000;
                transform: rotate(30deg) translate(45px, -30px);
                transition: opacity 0.25s ease-in-out;
            }
            .block.traveling {
                opacity: 0.5;
            }
        </style>
    </head>
    <body>
            
        <div class="block"></div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="js/src/scrollTie.js"></script>
        <script>

            var box = new ScrollTie('.block', {
                property: 'translateX',
                speed: 0.3,
                onStart: function(el) {
                    $(el).addClass('traveling');
                }
            });
        </script>
    </body>
</html>
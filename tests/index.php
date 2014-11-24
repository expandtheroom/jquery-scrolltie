<!doctype html>
<html class="wf-loading">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8">
        <title>ScrollTie | Unit Tests</title>
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="viewport" content="width=1280, initial-scale=1">
        <link rel="stylesheet" href="/css/style.min.css" type="text/css">
        <link rel="stylesheet" href="/node_modules/mocha/mocha.css" type="text/css">
        <link href='http://fonts.googleapis.com/css?family=Amatic+SC:700' rel='stylesheet' type='text/css'>
    </head>
    <body>
        <div id="mocha">
        </div>

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="/js/src/scrollTie.js"></script>
        <script src="/node_modules/chai/chai.js"></script>
        <script src="/node_modules/mocha/mocha.js"></script>
        <script>
            mocha.setup('bdd');
            expect = chai.expect;
            assert = chai.assert;
        </script>
        <script src="scrollTie-tests.js"></script>
        <script>
            mocha.checkLeaks();
            mocha.run();

        </script>
    </body>
</html>
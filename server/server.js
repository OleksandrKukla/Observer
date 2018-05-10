// modules
let nodeStatic = require( 'node-static' ),
    port = 8089,
    http = require( 'http' );

// config
let file = new nodeStatic.Server( './dist', {
    cache: 3600,
    gzip: true
} );

// serve
http.createServer( function ( request, response ) {
    request.addListener( 'end', function () {
        file.serve( request, response );
    } ).resume();
} ).listen( port );
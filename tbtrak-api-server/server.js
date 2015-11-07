var restify = require('restify');

//authentication
var stormpathRestify = require('stormpath-restify');

var stormpathConfig = {
  apiKeyId: '1LSKKAD1F0R21OMWA3IWJR0TX',
  apiKeySecret: 'Af40JWD29bKRaH5s88/7zcif+z1nZAwY9wKKDeHh73k',
  appHref: 'https://api.stormpath.com/v1/applications/3QGfeOMX6gncrsNQ85nbsh'
};

var stormpathFilters = stormpathRestify.createFilterSet(stormpathConfig);


var oauthFilter = stormpathFilters.createOauthFilter();


var host = process.env.HOST || '127.0.0.1';
var port = process.env.PORT || '8080';

//db stuff
var vehicleBroker = require('./vehicleBroker');

var vehicleBroker = vehicleDatabse({
  baseHref: 'http://' + host + ( port ? (':'+ port): '' ) + '/vehicles/'
});

var server = restify.createServer({
  name: 'Samac Inventory API Server'
});

server.use(restify.queryParser());
server.use(restify.bodyParser());

server.use(function logger(req,res,next) {
  console.log(new Date(),req.method,req.url);
  next();
});

server.on('uncaughtException',function(request, response, route, error){
  console.error(error.stack);
  response.send(error);
});


//routes
server.get('/vehicles',function(req,res){
  res.json(db.all());
});

server.get('/vehicles/:id',[oauthFilter, function(req,res,next){
  var id = req.params.id;
  var vehicle = db.getVehicleById(id);
  if(!vehicle){
	  //if vehicle is null
	  next(new restify.errors.ResourceNotFoundError());
  }else{
    res.json(vehicle);
  }
}]);

server.post('/vehicles', [oauthFilter, function(req,res){
  res.json(db.createVehicle(req.body));
}]);

server.post('/oauth/token', oauthFilter);

//end routes

server.listen(port,host, function() {
  console.log('%s listening at %s', server.name, server.url);
});
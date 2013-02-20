This is a node.js script which notifies me via SMS when non-whitelisted mac addresses log on to my wireless network.  My Cisco access point sends its syslog to
a server.   I have another node.js script which echos syslogs to a redis queue.  This script then reads from that queue.

See https://github.com/klinquist/syslogd-to-redis

To install, you will need to
npm install

to install the dependencies.. then import mactable.sql to a sql database.

Then rename config.js.example to config.js (editing appropriately)

then

node aironetmonitor.js

To run in the background, see forever: https://github.com/nodejitsu/forever

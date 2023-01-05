const Discord = require('discord.js');
const client = new Discord.Client();
const Spotify = require('node-spotify-api');

// Crea una nueva instancia de la API de Spotify y proporciona tus credenciales de acceso
const spotify = new Spotify({
  id: 'TU ID DE CLIENTE DE SPOTIFY AQUI',
  secret: 'TU SECRETO DE CLIENTE DE SPOTIFY AQUI'
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content.startsWith('/play')) {
    // Extrae el título de la canción del mensaje
    const songTitle = message.content.split(' ').slice(1).join(' ');

    // Realiza una búsqueda en Spotify utilizando el título de la canción
    spotify.search({ type: 'track', query: songTitle, limit: 1 }, function(err, data) {
      if (err) {
        return console.log('Error occurred: ' + err);
      }

      // Obtiene la URL de reproducción de la primera canción de los resultados de la búsqueda
      const songUrl = data.tracks.items[0].preview_url;

      // Solo queremos que el bot se una a un canal de voz si está siendo invocado en un canal de voz
      if (message.member.voice.channel) {
        message.member.voice.channel.join().then(connection => {
          // Una vez que el bot se ha unido al canal de voz, reproducimos la canción
          const stream = ytdl(songUrl, { filter: 'audioonly' });
          const dispatcher = connection.play(stream);

          dispatcher.on('finish', () => {
            // Cuando la canción termine, desconectamos el bot del canal de voz
            connection.disconnect();
          });
        });
      } else {
        message.reply('Tienes que unirte a un canal de voz primero!');
      }
    });
  }
});

client.login('TU TOKEN DE ACCESO DE DISCORD AQUI');

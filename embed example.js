bot.sendMessage({
            to: channelID,
            message: `test`,
            embed: {
              type: 'rich',
              title: 'Website Updates',
              description: 'Engineering',
              fields: [{
                name: 'FieldA',
                value: 'ValueA',
                inline: true
              }, {
                name: 'FieldB',
                value: 'ValueB',
                inline: true
              }, {
                name: 'FieldC',
                value: 'ValueC',
                inline: true
              }, {
                name: 'FieldD',
                value: 'ValueD',
                inline: true
              }],
              url: 'http://www.google.com',
              color: 0x0689d5,
              footer: {
                text: 'This is a footer',
                icon_url: 'https://puu.sh/sEw6w/409962aab5.png',
                proxy_icon_url: '' //optional
              },
              image: {
                url: 'http://media.blizzard.com/wow/warlords-of-draenor-6y1fz/media/wallpapers/warlords-of-draenor-1440x900.jpg',
                proxy_url: '', //optional
                height: '900', //optional
                width: '1440' //optional
              },
              thumbnail: {
                url: 'http://media.blizzard.com/wow/warlords-of-draenor-6y1fz/media/wallpapers/warlords-of-draenor-1440x900.jpg',
                proxy_url: '', //optional
                height: '900', //optional
                width: '1440' //optional
              },
              video: {
                url: 'https://www.youtube.com/watch?v=81AM_A19vmU',
                height: '', //optional
                width: '' //optional
              },
              provider: {
                name: 'Fortis Core',
                url: 'http://fortiscoregaming.com'
              },
              author: {
                name: 'Frosthaven',
                url: 'http://fortiscoregaming.com',
                icon_url: 'https://puu.sh/sEw6w/409962aab5.png',
                proxy_icon_url: '' //optional
              }
            }
          });
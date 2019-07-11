function MessageTemplate(name, options) {
  switch(name) {
    case 'welcome':
      return {
        content: '',
        options: {
          username: 'Info',
          avatarURL: 'https://montgomeryplanning.org/wp-content/uploads/2017/08/info-icon.png',
          embeds: [{
            color: 0xff0000,
            title: 'Welcome!',
            description: `Welcome ${options.name} to Jeffrey's DM manager, in order to get started please type ${options.operators.command}help`
          }]
        }
      };

    case 'setup':
      return {
        content: '',
        options: {
          username: 'Help',
          embeds: [{
            color: 0xffff00,
            title: 'Commands',
            description: `This is a list of the commands`
          }]
        }
      };

    case 'eval':
      return {
        content: '',
        options: {
          username: 'Eval',
          embeds: [{
            "title":"Evaluation",
            "description": `:inbox_tray:  __**Input**__\r\n\`\`\`js\r\n${options.input}\r\n\`\`\`\r\n:outbox_tray: __**Output**__\r\n\`\`\`js\r\n${options.result}\r\n\`\`\``
          }]
        }
      };
    
    case 'note':
      let colors = [0xc9ecf8, 0xc5f7c1, 0xf1c3f1, 0xd4cdf3, 0xf8f7b6];
      let color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        content: '',
        options: {
          username: 'Sticky Notes',
          embeds: [{
            title: 'Note',
            color: color,
            description: options.content
          }]
        }
      };
    
    case 'new-dm-channel': 
      return {
        content: '',
        options: {
          username: 'Info',
          embeds: [{
            title: `**Opened a DM channel with ${options.user.username}**`,
            description: 'Some information about the user',
            thumbnail: {
              url: options.user.avatarURL
            }
          }]
        }
      };

    case 'dm-message':
      return {
        content: options.message.content,
        options: {
          username: options.message.author.username, // Change to grab nick name here
          avatarURL: options.message.author.avatarURL
        }
      };
    
    default:
      return {
        content: 'Unknown Template',
        options: {}
      };
  }
}

module.exports = MessageTemplate;

// THIS FILE AND METHOD FOR STORING TEMPLATES IS GOING TO BE DEPRICATED
// Instead templates will be stored as separate files named after their template name in assets/templates
// Each one of the template files MUST export a function taking client and options and be a javascript file
// This way packs of user-created assets may be imported following the same standard
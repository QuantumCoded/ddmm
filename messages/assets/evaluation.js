module.exports = function(options) {
  return {
    content: '',
    options: {
      username: 'Eval',
      embeds: [{
        "title":"Evaluation",
        "description": `:inbox_tray:  __**Input**__\r\n\`\`\`js\r\n${options.input || ' '}\r\n\`\`\`\r\n:outbox_tray: __**Output**__\r\n\`\`\`js\r\n${options.result || ' '}\r\n\`\`\``
      }]
    }
  };
};
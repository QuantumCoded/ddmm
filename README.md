# DDMM
## Information

### Who am I?
I'm a 16 year old fullstack developer with some free time and a passion for writing code nobody will ever see. I'm currently concurrently enrolled taking both college and high school classes as I peruse my future career. I plan to graduate around the age of 20 with a bachelors in both computer science and engineering, each with a minor in mathematics. I do most of my work in node.js as well as write some simple websites (like mystic) in the usual HTML, CSS, and JS. I'm currently looking for someone to work with on code in my free time if anyone would be interested. I can't promise that I'd treat it professionally as I'm more looking for a friend to code with, not really a coworker. If you'd be interested just get a hold of me, my contact info is at the bottom. Alright, enough of my life story, what does my code actually do?

### What is this project?
DDMM, or Discord Direct Message Manager, is a project inspired by an observation made by me regarding my friends. It always seemed to turn out that, right as I figure out what their names and profile pictures are, they change them and I have no idea who they are at first glance. I could've left a note on each of them to check, or opened their DMs and tried to figure out who it was based off our messages, but that seemed like a hassle and besides, I can write code so why not! The idea was to create a sort of intermediary between the user and their actual DMs. This was accomplished by creating a DMs guild (or server). Every time a user sends you a message, a channel will be either made or used in this guild that represents their DM channel. Typing in this channel will be nearly identical to typing in their actual DMs, with a few tweaks.

### How do I use this project?
In order to use this project, some setup is required! This is hopefully only while it is under development as one of the planned features is to package it into an installer.

Setup:
* The project must be cloned / downloaded to it's own folder.
  * The zip can be downloaded <a href="https://github.com/QuantumCoded/ddmm/archive/master.zip" target="_blank">here</a>.
* You must obtaine your Discord token and insert it into the `/settings.json` file before running.
  * You can find your Discord token by following this <a href="https://youtu.be/tI1lzqzLQCs" target="_blank">tutorial</a>. (Contact me if this link breaks)
* You must copy and paste your token into `/settings.json` on the line containing `token: ""` e.x. `token: "my token here"`.
  * For those concerned about stealing your login information, I encourage you to point out any posibilites that your information could be stolen! I have no intentions on taking anyone's information and vulnerabilities in user privacy are of the upmost importance to me!
  * Later I plan to do this process through the use of having you log into your Discord account in the installer ~~if~~ when one gets made. (If doing this is possible, I have no idea)
* The node.js interpreter must be present on the machine before completing the following steps.
  * Node can be downloaded <a href="https://nodejs.org/" target="_blank">here</a>.
* The project's dependencies must be updated by opening a terminal in the source directory (shift right-click on any space that isn't a file and select open command prompt / powershell here) and running `npm up` or `npm update`.
* The `/ddmm` module needs to be linked in `/node_modules` such that all the other modules can make calls to it. (This should be handled automatically later)
  * In the same terminal after npm finishes updating run `npm link ./ddmm`.
* The project (*should*) now be able to run. Start it using `node . [-l <log level>]`.

## Features

### Current features
*Note: Commands and other messages requiring an operator can only be used in DDMM created channels!*

* Create a new DMs guild channel on the receiving of a DM from a user without one.
* Relay messages to and from a DM channel using the DMs guild channels.
* Use commands with a *(soon to be easily)* customizable command operator. (Default is `!`)
* Create sticky notes with an *(also soon to be easily)* customiazble note operator. (Default is `#`)
* Close a DMs guild channel with the usage of the `close` command.
* Change a user's name with the usage of the `rename <name>` command. 
* Change a user's profile picture with the usage of the `repic <url>` command.
* Evaluate a piece of JavaScript code with the usage of the `eval <code>` command. (Can interface DDMM)
* Delete the DMs guild with the usage of the `delguild` command.
* Write your own commands and message templates with the `imports` module. Documentation for how to do so should maybe be coming in the future.
* Ability to select an option by reacting to a input box. As well as the ability to create your own (documented in `/documentation/messages/index.md`)

### Features to be added
*Note: Many of these ideas came from the `/todo.log` file if you're interested in checking out all of my planned updates to the project. Help with these ideas would also be appreciated!*
* View a list of all the commands and usage with the `help <command | page>` command.
* Preform language detection and prompt the user if they would like the message to be translated when sending/receiving.
* Allow for the selection of channel languages with the `language <recipient language> [user language]` command.
* View/set the time of the recipient with the `time [time | timezone]` command.
	* Sidenote: I planned on this generating an image of an analog clock of the current time for the embed, so getting that worked out too would be a nice touch.
* Allow for the ability to check a user's status with the `status` command. This should show their status, online time (if applicable), and device type.
	* A friends channel should probably be added containing a line for each friend's channel link and name `#channel Username` to make finding friends channels easier. This should also be modified on the open and close of a DDMM channel.
	* An online channel should also probably be added containing a line for each friend's channel link, name, and status `#channel Username status` to allow users to see who is online. This should be modified on the change in status of any friend.
* Allow for the ability to set up a channel to receive custom pings from one or more guild channels. This should be largely customizable, but fairly easy to use. I haven't decided on the exact functionality or usage yet, but this is a planned feature.
* Send custom emojis (as images in emoji size) with a message containing only `:emojiName:`. Custom emojis can be set using the `emoji <name> <url>` command, or the `emoji <name> <guild id> <emoji name>` command.
* Send a delayed message using the `timesend <time> <...message>` command.
	* A way to distinguish between recipient time and user time is mandatory if their timezones are different. This might be done with a user input box.
* Integrate the use of a local webserver and custom URLs in order to allow for advanced user interaction.
	* This is a bit far fetched, but also a totally feasible addition to this project. I'm not sure how it would be integrated, but just putting the idea down such that anyone with ideas can suggest them.
* Add the ability to edit and delete messages after sending them in a DMs guild channel. (Done by just editing or deleting the message)
* Package this project into an install to make for easy deployment for users.

### Behind-the-scenes features to be added (things for developers)
*These are going to be fairly boring to anyone who isn't interested in the code behind this project, feel free to skip over this section if you'd like.*
* Change the method for storing profiles in the `/users` module to a SQLite3 database.
* Standardize the message templates such that the commands can construct them with parameters instead of having a custom message template for each command's message.
* Integrate the ability to interface Google's translate API. I'm fairly certain this isn't free, I haven't really dug into it, just thought the ability to translate messages would be kinda nifty. Possibly look into walking each user through setting up their own API key such that they can use a free trial amount if it's provided. If there's no limit just include a custom API token for the project into the code. (Unless someone suggests a better idea).
* Revise code and add comments where necessary, I think I've done a pretty okay job at making sure that my code is decently commented, but you can always add more!
* Take care of any of the `NTS` (note to self) comments. There are there to remind me to fix various things and probably shouldn't be there for much longer. To keep the humor up, as well as the format the same, if this project gains a team the new acronym is going to be (needs tech support). That way all members know that, that note is to be implemented in the future.
* Not that using a map to control the relays, messages, and commands is in any way inherently bad (as far as I'm aware), but I feel like there might be a better way of doing it. Just wanting to put out there that if anyone has any ideas on how this might be reworked to function better, I'm open to suggestions on it.
* Come up with a different way to organize the `/utility` modules. I've hated looking at that directory ever since I've made it, but I've not been able to think of a better way to organize it and it works as is. I considered just leaving the modules open in the main directory but i feel like this could possible be confusing or just untidy. Any suggestions on how to organize this project going forward are always welcomed.
* This is my first project of a scale as large as this one, other than the work I've done as internships. I'm still very new to making code organization standards such that a team can effectively help. I'm probably going to end up reviewing and modifying code submissions if the style is too different than that of the rest of the project. Anyone with the ability to set up automatic code styling guidelines with something similar to what I've currently written (even if it means I have to rewrite some things in order to get them to meet the standards) such that others can write code in a similar style would be a huge benefit to this project if other begin working on it.
* Explore the current cability of the imports system to add changes to the project's functionality. If this expandability isn't as extensive as it could be, it might be desired to upgrade the control hobbyist developers have over the project.
* Add support for binding a message to another object for later access. An example of this would be binding a DM message to a DMs guild message to handle deleting both at the same time. (The same applies with editing)

## Contribution

### I'm a developer, how can I help?

##### Source Development
If you're interested in helping write code for this project at least an intermediate understanding of node.js is required. If you're going to be working on the Discord interfacing portion, at minimum a rudimentary understanding of the discord.js library is also required (both are recommended).

##### Planning
If you're interested in helping plan this project, only a surface level understanding of node.js and discord.js is required. However, an in depth functionality of a majority of the project and how the modules interface with each other is necessary. This is such that others can consult with you about the addition of code and how it will integrate with the rest of the project. What calls will be made to and from, and what will trigger those calls all the way back up to `/index.js`.

##### Standardization
If you're interested in writing code standards for this project, knowledge of how to use a tool such as `ESLint` to write them is required. The ability to communicate with others to decide upon the format and educate them on how to write in it is required.

##### Documentation
If you're interested in documenting this project the ability to write comprehensible documentation for both the developers and users that are interested in "modding" this project is required. The ability to write customizable imports that are included into the project means that those wanting to write them need to know how to interface the rest of the code to do so. Communication with the project planners is recommended such that the details of how the modules 

##### Version Control
If you're interested in properly educating me on how to use GitHub, then please do, I'm not that experienced with the platform and am probably not using it to it's fullest ability.

### I'm not a developer, but I still want to help!

I'm not letting people donate to this project. At least not yet. I don't feel that the quality of it is up to the point that I'd be proud accepting money for it. If you'd like to help this project out, share it with your friends, family, you'r neighbor, shout it from the rooftops, just don't get the police called for a noise complaint. If you're interested in donating money, as time passes and others (possibly) come to work on the project you might eventually be able to if you really feel like we've (or I've, if it's still just me) done a good job. This money will most likely go towards paying those who work on this project to keep the development underway, or to buying Monter to keep me alive to work on it myself (if it's still just me).

### Contact Info
Brendan Fields<br>
brendan.fields@d11.org<br>
Jeffrey#3330 - Discord

*P.S. I respond to Discord the fastest so if you really want to get a hold of me I suggest doing it there (like, no, seriously, please only email me if you don't use Discord), I just put my email down to make myself look professional. Also, sending me a message on Discord or emailing me is not at all a bother. I would love hearing from people interested in the project. I'm still just a normal dude after all, I play guitar and dumb flash gmaes, I'm not some professional empoyee working for some large tech firm.*
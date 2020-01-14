### This describes the process of a new incoming message in events/assets/message.js
```mermaid
  sequenceDiagram

    alt user has relay

      events/assets ->> relay: userRelays.has(message.author.id)
      relay -->> events/assets: true
      events/assets ->> relay: userRelays.get(message.author.id)
      relay -->> events/assets: relay

      alt relay has a channel

        events/assets ->> client: channels.has(relay.channel.id)
        client -->> events/assets: true

        events/assets ->> messages: send(relay.channel, 'message', message)
        messages ->> messages: templates.has(name)
        messages -->> messages: true
        messages ->> messages: templates.get(name)
        messages -->> messages: templateConstructor
        messages ->> messages/assets: templateConstructor(initialMessage)

        alt user has a profile
          messages/assets ->> users: profiles.has(message.author.id)
          users -->> messages/assets: true
          messages/assets ->> users: profiles.get(message.author.id)
          users -->> messages/assets: profile
          messages/assets ->> messages/assets: profile.getProperty('name')
          messages/assets ->> messages/assets: profile.getProperty('profile-picture')
        else user doesn't have a profile
          messages/assets ->> users: profiles.has(message.author.id)
          users -->> messages/assets: false
        end

        messages/assets -->> messages: template
      
        messages ->> webhook: webhook(channel, template)

      else relay doesn't have a channel

        events/assets ->> client: channels.has(relay.channel.id)
        client -->> events/assets: false

        events/assets ->> relay: initialize()
        
        loop Initialize Relays
          relay ->> relay: initializeLink([userId, channelId])

          alt relay has user and channel
          
            relay ->> client: users.has(userId)
            client -->> relay: true
            relay ->> client: channels.has(channelId)
            client -->> relay: true

            relay ->> client: users.get(userId).dmChannel
            client -->> relay: dmChannel

            relay ->> client: channels.get(channelId)
            client -->> relay: guildChannel

            relay ->> relay: new Relay(dmChannel, guildChannel)
            relay -->> relay: relay

            relay ->> relay: userRelays.set(userId, relay)
            relay ->> relay: channelRelays.set(channelId, relay)

          else missing user or channel

            alt user is missing

              relay ->> client: users.has(userId)
              client -->> relay: false

            else channel is missing

              relay ->> client: channels.has(channelId)
              client -->> relay: false
            end

            relay ->> relay: userRelays.delete(userId)
            relay ->> relay: channelRelays.delete(channelId)
          end
        end

        events/assets ->> relay: createRelay(user, initialMessage)
      
        alt user has a profile

          relay ->> users: profiles.has(user.id)
          users -->> relay: true
          relay ->> users: profiles.get(user.id)
          users -->> relay: profile
          relay ->> relay: profile.getValue('name')
          relay -->> relay: profileName

        else user doesn't have a profile

          relay ->> users: profiles.has(user.id)
          users -->> relay: false
          relay ->> users: createProfile(user.id, {...})
          users ->> users: initializeProfile(fileName)
          users ->> client: users.has(user.id)
          client -->> users: true
          users ->> users: profiles.set(id, profile)
        end

        relay ->> guild: createChannel(profileName || user.username, {...})
        guild -->> relay: .then(channel)

        relay ->> relay: initializeLink([user.id, channel.id])

        relay ->> client: users.has(user.id)
        client -->> relay: true
        relay ->> client: channels.has(channel.id)
        client -->> relay: true

        relay ->> relay: userRelays.set(user.id, relay)
        relay ->> relay: channelRelays.set(channel.id, relay)

        relay ->> messages: send(channel, 'new-channel', user)
        messages ->> messages: templates.has(name)
        messages -->> messages: true
        messages ->> messages: templates.get(name)
        messages -->> messages: templateConstructor
        messages ->> messages/assets: templateConstructor(user)
        messages/assets -->> messages: template

        messages ->> webhook: webhook(channel, template)

        relay ->> messages: send(channel, 'message', initialMessage)
        messages ->> messages: templates.has(name)
        messages -->> messages: true
        messages ->> messages: templates.get(name)
        messages -->> messages: templateConstructor
        messages ->> messages/assets: templateConstructor(initialMessage)
        messages/assets ->> users: profiles.has(message.author.id)
        users -->> messages/assets: true
        messages/assets ->> users: profiles.get(message.author.id)
        users -->> messages/assets: profile
        messages/assets ->> messages/assets: profile.getProperty('name')
        messages/assets ->> messages/assets: profile.getProperty('profile-picture')
        messages/assets -->> messages: template
        
        messages ->> webhook: webhook(channel, template)
      end

    else user dosen't have relay

      events/assets ->> relay: userRelays.has(message.author.id)
      relay -->> events/assets: false
      events/assets ->> relay: createRelay(user, initialMessage)
      
      alt user has profile

        relay ->> users: profiles.has(user.id)
        users -->> relay: true
        relay ->> users: profiles.get(user.id)
        users -->> relay: profile
        relay ->> relay: profile.getValue('name')
        relay -->> relay: profileName

      else user doesn't have profile

        relay ->> users: profiles.has(user.id)
        users -->> relay: false
        relay ->> users: createProfile(user.id, {...})
        users ->> users: initializeProfile(fileName)
        users ->> client: users.has(user.id)
        client -->> users: true
        users ->> users: profiles.set(id, profile)
      end

      relay ->> guild: createChannel(profileName || user.username, {...})
      guild -->> relay: .then(channel)

      relay ->> relay: initializeLink([user.id, channel.id])

      relay ->> client: users.has(user.id)
      client -->> relay: true
      relay ->> client: channels.has(channel.id)
      client -->> relay: true

      relay ->> relay: userRelays.set(user.id, relay)
      relay ->> relay: channelRelays.set(channel.id, relay)

      relay ->> messages: send(channel, 'new-channel', user)
      messages ->> messages: templates.has(name)
      messages -->> messages: true
      messages ->> messages: templates.get(name)
      messages -->> messages: templateConstructor
      messages ->> messages/assets: templateConstructor(user)
      messages/assets -->> messages: template

      messages ->> webhook: webhook(channel, template)

      relay ->> messages: send(channel, 'message', initialMessage)
      messages ->> messages: templates.has(name)
      messages -->> messages: true
      messages ->> messages: templates.get(name)
      messages -->> messages: templateConstructor
      messages ->> messages/assets: templateConstructor(initialMessage)
      messages/assets ->> users: profiles.has(message.author.id)
      users -->> messages/assets: true
      messages/assets ->> users: profiles.get(message.author.id)
      users -->> messages/assets: profile
      messages/assets ->> messages/assets: profile.getProperty('name')
      messages/assets ->> messages/assets: profile.getProperty('profile-picture')
      messages/assets -->> messages: template
      
      messages ->> webhook: webhook(channel, template)
    end
```

<div style="page-break-after:always;"></div>

<!-- Sequence Diagram Template
### Process title
```mermaid
  sequenceDiagram

```

<div style="page-break-after:always;"></div>
 -->
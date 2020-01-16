### This details the process of sending and setting up a reactable message.

```mermaid
  sequenceDiagram
    loop Resolve Emojis
      note right of guild: Find emoji
      alt emoji exists
        caller ->> guild: emojis.filter
        guild -->> caller: emoji
      else emoji dosen't exist
        caller ->> guild: emojis.filter
        guild -->> caller: undefined
        note left of caller: Handle error
      end
    end

    caller ->> messages: send(channel, 'reactable', options, callback)
    messages ->> messages: templates.has(name)
    messages -->> messages: true
    messages ->> messages: templates.get(name)
    messages -->> messages: templateConstructor
    messages ->> messages/assets: templateContructor(options)
    messages/assets -->> messages: template
    messages ->> webhook: webhook(channel, template, callback)
    note left of webhook: Sending
    webhook ->> caller: callback(message)

    caller ->> messages: makeReactable(message, reactions, reactableCallback)

    loop Add Reactions
      messages ->> messages: message.react(reaction)
    end

    messages ->> messages: reactableMap.set(message.id, reactableCallback)

    opt timeout
      note left of messages: Wait for 60 seconds

      alt message was not reacted
        messages ->> messages: reactableMap.has(message.id)
        messages -->> messages: true
        messages ->> messages: message.clearReactions()
        messages ->> caller: reactableCallback(-1)
        note right of caller: Handles timeout
        messages ->> messages: reactableMap.delete(message.id)
      else message was reacted
        messages ->> messages: reactableMap.has(message.id)
        messages -->> messages: false
      end
    end
```

<div style="page-break-after:always;"></div>

### This describes the events/assets/messageReactionRemoved.js file's interaction with messages/index.js in the form of an unreact handler.

```mermaid
  sequenceDiagram
    loop Unreact Handler
      events/assets ->> messages: messageUnreact(reaction, user)

      note right of messages: Ensure user is<br/>client.user

      alt message is reactable
        messages ->> messages: reactableMap.has(reaction.message.id)
        messages -->> messages: true
        messages ->> messages: reactableMap.get(reaction.message.id)
        messages -->> messages: reactableCallback
        messages ->> messages: reaction.message.clearReactions()
        messages ->> caller: reactableCallback(reaction.name)
        note left of caller: Handles react
        messages ->> messages: reactableMap.delete(reaction.message.id)
      else message is not reactable
        messages ->> messages: reactableMap.has(reaction.message.id)
        messages -->> messages: false
      end
    end
```
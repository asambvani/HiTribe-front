Group = createGroup()

function createGroup(){
  return class {

    constructor(id, name){
      this.id = id
      this.name =  name
      this.messages = []
      store.groups.push(this)
    }

    users(){
      return store.groupUsers.filter((groupUser)=>{
        return this.id === groupUser.groupId
      }).map(function(groupUser){
        return User.find(groupUser.userId)
      })
    }

    static find(id){
      return store.groups.find(function(group){
        return parseInt(group.id) === id
      })
    }

    renderMessages(){
      //need to input first part of URL
      fetch(`http://localhost:3000/groups/${this.id}/messages`).then(function(response){
        return response.json()
      }).then((data)=>{
        // parse data properly
        this.messages = []
        data.forEach((message)=>{
          this.messages.push({id:message.id, userId:message.user_id ,messageText:message.message_text, isPost:message.is_post, comments:message.comments})
        })
      }).then(()=>{
        $('#messages-container').empty()
        $('#messages-container').append(this.messagesHTML())
      })
    }

    groupHTML(){
      return `<li class="group" data-id="${this.id}"> ${this.name}</li>`
    }

    messagesHTML(){
      return this.messages.map(function(message){
        let messageBodyHTML = ""
        if (message.messageText.includes('.gif')){
          messageBodyHTML = `<img class="gif" src="${message.messageText}"></img>`
        } else{
          messageBodyHTML = message.messageText
        }

        if (message.isPost){
          return `
          <div class="card post-container" data-id="${message.id}">
            <div class="row">
              <div class='post-content'>
                <div class="post-text">
                  <div class="avatar col s1.5">
                    <img src=${User.find(message.userId).imageURL}></img>
                  </div>
                </div>
                ${messageBodyHTML}
              </div>
            </div>
            <p> ${Message.commentsHTML(message)}</p>
            <div class="row">
              <div class="input-field col s10">
                <input placeholder="Insert a comment..." id="new-comment" type="text">
              </div>
              <div class="input-field col s2">
                <i class="material-icons" id="add-new-comment">add</i>
              </div>
            </div>
           </div>`
        } else {
          return `<div class="row col s12">
                     <div class="avatar col s1.5">
                        <img src=${User.find(message.userId).imageURL}></img>
                    </div>
                    <div class="message-content col s9"> ${message.messageText}
                    </div>
                  </div>`
        }
      }).join("")
    }

    static allGroupsHTML(){
      let returnHTML = '<li class="group-label">Friends<a class="modal-trigger" href="#modal1"><i class="material-icons right" id="add-friend">add_circle_outline</i></a></li><br><li class="group-label">Tribes        <a class="modal-trigger" href="#modal2"><i class="material-icons right" id="add-group">add_circle_outline</i></a></li>'
      return returnHTML + (store.groups.map(function(group){
        return group.groupHTML()
      }).join(''))
    }
  }
}


// for render groups method:

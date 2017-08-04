function renderGroups(){
  $('#groups-container').empty()
  $('#groups-container').append(Group.allGroupsHTML())
}

function getAllGroupMembers(){
  if (store.currentGroup) {
    fetch(`http://localhost:3000/groups/${store.currentGroup}/users`).then(function(response){
      return response.json()
    }).then(function(data){
      data.forEach(function(user){
        new User(user.id, user.username, user.first_name, user.last_name, user.image_url)
      })
    })
  }
}

function bindGroupNames(){
  $('body').on('click', '.group', function(){
    let groupId = parseInt(this.dataset.id)
    Group.find(groupId).renderMessages()
    store.currentGroup = groupId
    listenForNewMessages()
    autoDownScroll(450, '#messages-container')
    getAllGroupMembers()
    $('#friends-icon').css('display', 'block')
  })
}

function bindAddGroup(){
  $('body').on('click', '#create-group', function(){
    let groupName = $('#new-group-name').val()
    if(groupName){
      $.ajax({
        url: "http://localhost:3000/groups",
        method: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({name: groupName, currentUser: store.currentUser})
      }).then(function(response){
        init()
      })
    }
  })
}

function bindAddFriendToGroup(){
  $('#add-user-to-group').on('click', function(){
    let username = $('#new-friend-in-group').val()
    $('#new-friend-in-group').val("")
    $.ajax({
      url: `http://localhost:3000/groups/${store.currentGroup}/users`,
      method: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({id: store.currentGroup, username: username})
    })
  })
}

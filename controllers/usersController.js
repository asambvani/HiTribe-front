function getFriends(){
  if (store.currentUser){
    fetch(`http://localhost:3000/users/${store.currentUser}/friends`).then(function(response){
      return response.json()
    }).then(function(data){
      store.friends = []
      data.forEach(function(friend){
        new User(friend.id, friend.username, friend.first_name, friend.last_name, friend.image_url)
      })}
    )
  }
}

function bindShowFriends(){
  $("#friends-icon").on('click', function(event){
    if (store.currentGroup){
      fetch(`http://localhost:3000/groups/${store.currentGroup}/users`).then(function(response){
        return response.json()
      }).then(function(data){
        $('#group-members ul').empty()
        data.forEach(function(user){
            $('#group-members ul').append(`<li>${user.username}</li>`)
        })
      })
    }else {
      $('#group-members ul').empty()
    }
  })
}

function bindAddFriend(){
  $('body').on('click', '#create-friend', function(){
    let friendName = $('#add-friend-name').val()
    if(friendName){
      $.ajax({
        url: `http://localhost:3000/users/${store.currentUser}/friends`,
        method: "POST",
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({friend_name: friendName, currentUser: store.currentUser})
      }).then(function(){
        getFriends()
      })

    }
  })
}

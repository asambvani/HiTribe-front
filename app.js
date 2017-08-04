$(document).ready(function(event){
  $('.modal').modal();
  store = {friends:[], groups:[], groupUsers:[], currentUser: null, currentGroup:null, intervalId:0 }
  store.currentUser = window.localStorage.currentUser
  checkForLogin()
  listenForCreateUser()
  bindGroupNames()
  bindSubmit()
  bindAddGroup()
  bindAddFriend()
  bindShowFriends()
  bindAddFriendToGroup()
  bindLogout();
  //need to wait for init() to finish...
  // Group.find(store.currentGroup).renderMessages()

})

function init(){
  //manually log in with the first user (for now)
  let currentUser=store.currentUser
  //to fill in the rest of this url
  if (currentUser) {
    fetch(`http://localhost:3000/users/${currentUser}/groups`).then(function(response){
      return response.json()
    }).then(function(data){
      store.groups = []
      data.forEach(function(group){
        new Group(group.id, group.name)
      }
    )
    }).then(function(){
      renderGroups()
    })
  }

  getFriends()
  getAllGroupMembers()

  // fetch(`http://localhost:3000/users/${currentUser.id}/friends`).then(function(response){
  //   return response.json()
  // }).then(function(data){
  //   data.forEach(function(user){
  //     new User(user.id, user.name)
  //   })
  // })
  //
  // fetch(`http://localhost:3000/users/${currentUser.id}/group-users`).then(function(response){
  //   return response.json()
  // }).then(function(data){
  //   data.forEach(function(groupUser){
  //     new groupUser(groupUser.userId, groupUser.groupId)
  //   })
  // })
  //fetch users
  //fetch groups
  //user_groups
}
// Event Listeners



function checkForLogin(){
  if(store.currentUser){
    $('#friends-icon').css('display', 'none')
    init()
  } else{
    $('#friends-icon').css('display', 'none')
    listenForLogin()
  }

  // fetch('http://localhost:3000/login').then(function(response){
  //   return response.json()
  // }).then(function(data){
  //   if(data.username===null){
  //     listenForLogin()
  //   } else{
  //     store.currentUser = data.id
  //   }
  // })
}

function listenForLogin(){
  //slide me up
  $(".card").css("overflow", "hidden")
  $(".card-reveal").css("display", "block")
  $(".card-reveal").css("transform", "translateY(-100%)")
  $("#login-form").on("submit", function(event){
    event.preventDefault()
    loginUsername = $("#login-username").val()
    loginPassword = $("#login-password").val()

    fetch(`http://localhost:3000/login?username=${loginUsername}`).then(function(response){
      return response.json()
    }).then(function(data){
      store.currentUser = data.id
      window.localStorage.setItem("currentUser",data.id)
      init()
    })

    $(".card-reveal").css("display", "none")
  })
}

function listenForCreateUser(){
  $('body').on('click', '#create-btn', function(){
    showCreateUser()
  })

  $('body').on('submit', '#create-form', function(event){
    event.preventDefault()
    let username = $('#create-username').val()
    let firstName = $('#create-first-name').val()
    let lastName = $('#create-last-name').val()
    //let password = $('#create-password')
    $.ajax({
      url: "http://localhost:3000/users",
      method: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({user: {username: username, first_name: firstName, last_name: lastName}})
    }).then(function(){
      showLogin()
    })
  })
}

function showLogin(){
  $('#login-form').css("display","block")
  $('#create-form').css("display","none")
}

function showCreateUser(){
  $('#login-form').css("display","none")
  $('#create-form').css("display","block")
}

function autoDownScroll(boxHeight, boxId){
  let messageBox = $(boxId)[0]
  messageBox.scrollTop = messageBox.scrollHeight - boxHeight
}

function bindLogout(){
  $('#logout').on('click', function(){
    window.localStorage.setItem("currentUser", "")
    clearInterval(store.intervalId)
    store.friends = []
    store.groups = []
    store.currentUser = null
    store.currentGroup = null
    store.intervalId = 0
    $('#messages-container').empty()
    $('#friends-icon').css('display', 'none')
    renderGroups()
    checkForLogin();
  })
}

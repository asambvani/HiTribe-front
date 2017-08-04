
function bindSubmit(){
  $('body').on('click', '#new-message', function(event){
    submitMessage(event)
  })

  $('body').on('submit', '#messages-form', function(event){
    submitMessage(event)
  })
}


function submitMessage(event){
  let isPost = false
  let messageText = ""

  if ($('#post-text')[0]){
    isPost = true
    messageText = $('#post-text').val()
    $('#post-text').val("")
    }
  else {
    messageText = $('#message-text').val()
    $('#message-text').val("")
  }



  event.preventDefault();
  $.ajax({
    url: "http://localhost:3000/messages",
    method: "POST",
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({text: messageText, currentUser: store.currentUser, currentGroup: store.currentGroup, isPost: isPost})
  })
  postToMessage()
}

function listenForNewMessages(){
  clearInterval(store.intervalId)
  if (store.currentUser && store.currentGroup) {
    store.intervalId = setInterval(function(){
      Group.find(store.currentGroup).renderMessages()
      if (($("#messages-container")[0].scrollHeight - $("#messages-container")[0].scrollTop) <= 700) {
        autoDownScroll(450, '#messages-container')
      }
    } , 250)
  }
}


$(document).ready(function(){

  $('body').on('click','#message-is-post',function(){
    $('#new-message')[0].innerHTML = "border_color"
    $('#message-text').attr("id","post-text")
    $('#message-is-post')[0].innerHTML = "Message"
    $('#message-is-post').attr("id","message-is-message")
  })

  $('body').on('click','#message-is-message',function(){
    postToMessage()
  })


  $('body').on('click', '#add-new-comment',function(){
    let commentText = $(this).parent().parent().find('input').val()
    let messageId = parseInt($(this).parent().parent().parent().data().id)
    $.ajax({
      url: `http://localhost:3000/messages/${messageId}/comment`,
      method: "POST",
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({text: commentText, currentUser: store.currentUser})
    }).then(function(){
      listenForNewMessages()
    })
  })

  $('body').on('click',function(event){
    if(event.target.id === 'new-comment'){
      clearInterval(store.intervalId)
    } else{
      listenForNewMessages()
    }
  })
})

function postToMessage(){
  $('#new-message')[0].innerHTML = "chat_bubble_outline"
  $('#post-text').attr("id","message-text")
  $('#message-is-message')[0].innerHTML = "Post"
  $('#message-is-message').attr("id","message-is-post")
}

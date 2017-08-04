let User = createUser()

function createUser(){
  return class User{
    constructor(id, username, firstName, lastName, imageUrl){
      this.id = id
      this.username = username
      this.firstName = firstName
      this.lastName = lastName
      this.imageURL = imageUrl
      store.friends.push(this)
    }
    messages(){
      // retrieve messages for this user from backend
    }
    static find(id){
      return store.friends.find(function(user){
        return parseInt(id) === parseInt(user.id)
      })
    }
  }
}

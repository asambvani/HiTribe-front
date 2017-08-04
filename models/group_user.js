GroupUser = createGroupUser()

function createGroupUser(){
  let id = 0
  return class {
    constructor(groupId, userId){
      this.id = ++id;
      this.groupId = groupId
      this.userId = userId
      store.groupUsers.push(this)
    }
  }
}

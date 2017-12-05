class MenuEntity {
    constructor() {
        this.id=''
        this.title=''
        this.iconUrl=''
    }
}

class GroupEntity {
    constructor (){
        this.title=''
        this.menuItems = []
    }
}

export {MenuEntity,GroupEntity}

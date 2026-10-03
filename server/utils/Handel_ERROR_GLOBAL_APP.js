//handel syntax error
class Handel_ERROR_GLOBAL_APP extends Error{
    constructor(message,statuscode){
    super(message)
    this.statuscode=statuscode || 500
    this.status=`${this.statuscode}`.startsWith(4)?"faild":"error"
    }
}
export{Handel_ERROR_GLOBAL_APP}
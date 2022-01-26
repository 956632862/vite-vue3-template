import utils from "@/plugins/globalEvent"
class Snake {

  batchCreateDot(count = 0) : any{
    if (!count) return null
    const fishers = []
    for (let i = 1; i <= count; i++) {
      fishers.push({
        w:10,
        h:10,
        num:20,
      })
    }
    return fishers
  }


  computeFishSize(num:number){
    return parseInt(String(num / 2 + 25))
  }
}
export default Snake

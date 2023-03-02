class test {
  constructor() {
    console.log("yay")
  }
}

let classNameString = "test2"

eval(`${classNameString} = new test`)
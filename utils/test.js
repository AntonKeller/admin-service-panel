let date = '15.07.2024';
let dateRef = date.replace(/(\d\d\.)(\d\d\.)/i, '$2$1')
let timeStamp = Date.parse(dateRef);
let dateTime = new Date(timeStamp)

console.log('date:', date);
console.log('dateRef:', dateRef);
console.log('parse:', timeStamp);
console.log('date time:', dateTime.toLocaleString());
// console.log(new Date(1716152400000).toLocaleString())

// console.log(new Date(Date.now()).toLocaleString())
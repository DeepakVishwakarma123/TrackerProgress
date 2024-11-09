export let request=indexedDB.open("Trackdatabase",5)
export let db;

export function dbSchema()
{ 
request.onupgradeneeded=(e) =>
{
db=e.target.result
let chosedDaystore=db.createObjectStore("ChooseDays",{keyPath:"chosedId"})
let taskStore=db.createObjectStore("Taskstore",{keyPath:"Taskid",autoIncrement:true})
let dayStore=db.createObjectStore("Daysstore",{keyPath:"dId"})
taskStore.createIndex("tid","taskId",{unique:false})
taskStore.createIndex("tdesc","taskDescription",{unique:false})
taskStore.createIndex("tindic","taskIndicator",{unique:false})
dayStore.createIndex("did","dId",{unique:false})
dayStore.createIndex("stateElement","state",{unique:false})
dayStore.createIndex("assignDate","boxasDate",{unique:false})
dayStore.createIndex("indicatorObjectForTask","Taskadd",{unique:false})
chosedDaystore.add({chosedId:1,selectedDays:0})
}
request.onsuccess=(e) =>{
    console.log("successs")
}
request.onerror=(e) =>
{
    console.log("eror",e);
}
}
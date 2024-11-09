import { request,dbSchema,db } from "./indexdb.js"
let dbclone=db
dbSchema()
renderSaveDayfromdb()

// variable reference for elements dom

let dayInput=document.getElementById('dayInput')
let dayIndicator=document.getElementById('DayIndicator')
let submitButtonDay=document.getElementById('daySubmitButton')
let headingDay=document.getElementById('head')
let selectMenu=document.querySelector(".selectDays")
let choosedDayindicator=document.getElementById("choosedDay")
let ChoosedDay=0

let FixedSetofDays={
  Weekly:7,
  Monthly:30,
  Yearly:365
}
let {Weekly,Monthly,Yearly}=FixedSetofDays
//default valus showings
dayInput.value=Weekly
choosedDayindicator.textContent=`Day:${ChoosedDay}`

function insertinDb(daytoadd)
{  
  let request=indexedDB.open("Trackdatabase",5)
  console.log(daytoadd);
  console.log(request);
  
  request.onsuccess=(e) =>
   {
    dbclone=e.target.result
    let trobj=dbclone.transaction("ChooseDays","readwrite")
    let mystore=trobj.objectStore("ChooseDays")
    dbclone.onerror=(e) =>console.log("track error at db level",e);
                         
                        //  --------------------------------------
                        mystore.get(1).onsuccess=(e) =>{
                          let data=e.target.result
                          data.selectedDays=parseInt(Number(daytoadd))
                          console.log(data);
                         let result2=mystore.put(data)
                         result2.onsuccess=(e) =>console.log("db is updated",e.target.result)
                         result2.onerror=(e) =>console.log("db is in error",e.target.result)
                          }
                          mystore.get(1).onerror=(e) =>console.log("error at get",e)
                        }
                        
                        request.onerror=(e) =>
                        {
                         console.log("error occured");
                        }

}

//adding global funciton render for day saved 
function renderSaveDayfromdb()
{ 
 let request=indexedDB.open("Trackdatabase",5)
 request.onsuccess=(e)=>
 {
  dbclone=e.target.result
  let trobj=dbclone.transaction("ChooseDays")
  let storeChooseDay=trobj.objectStore("ChooseDays")
  dbclone.onerror=(e) =>
   {
    console.log("error occured while getitng data from db",e)
   }
   let dayRequest=storeChooseDay.get(1)
   dayRequest.onsuccess=(e) =>
   {
    let savedDayObj=e.target.result
    let  savedDay=savedDayObj.selectedDays
    let dayorDaysDecider=(savedDay===1)?"Day":"Days"
    choosedDayindicator.textContent=`${dayorDaysDecider}:${savedDay}`
   }
   dayRequest.onerror=(e) =>
   {
     console.log("errro occurd while getitng data",e)
   }
 }
}

renderSaveDayfromdb()

selectMenu.addEventListener('change',() =>
{
 if(selectMenu.value.startsWith("W"))
   {
   dayInput.value=Weekly
   }
   else if(selectMenu.value.startsWith("M"))
   {
    dayInput.value=Monthly
   }
   else{
    dayInput.value=Yearly
   }                                                                             
  }
)
                                                                                                                                                                                       


// two arrays holding months for each type of year
const daysInMonthsNoramlYear= [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
const daysInMonthsLeapYear = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
let dayinNormalYear=365
let daysInleapYera=366


// basis date object method which we are use on for futhre purposes in other sections
let acitveDateObj=new Date()
let currentDate=acitveDateObj.getDate()
let currentMonth=acitveDateObj.getMonth()
let currentYear=acitveDateObj.getFullYear()
let RemainingDays=0




// logic of day choose
function dayCalculate()
{
    if(currentYear%4==0)
      {   
        // passing leap year, array to sum function
         sum(currentYear,daysInMonthsLeapYear,daysInleapYera)
        }
        else if(currentYear%100===0 && currentYear%400===0)
          {
         sum(currentYear,daysInMonthsLeapYear,dayinNormalYear)
        }
        else{
          // default year passing
        sum(currentYear,daysInMonthsNoramlYear,daysInleapYera)
      }
    }
dayCalculate()

function sum(year,eachMonthTotalDaysArrray,totalDaysinYear)
{
 let sum=0
 eachMonthTotalDaysArrray.forEach(
    (dayinTotalMonth,monthCount) =>{
      if(monthCount<currentMonth)
      {
      sum+=dayinTotalMonth
      }
    }
 )
let totalDays=sum+=currentDate
RemainingDays=totalDaysinYear-totalDays
dayIndicator.textContent=`${RemainingDays}`
}


// showing changes after completion
function checkDaysEnteredByuser()
{      
      dayIndicator.textContent=""
      if(dayInput.value==="")
      { 
      // not a good approach expontentil cases
      headingDay.textContent='Status:Failed'
      }
      else if(dayInput.value>0 && dayInput.value<=RemainingDays)
      {
      ChoosedDay=dayInput.value
      insertinDb(ChoosedDay)
      headingDay.textContent='status:success'
      renderSaveDayfromdb()
      }
      else{
        ChoosedDay=0
        headingDay.textContent=`Status:Failed`
      }
      dayInput.value=""
}
submitButtonDay.addEventListener('click',checkDaysEnteredByuser)

dayInput.addEventListener('input',() => {
  headingDay.textContent="Reaming Days in Year"
dayIndicator.textContent=`${RemainingDays}`

})






export {currentDate,acitveDateObj,currentMonth,currentYear,choosedDayindicator,renderSaveDayfromdb}

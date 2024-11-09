import { cancelButton,addTaskButton,activeMenu,inputArea,isActive} from "./focus.js"
import { currentDate,acitveDateObj,currentMonth,currentYear,choosedDayindicator,renderSaveDayfromdb} from "./dayChoose.js"
import { EmojiButton } from 'https://cdn.jsdelivr.net/npm/@joeattardi/emoji-button@4.6.2/dist/index.min.js';
let db

// this is intilly false because we just need to render All data as function called
let wantTorendercurrentElement=false

//a promise which is passed as global level
let promise=renderSaveData(wantTorendercurrentElement)    //the promsie is used to get info of current added elements

consumePromise(promise)

//currentPromise is used to track current Promsies
function consumePromise(currentPromise)
{
  currentPromise.then(
    (data) =>
    {    
        console.log("that is a data",data);
      
        //  don,t add events if there is no elements
        //intially we have just one image
        console.log(taskAddmainContainer.children.length)
        if(taskAddmainContainer.children.length===1 && taskAddmainContainer.firstElementChild==="img")
        {
         console.log("don,t add events to edit and delete buttons");
        }
        else{
          let lastElementChildsArray=[]
          let ulElementsArray=[]
          let lastliElementArray=[]
          let firstliElementArray=[]
          let mainContainerElementsArray=taskAddmainContainer.children
          let mainContinaerConvereted=Array.from(mainContainerElementsArray)
          function doloopOnarray(elementArray,emptyElementArray,isLastElement)
          {         
            if(isLastElement)
            {
              elementArray.forEach( element => emptyElementArray.push(element.lastElementChild))
            }
            else{
              elementArray.forEach(element => emptyElementArray.push(element.firstElementChild))
            }
          } 
          doloopOnarray(mainContinaerConvereted,lastElementChildsArray,true)
          doloopOnarray(lastElementChildsArray,ulElementsArray,true)
          doloopOnarray(ulElementsArray,lastliElementArray,true)
          doloopOnarray(ulElementsArray,firstliElementArray,false)
          console.log("the delete elements are:",lastliElementArray)
          console.log("the edit elements are:",firstliElementArray)
          firstliElementArray.forEach(
            editButton =>editButton.addEventListener('click',editTask)
          )
          lastliElementArray.forEach(
            editButton =>editButton.addEventListener('click',() =>alert("pressed button is delete",this))
          )
        }
    }
  ).catch(err=>console.log(err)).finally(() =>console.log("promise is eithr resolved or rejected")
  )
}

function editTask()
{
// getting main parent element of top root
let mainContainer=this.closest("#main") //the closest method is used 
let gruoupButtons=`  
 <div class="flex col-span-2 gap-2">
                  <div>
                    <button class="btn btn-ghost rounded-full w-20 h-2" id="CancelButton">Cancel</button>
                   </div>
                   <div> 
                    <button class="btn btn-primary btn-outline w-36 rounded-full" id="TaskaddButton">Save</button>
                   </div>
                 </div>
`
let maintaskdiv=mainContainer.firstElementChild
let paragraphTaskMain=maintaskdiv.firstElementChild
let taskDescriptionEleValue=paragraphTaskMain.lastElementChild.textContent
paragraphTaskMain.remove()
this.remove()
let input=document.createElement("input")
input.value=taskDescriptionEleValue
input.classList.add('inputStyle')

// add autofocus to above element and solve error
maintaskdiv.append(input)
console.log(input);
console.log(maintaskdiv)
}


//element creation in global scopes
let editDeleteMenu=`<div class="dropdown dropdown-left col-span-1 flex justify-center  items-center">
       <button class="btn">
       <img src="dot.png" alt="dotpngImage" width="20px">
       </button>
    <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1]  p-2 shadow" id="taskEditDeleteMenu">
      <li><a>edit</a></li>
      <li><a>delete</a></li>
    </ul>
  </div>`


const picker=new EmojiButton()
const trigger=document.getElementById("trigger")

let emojichoosed;
let indicatorChoose=picker.on(
    'emoji',Selection => {
       trigger.innerHTML=Selection.emoji
    }
)

trigger.addEventListener('click',() =>{picker.togglePicker(trigger)})


//variable reference
let taskAddmainContainer=document.getElementById("taskAdded")


let imagesElement=taskAddmainContainer.firstElementChild



// array to store used indicator as task icons
let usedIndicator=[]
function addtask()
{
// let,s check whether the field is empty or not
if(inputArea.value!=="" && inputArea.value.length>0 && inputArea.value.length<=400)                                                                                        
{     
  let isAlreadyUsed=usedIndicator.filter((indicator) =>indicator===trigger.innerHTML )
  console.log("filteredArray",isAlreadyUsed)
  //simplying that my array is empty from filter which indicates that data doesn,t exist means previously can,t used by user
  if(isAlreadyUsed.length===0)
    {    
         //is gone True which can used to add current element to call in function
        wantTorendercurrentElement=true
        //gathering user chosed data or entered data 
         let chosedIndicator=trigger.innerHTML
         let description=inputArea.value
         //saving users data in db by calling function
         console.log("the character length would be",description.length);
         
         saveTaskinfoindb(description,chosedIndicator)
         //passigg current element indicating variable
         let promiseonAddingTask=renderSaveData(wantTorendercurrentElement)
         consumePromise(promiseonAddingTask)
        }
        else{
          console.log("content is already used are:",isAlreadyUsed);
          alert("error occured")
        }                                                                                                                                                                                                                                                                                                           
      }
      else{
          console.log("field is empty")
          }
      console.log("adding contents are:",usedIndicator)
}


function createElement(arrayOfTask,isRenderWholeorCurrnet)
{     
     if(isRenderWholeorCurrnet)
     {
      //intilly we have to get first element
      if(arrayOfTask.length===1)
      {
        //getting first element
        console.log("reffering to the first element");
        
        let firstElementData=arrayOfTask[0]
        generateElements(firstElementData)
      }
      //we need always last element
      else{
        console.log("refferitn to the last elemlen");
        
        let lastElementData=arrayOfTask[arrayOfTask.length-1]
        generateElements(lastElementData)
      }
     }
     else{
       arrayOfTask.forEach(taskobject => {
           generateElements(taskobject)  
      })
     }
    //if some data,s are there in db we remove images and we push triggers emoji in arrays
    if(arrayOfTask.length!==0)
    {
   imagesElement.remove()
   taskAddmainContainer.classList.remove("gridonparent")
   console.log("used indicator after adding contents or pushing",usedIndicator);
    }
  }
  
  // funciton for saving data in task store through indexdb
function saveTaskinfoindb(description,indicator)
{ 
  let request=indexedDB.open("Trackdatabase",5)
  request.onsuccess=(e) =>
    { 
   console.log("data",description);
  //  console.log(taskid);
   
   db=e.target.result
   let transactionObject=db.transaction("Taskstore","readwrite")
   let taskStoreAccess=transactionObject.objectStore("Taskstore")
   db.onerror=(e) =>
   {
    console.log("errro occured",e);
   }
   let addrequest=taskStoreAccess.add({taskDescription:description,taskIndicator:indicator})
   addrequest.onsuccess=(e) =>console.log("data add")
   addrequest.onerror=(e) =>console.log("error at add time",e)
 }
}

function renderSaveData(renderDataDecider)
{
    let request=indexedDB.open("Trackdatabase",5)
      return new Promise(
        (resolve,reject) =>
        {
          request.onsuccess=(e) =>
          {  
             db=e.target.result
             let trasactionObject=db.transaction("Taskstore")
             let taskStoreAccess=trasactionObject.objectStore("Taskstore")
             let getAllrequest=taskStoreAccess.getAll()
             getAllrequest.onsuccess=(e) =>
             {
                 let allTaskDataarray=e.target.result
                 createElement(allTaskDataarray,renderDataDecider)
                 resolve("all elements are rendered with array data")
                 console.log("test");
                 
             }
             getAllrequest.onerror=(e) =>
              {  
                console.log("errro at getting all records",e)
                reject("something error occured",e)
              }
          }
          request.onerror=(e) =>
          {
               console.log("error occured")
          }
        }
      )
    }

// element to add for toggle 



function generateElements(taskobject)
{ 
  console.log("the code reached here");
  
  taskAddmainContainer.classList.add("gridontaskadd")
  let mainParent=document.createElement("div")
  mainParent.id="main"
  let mytaskdiv=document.createElement("div")
  let paragraph=document.createElement("p")
  let taskParagraph=document.createElement("p")
  taskParagraph.textContent=`${taskobject.taskDescription}`
  let emojiparagraph=document.createElement("p")
  mainParent.classList.add("gridsetup")
  mytaskdiv.classList.add("colspanClass")
  paragraph.classList.add("paragraph")
  emojiparagraph.textContent=taskobject.taskIndicator
  paragraph.append(emojiparagraph,taskParagraph)
  mytaskdiv.append(paragraph)
  mainParent.append(mytaskdiv)
  mainParent.insertAdjacentHTML("beforeend",editDeleteMenu)
  taskAddmainContainer.insertAdjacentElement("beforeend",mainParent)                                                                                                                                                                                                                                                               
  usedIndicator.push(taskobject.taskIndicator)
}
// function getElementId's


addTaskButton.addEventListener('click',addtask)

const inputArea=document.getElementById("inputTaskarea")
const activeMenu=document.getElementById("activeMenuonFocus")
const cancelButton=document.getElementById("CancelButton")
const addTaskButton=document.getElementById("TaskaddButton")
// element references

// intial state
let isActive=false
activeMenu.setAttribute("isActive",isActive)



function toggleMenu()
{
    activeMenu.style="display:block"
    //state on foucus
    isActive=true
    activeMenu.setAttribute("isActive",isActive)
}
function hideMenu()
{
    activeMenu.style="display:none"
    //state after click cancel button
    isActive=false
    inputArea.value=""
    activeMenu.setAttribute("isActive",isActive)
}

let inputState=()=>
{    
    if(inputArea.value!="")
    {
    addTaskButton.style="background:blue;color:white"
    }
    // else if(inputArea.value.length<100)
    // {
      
    // }
    else{
        addTaskButton.style="white;"
    }
}
inputArea.addEventListener('focus',toggleMenu,false)
cancelButton.addEventListener('click',hideMenu,false)
inputArea.addEventListener('input',inputState,false)

export {inputArea,activeMenu,cancelButton,addTaskButton,isActive}

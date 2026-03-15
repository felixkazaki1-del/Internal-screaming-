
let alters = JSON.parse(localStorage.getItem("alters")) || []
let editingIndex=null

function saveStorage(){

localStorage.setItem("alters",JSON.stringify(alters))

}

function updateGroupFilter(){

const groups=[...new Set(alters.map(a=>a.group).filter(Boolean))]

const select=document.getElementById("groupFilter")

select.innerHTML='<option value="">All Groups</option>'

groups.forEach(g=>{

const opt=document.createElement("option")
opt.value=g
opt.textContent=g

select.appendChild(opt)

})

}

function renderAlters(){

const container=document.getElementById("alterContainer")
container.innerHTML=""

const search=document.getElementById("search").value.toLowerCase()
const groupFilter=document.getElementById("groupFilter").value

alters.forEach((alter,i)=>{

if(search && !alter.name.toLowerCase().includes(search)) return
if(groupFilter && alter.group!==groupFilter) return

const card=document.createElement("div")
card.className="alterCard"
card.onclick=()=>editAlter(i)

card.innerHTML=`
<div class="alterColour" style="background:${alter.colour}"></div>
<img class="avatar" src="${alter.avatar||""}">
<h3>${alter.name}</h3>
<div>${alter.group||""} / ${alter.subgroup||""}</div>
<p>${formatMarkdown(alter.bio||"")}</p>
`

container.appendChild(card)

})

updateGroupFilter()

}

function createAlter(){

editingIndex=null
editor.classList.remove("hidden")

}

function editAlter(i){

editingIndex=i
const a=alters[i]

alterName.value=a.name||""
alterGroup.value=a.group||""
alterSubgroup.value=a.subgroup||""
alterColour.value=a.colour||"#cccccc"
alterBio.value=a.bio||""

editor.classList.remove("hidden")

}

function saveAlter(){

const file=alterAvatar.files[0]

function finishSave(avatarData){

const alter={
name:alterName.value,
group:alterGroup.value,
subgroup:alterSubgroup.value,
colour:alterColour.value,
bio:alterBio.value,
avatar:avatarData
}

if(editingIndex===null){

alters.push(alter)

}else{

alters[editingIndex]=alter

}

saveStorage()
renderAlters()
closeEditor()

}

if(file){

const reader=new FileReader()

reader.onload=e=>finishSave(e.target.result)

reader.readAsDataURL(file)

}else{

finishSave(alters[editingIndex]?.avatar)

}

}

function deleteAlter(){

if(editingIndex!==null){

alters.splice(editingIndex,1)
saveStorage()

}

closeEditor()
renderAlters()

}

function closeEditor(){

editor.classList.add("hidden")

}

function formatMarkdown(text){

return text
.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>")
.replace(/`(.*?)`/g,"<code>$1</code>")
.replace(/\n/g,"<br>")

}

function toggleTheme(){

document.body.classList.toggle("dark")

localStorage.setItem("theme",
document.body.classList.contains("dark")?"dark":"light")

}

if(localStorage.getItem("theme")==="dark"){
document.body.classList.add("dark")
}

renderAlters()

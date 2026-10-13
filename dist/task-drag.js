import {canMoveTask} from './model.js';
let dragging=null,suppressClickUntil=0;
const clear=()=>{document.body.classList.remove('dragging-task');document.querySelectorAll('.drop-target,.task-dragging').forEach(e=>e.classList.remove('drop-target','task-dragging'));dragging=null};
export function bindTaskDrag(tasks,onMove){
 const dialog=document.querySelector('#move-task-dialog'),select=document.querySelector('#move-parent');
 const valid=parent=>dragging&&canMoveTask(tasks,dragging,parent||null);
 const highlight=(target)=>{document.querySelectorAll('.drop-target').forEach(e=>e.classList.remove('drop-target'));if(target&&valid(target.dataset.dropParent))target.classList.add('drop-target')};
 const start=(id)=>{dragging=id;document.body.classList.add('dragging-task');document.querySelectorAll('[data-task-id]').forEach(e=>e.classList.toggle('task-dragging',e.dataset.taskId===id))};
 const finish=parent=>{const id=dragging,allowed=valid(parent);clear();suppressClickUntil=Date.now()+400;if(allowed)onMove(id,parent||null)};
 document.querySelectorAll('[data-drag-task]').forEach(handle=>{
  const id=handle.dataset.dragTask;
  handle.onclick=()=>{if(Date.now()<suppressClickUntil)return;select.replaceChildren(new Option('Master task (no parent)',''));for(const t of tasks)if(canMoveTask(tasks,id,t.id)){const option=new Option(t.name,t.id);select.add(option)}select.value=tasks.find(t=>t.id===id)?.parent||'';document.querySelector('#move-task-title').textContent='Move '+tasks.find(t=>t.id===id).name;dialog.showModal();document.querySelector('#move-task-form').onsubmit=e=>{e.preventDefault();dialog.close();onMove(id,select.value||null)}};
  handle.onpointerdown=e=>{
   if(e.button!==0)return;
   const origin={x:e.clientX,y:e.clientY};let started=false,y=e.clientY,target=null,frame;
   handle.setPointerCapture(e.pointerId);
   const locate=(x,y)=>{const element=document.elementFromPoint(x,y);return element?.closest('[data-drop-parent]')};
   const scroll=()=>{if(started){const delta=y<80?-12:y>window.innerHeight-80?12:0;if(delta){window.scrollBy(0,delta);target=locate(origin.x,y);highlight(target)}}frame=requestAnimationFrame(scroll)};
   const move=e=>{y=e.clientY;origin.x=e.clientX;if(!started&&Math.hypot(e.clientX-origin.startX,e.clientY-origin.startY)>6){started=true;start(id);frame=requestAnimationFrame(scroll)}if(started){e.preventDefault();target=locate(e.clientX,e.clientY);highlight(target)}};
   origin.startX=e.clientX;origin.startY=e.clientY;
   const end=e=>{cancelAnimationFrame(frame);handle.removeEventListener('pointermove',move);handle.removeEventListener('pointerup',end);handle.removeEventListener('pointercancel',end);handle.removeEventListener('lostpointercapture',end);if(handle.hasPointerCapture(e.pointerId))handle.releasePointerCapture(e.pointerId);if(started){if(e.type==='pointercancel'||e.type==='lostpointercapture'||!target){clear();suppressClickUntil=Date.now()+400}else finish(target.dataset.dropParent)}};
   handle.addEventListener('pointermove',move);handle.addEventListener('pointerup',end);handle.addEventListener('pointercancel',end);handle.addEventListener('lostpointercapture',end);
  };
 });
 document.querySelector('#cancel-move').onclick=()=>dialog.close();document.querySelector('#close-move').onclick=()=>dialog.close();
}



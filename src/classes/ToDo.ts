
import { v4 as uuidv4 } from "uuid"

export type ToDoStatus = "pending" | "on going" | "solved"

export interface IToDo {

    name: string
    description: string
    status: ToDoStatus
    deadline: Date
    id: string
    relatedProject: string
}

export class ToDo implements IToDo {
    // To satisfy Interface
    name: string
    description: string
    status: "pending" | "on going" | "solved"
    deadline: Date

    // Class internals
    ui: HTMLDivElement
    id: string
    relatedProject: string
    shortdeadline: string


    constructor(data: IToDo) {
        console.warn("TD - ToDo constructor invoked")
        for (const key in data) {
            this[key] = data[key]
        }
        console.log("data: ", data)
        console.log("this.id: ",this.id)
        this.setShortDeadline()
        this.setUI()
        this.setTODOCardColor()
        if (this.id == "") {
            console.log("this.id is undefined")
            this.id = uuidv4()
            console.log("this id after uuidv4: ",this.id) 
        }
    }

    editProject() {
        console.warn("TD - editProject invoked")
        console.log("tratando de editar")
    }

    setUI() {
        console.warn("TD - setUI invoked")
        if (this.ui && this.ui instanceof HTMLElement) {return}
        console.log("I've reached this point")
        this.ui = document.createElement("div")
        this.ui.className = "todo-card"
        this.ui.id = this.id
        this.ui.innerHTML = `
        <div class="todo-card" type="button">
            <button hidden id="${this.id}-btn"><span class="material-icons-round">edit</span></button>
            <span class="material-icons-round" style="width:30px; height:30px; display:flex; justify-content:center; align-items:center">check_circle_outline</span>
            <div hidden><h5 data-todo-info:"id" class="todo-description">${this.id}</h5></div>
            <div style="width: 50%"><h5 data-todo-info:"description" class="todo-description">${this.description}</h5></div>

            <div style="width: 15%"><h5 data-todo-info:"status" class="todo-description">${this.status}</h5></div>
            <div hidden><h5 data-todo-info:"relatedProject" class="todo-description">${this.relatedProject}</h5></div>
            <div style="display: none"><h5 data-todo-info:"deadline" class="todo-deadline">${this.deadline}</h5></div>
            <div><h5 data-todo-info:"shortdeadline" class="todo-deadline">${this.shortdeadline}</h5></div>

        </div>`
    }

    setTODOCardColor() {
        const todocard = this.ui
        if (todocard && todocard instanceof HTMLDivElement) {
            if (this.status == "solved") {
                console.log("TD - SetToDoCardCooor, this.ui exists.", this.status)
                todocard.style.backgroundColor = 'rgb(158, 195, 158)';
            } 
            if (this.status == "on going") {
            todocard.style.backgroundColor = '#D2B48C';
            }
            if (this.status == "pending") {
            todocard.style.backgroundColor = 'var(--background-200)';
            }
         }
    }

    setShortDeadline() {
        this.shortdeadline = new Date (this.deadline).toLocaleDateString("es-ES")
    }


}
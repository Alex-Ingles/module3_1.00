
import { v4 as uuidv4 } from "uuid"
import { ToDo, IToDo } from "./ToDo"

export type ProjectStatus = "pending" | "active" | "finished"
export type UserRole = "architect" | "engineer" | "developer"

export interface IProject {

    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    cost: number
    initials: string
    progress: number
    id: string
    todoList: ToDo[]
}

export class Project implements IProject {
    // To satisfy Interface
    name: string
    description: string
    status: "pending" | "active" | "finished"
    userRole: "architect" | "engineer" | "developer"
    finishDate: Date
    cost: number
    progress: number = 0
    todoList: ToDo[] = []

    // Class internals
    ui: HTMLDivElement
    ui2: HTMLDivElement
    initials: string
    initialsColor: string
    id: string
    shortFinishDate: string


    constructor(data: IProject) {
        console.warn("P - Project constructor invoked")

        for (const key in data) {
            this[key] = data[key]
        }
        console.log("data: ", data)
        console.log("Project: ", Project)
        console.log("this.id: ",this.id)

        if (this.id == "") {
            console.log("this.id is undefined")
            this.id = uuidv4()
            console.log("this id after uuidv4: ",this.id) 
        }
        console.warn("Interfaced data: ",data)
        console.warn("value of date on data: ",data.finishDate.valueOf)

        console.log("Project Constructor -> Project: ")
        console.log(this.finishDate)

        this.findInitials()
        console.log("new project: ", this.initials, this.finishDate)
        console.log("new project (after invoking setDefaultDate): ", this.initials, this.finishDate)
        console.log("new project (after invoking setDefaultDate and after if statement): ", this.initials, this.finishDate)
        this.setShortFinishDate()
        this.setUI()
    }

    findInitials() {
        console.warn("P - findInitials invoked")
        if (!this.name) { return }
        const words = this.name.split(' ', 2)
        const map1 = words.map((x) => x.charAt(0))
        if (map1[1]) {
            this.initials = map1[0] + map1[1] as string
        } else {
            this.initials = map1[0] as string
        }
        if (this.initialsColor) {return}
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
          }
        const random = getRandomInt(11)
        const colors = Array.of("powderblue", "lightsteelblue", "lightblue", "darkseagreen", "palegoldenrod", "lightslategrey", "cadetblue", "rosybrown", "silver", "tan", "indianred")
        this.initialsColor = colors[random]
    }

    setUI() {
        console.warn("P - setUI invoked")
        if (this.ui && this.ui instanceof HTMLElement) {return}
        let progressPercent = this.progress * 100
        let progressPercentToString = progressPercent.toString
        this.ui = document.createElement("div")
        this.ui.className = "project-card"
        this.ui.id = this.id
        this.ui.innerHTML = `
        <div class="card">
            <div class="card-header">
                <p data-project-info="initials" style="background-color: ${this.initialsColor}; padding:10px; border-radius: 8px; aspect-ratio: 1">${this.initials}</p>
                <div>
                    <h5 data-project-info="name">${this.name}</h5>
                    <h5 data-project-info="description" class="description">${this.description}</h5>
                </div>
            </div>
            <div class="card-content">
                <div style="display: none" class="card-property">
                    <p style="color: #969696;">Id</p>
                    <p data-project-info="id">${this.id}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Status</p>
                    <p data-project-info="status">${this.status}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Role</p>
                    <p data-project-info="userRole">${this.userRole}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Cost</p>
                    <p data-project-info="cost">$${this.cost}</p>
                </div>
                <div style="display: none" class="card-property">
                    <p style="color: #969696;">Finish Date</p>
                    <p data-project-info="finishDate">${this.finishDate}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Finish Date</p>
                    <p data-project-info="shortFinishDate">${this.shortFinishDate}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Estimated Progress</p>
                    <p data-project-info="progress">${this.progress}%</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Initials</p>
                    <p data-project-info="initials" style="text-transform: uppercase">${this.initials}</p>
                </div>

            </div>`
    }

    setShortFinishDate() {
        this.shortFinishDate = new Date (this.finishDate).toLocaleDateString("es-ES")
    }
}
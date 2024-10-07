import { Project, IProject, UserRole, ProjectStatus } from "./Project"
import { ToDo, IToDo, ToDoStatus } from "./ToDo"

export class ProjectsManager {
    list: Project[] = []
    ui: HTMLElement
// -----------------------------------------------------------------------------
constructor(container: HTMLElement) {
        console.warn("PM - New ProjectsManager constructor invoked" )
        this.ui = container
        this.setDefaultProjectUI()
    }
// -----------------------------------------------------------------------------
setDefaultProjectUI() {
    console.warn("PM - setDefaultProjectUI invoked")
    const defaultData: IProject = {
        name: "default-project" as string,
        description: "Default description" as string,
        cost: 0 as number,
        status: "Default status" as ProjectStatus,
        userRole: "Default userRole" as UserRole,
        finishDate: new Date ("finishDate" as string),
        progress: 50 as number,
        initials: "DP" as string,
        id: "defaultId" as string,
        todoList: []

    }
    const defaultProject = new Project(defaultData)
    defaultProject.ui.addEventListener("click", () => {
        const projectsPage = document.getElementById("projects-page")
        const detailsPage = document.getElementById("project-details")
        if (!projectsPage || !detailsPage) {return}
        console.log("pages exists")
        projectsPage.style.display = "none"
        detailsPage.style.display = "flex"
        this.setDetailsPage(defaultProject)
    })

    this.ui.append(defaultProject.ui)
    this.list.push(defaultProject)
    console.warn("Default Project is created")
    return defaultProject
}
// -----------------------------------------------------------------------------
deleteDefaultProjectUI() {
    console.warn("PM - deleteDefaultProjectUI invoked")
    const child = document.getElementById("defaultId")
    const parent = document.getElementById("projects-list")
    if (child && parent) {
        parent.removeChild(child)
        this.list.shift()
        return(document)
    }
}
// -----------------------------------------------------------------------------
newProject(data: IProject) {
    this.deleteDefaultProjectUI()

    console.warn("PM - newProject invoked")
    const projectNames = this.list.map((project) => {
        return project.name
    })
    console.log("ProjectsManager.newProject -> Project names list before newProject:")
    console.log(projectNames)
    const nameInUse = projectNames.includes(data.name)
    if (data.name.length < 6){
        throw new Error(`Project name "${data.name}" must contain at least 6 characters`)
    }

    if (this.idInUse(data.id)) {
        this.updateProject(data)
    } else {

        const newToDoList = [] as ToDo[]
        for (const toDo of data.todoList) {
            try { 
                const newToDo = new ToDo(toDo)
                newToDoList.push(newToDo)
            } catch (error) {
                    alert (error)
            }
        }
        data.todoList = newToDoList

        const project = new Project(data)
        project.ui.addEventListener("click", () => {
            const projectsPage = document.getElementById("projects-page")
            const detailsPage = document.getElementById("project-details")
            if (!projectsPage || !detailsPage) {return}
            console.log("pages exists")
            projectsPage.style.display = "none"
            detailsPage.style.display = "flex"
            this.setDetailsPage(project)
        })
        console.warn("PM - newProject project after function: ", project)
        this.ui.append(project.ui)
        this.list.push(project)
        console.warn("PM - newProject projectsManager list after function: ", this.list)

    }
    console.warn("New Project is created")
}
// set Details Page -----------------------------------------------------------------------------
setDetailsPage(project: Project) {
    console.warn("PM - setDetailsPage invoked")
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) {return}
    const id = detailsPage.querySelector("[data-project-info='id']")
    if (id) {id.textContent = project.id}
    const name = detailsPage.querySelector("[data-project-info='name']")
    if (name) { name.textContent = project.name}
    const name2 = detailsPage.querySelector("[data-project-info='name2']")
    if (name2) { name2.textContent = project.name}
    const initials = detailsPage.querySelector("[data-project-info='initials']")
    if (initials && initials instanceof HTMLParagraphElement) { 
        initials.textContent = project.initials
        initials.style.backgroundColor = project.initialsColor
    }

    const description = detailsPage.querySelector("[data-project-info='description']")
    if (description) { description.textContent = project.description}
    const description2 = detailsPage.querySelector("[data-project-info='description2']")
    if (description2) { description2.textContent = project.description}

    const status = detailsPage.querySelector("[data-project-info='status']")
    if (status) { status.textContent = project.status}
    const cost = detailsPage.querySelector("[data-project-info='cost']")
    const costAsString = project.cost.toString()
    if (cost && costAsString) { cost.textContent = costAsString}
    const userRole = detailsPage.querySelector("[data-project-info='userRole']")
    if (userRole) { userRole.textContent = project.userRole}
    const finishDate = detailsPage.querySelector("[data-project-info='finishDate']")
    const finishDateAsString = project.finishDate.toString()
    if (finishDate) { finishDate.textContent = finishDateAsString}

    const shortFinishDate = detailsPage.querySelector("[data-project-info='shortFinishDate']")
    if (shortFinishDate) { shortFinishDate.textContent = new Date (project.finishDate).toLocaleDateString("es-ES") }

    const progress = detailsPage.querySelector("[data-project-info='progress']")
    console.warn("PM SetDetails progress: ", progress)
    const progressAsString = project.progress.toString(10)
    console.warn("PM SetDetails: ",project.progress)
    console.warn("PM SetDetails: ",progressAsString)

    if (progress && progressAsString) { progress.textContent = progressAsString }
    const bar = document.getElementById("project-progress-bar")
    console.warn("PM - New - bar:", bar)
    if (bar && bar instanceof HTMLDivElement) {
        bar.style.width = progressAsString + "%"

        console.warn("bar-style-width :", bar.style.width)
        console.warn(bar)
    }
    else {console.warn("bar does'nt exists")}

        console.warn("progressAsString: ",progressAsString)
        
    const container = document.getElementById("todo-list")
    if (container && container instanceof HTMLElement) {

        let count = container.childElementCount
        console.log(count)
        for (var i=0;i < count;i++) {
            let child = container.firstElementChild
            if (child) {
            container.removeChild(child)
            }
        }
        for (const toDo of project.todoList) {
            try { 
                const defToDo = 
                (toDo)
                container.append(defToDo.ui)
                defToDo.ui.addEventListener("click", () => {
                    console.log("I listen the click on ToDo UI")
                    console.log(defToDo)
                    const toDoCard = defToDo.ui
                    console.log(toDoCard, toDoCard.innerHTML)
                    const editToDoForm = document.getElementById("edit-todo-form")
                    if (editToDoForm && editToDoForm instanceof HTMLFormElement) { editToDoForm.reset() }
 
                    if(toDoCard) {
                        console.log("todoCard exists")
                        const cardId = detailsPage.querySelector("[data-todo-info='id']")
                        const cardName = detailsPage.querySelector("[data-todo-info='name']")
                        const cardDescription = detailsPage.querySelector("[data-todo-info='description']")
                        const cardStatus = detailsPage.querySelector("[data-todo-info='status']")
                        const cardDeadline = detailsPage.querySelector("[data-todo-info='deadline']")
                        const cardRelatedProject = detailsPage.querySelector("[data-todo-info='relatedProject']")
                        const cardShortDeadline = detailsPage.querySelector("[data-todo-info='shortdeadline']")
                        console.log("todoCard data: ",cardId, cardName, cardDescription, cardStatus, cardDeadline, cardRelatedProject)
                        if (cardId && cardName && cardDescription && cardStatus && cardDeadline && cardRelatedProject)
                        console.log("todoCard data: ",cardId.innerHTML, cardName.innerHTML, cardDescription.innerHTML, cardStatus.innerHTML, cardDeadline.innerHTML, cardRelatedProject?.innerHTML)

                        console.log("todoCard data: ",cardId?.innerHTML, cardName?.innerHTML, cardDescription?.innerHTML, cardStatus?.innerHTML, cardDeadline?.innerHTML, cardRelatedProject?.innerHTML)
                        const setToDoCardData: IToDo = {
                            id: cardId?.innerHTML as string,
                            name: cardName?.innerHTML as string,
                            description: cardDescription?.innerHTML as string,
                            status: cardStatus?.innerHTML as ToDoStatus,
                            deadline: new Date (cardDeadline?.innerHTML as string),
                            relatedProject: cardRelatedProject?.innerHTML as string,
                        }
                        console.log("setToDoCardData: ",setToDoCardData)
    
                        if (cardName && toDoCard && container && editToDoForm && detailsPage) { 
                            console.log(name)
                            const editModal = document.getElementById("edit-todo-modal")
                            if (editModal && editModal instanceof HTMLDialogElement) {
                                editModal.showModal()
                            }
                            let formId = editToDoForm.querySelector("[data-todo-info='id']")
                            if (formId && formId instanceof HTMLInputElement) {
                                formId.value = defToDo.id
                            }
                            let formRelatedProject = editToDoForm.querySelector("[data-todo-info='relatedProject']")
                            if (formRelatedProject && formRelatedProject instanceof HTMLInputElement) {
                                formRelatedProject.value = defToDo.relatedProject
                            }
                            let formName = editToDoForm.querySelector("[data-todo-info='name']")
                            if (formName && formName instanceof HTMLInputElement) {
                                formName.value = defToDo.name 
                            }
                            let formDescription = editToDoForm.querySelector("[data-todo-info='description']")
                            if (defToDo.description && formDescription instanceof HTMLTextAreaElement) {
                                let descriptionValue = defToDo.description
                                if (formDescription) {formDescription.textContent = descriptionValue} 
                            }
                            let formStatus = editToDoForm.querySelector("[data-todo-info='status']")
                            if (formStatus && formStatus instanceof HTMLSelectElement) {
                                formStatus.value = defToDo.status 
                            }
                            let formDeadline = editToDoForm.querySelector("[data-todo-info='deadline']")
                            if (formDeadline && formDeadline instanceof HTMLInputElement) {
                                let deadline2 = new Date(defToDo.deadline)
                                const deadline3 = deadline2.toISOString().split('T')[0];
                                console.warn("finishDate3: ", deadline3)
                                console.warn("finishDate2: ",deadline2)
                                console.warn("finishDate2.toLocaleDateString: ",deadline2.toLocaleDateString("es-ES"))
                                formDeadline.value = deadline3
                            }
                        }
                    }
            })}
            catch (error) {
                alert (error)
            }
        }
    }
}
// Id In Use -----------------------------------------------------------------------------

idInUse(id: string) {
    console.warn("PM - idInUse invoked")
    const projectIds = this.list.map((project) => {
        return project.id
    })
    if (projectIds.includes(id)) {
        console.warn("idInUse: id already exists")
        return true
    }
    else {
        return false
    }
}

// Update Project -----------------------------------------------------------------------------
updateProject(data: IProject) {
    console.warn("PM - updateProject invoked")
    if (data.name.length < 6){
        throw new Error(`Project name "${data.name}" must contain at least 6 characters`)
    }
    const newList: Project[] = []
    const newToDoList: ToDo[] = [] 
    for (const oldproject of this.list) {
        if (oldproject.id !== data.id) {
            newList.push(oldproject)
        } else {
            for (const item of oldproject.todoList) {
                newToDoList.push(item)
            }
            for (const key in oldproject) {
                oldproject[key] = data[key]
            }
            oldproject.todoList = newToDoList
            newList.push(oldproject)
        }
    }
    this.list = newList

    const projectCard = document.getElementById(data.id)
    if (!projectCard) {return}
    const id = projectCard.querySelector("[data-project-info='id']")
    if (id) {id.textContent = data.id}
    const description = projectCard.querySelector("[data-project-info='description']")
    if (description) {description.textContent = data.description}
    const name = projectCard.querySelector("[data-project-info='name']")
    if (name) {name.textContent = data.name}
    const status = projectCard.querySelector("[data-project-info='status']")
    if (status) {status.textContent = data.status}
    const cost = projectCard.querySelector("[data-project-info='cost']")
    const costAsString = data.cost.toString(10)
    if (cost && costAsString) { cost.textContent = costAsString}
    const userRole = projectCard.querySelector("[data-project-info='userRole']")
    if (userRole) { userRole.textContent = data.userRole}
    const finishDate = projectCard.querySelector("[data-project-info='finishDate']")
    const finishDateAsString = data.finishDate.toString()
    if (finishDate) { finishDate.textContent = finishDateAsString}
    const shortFinishDate = projectCard.querySelector("[data-project-info='shortFinishDate']")
    console.warn(this.getProject(data.id).shortFinishDate)
    if (shortFinishDate) { shortFinishDate.textContent = new Date (data.finishDate).toLocaleDateString("es-ES")}
    let progress = projectCard.querySelector("[data-project-info='progress']")
    const progressAsString = data.progress.toString()
    if (progress) { progress.textContent = progressAsString }
}

// Update ToDo -----------------------------------------------------------------------------
updateToDo(data: ToDo) {
    console.warn("PM - updateToDo invoked")

    const newList: Project[] = []
    const newToDoList: ToDo[] = [] 
    console.log(data)
    console.log(this.list)

    for (const oldproject of this.list) {
        if (oldproject.id !== data.relatedProject) {
            newList.push(oldproject)
        } else {
            for (let oldtodo of oldproject.todoList) {
                if (oldtodo.id !== data.id) {
                    newToDoList.push(oldtodo)
                    console.log(newToDoList)
                } else {
                    for (let key in oldtodo) {
                        oldtodo[key] = data[key]
                    }
                    newToDoList.push(oldtodo)
                }
            }
            oldproject.todoList = newToDoList
            newList.push(oldproject)
        }
    }
    console.warn("PM - this.list after updating: ", this.list)

    const todoCard = document.getElementById(data.id)
    if (!todoCard) {return}
    const id = todoCard.querySelector("[data-todo-info='id']")
    if (id) {id.textContent = data.id}
    const relatedProject = todoCard.querySelector("[data-todo-info='relatedProject']")
    if (relatedProject) {relatedProject.textContent = data.relatedProject}
    const name = todoCard.querySelector("[data-todo-info='name']")
    if (name) {name.textContent = data.name}
    const description = todoCard.querySelector("[data-todo-info='description']")
    if (description) {description.textContent = data.description}
    const status = todoCard.querySelector("[data-todo-info='status']")
    if (status) {status.textContent = data.status}
    const deadline = todoCard.querySelector("[data-todo-info='deadline']")
    const finishDateAsString = data.deadline.toString()
    if (deadline) { deadline.textContent = finishDateAsString}
}

// get Project -----------------------------------------------------------------------------
getProject(id: string) {
    console.warn("PM - getProject invoked")
    const project = this.list.find((project) => {
        return project.id as string === id as string
    })
    if (project)
    console.log(project as Project)
    return project as Project
}
// get project by name -----------------------------------------------------------------------------
getProjectbyName(name: string) {
    const project = this.list.find((project) => {
        return project.name === name
    })
    return project
}
// -----------------------------------------------------------------------------
deleteProjectUI(id: string) {
    console.warn("PM - deleteProjectUI invoked")
    const project = this.getProject(id) as Project
    const parent = document.getElementById("projects-list")
    const child = document.getElementById(id)
    if (parent && child) {
    parent.removeChild(child)
    console.log("deleteProjectUI: I reach this point")
    } else {
        console.log("Id provided does'nt match with any id of projectsList")
        return }
    }
// -----------------------------------------------------------------------------
deleteProjectFromList(id: string) {
    console.warn("PM - deleteProjectFromList invoked")
    const project = this.getProject(id) as Project
    if (project) {
        const remaining = this.list.filter((project) => {
            return project.id !== id
        })
        this.list = remaining
        console.log("deleteProjectFromList: I reach this point")
        console.log("remaining: ",remaining)
    } else { 
        console.log("Id provided does'nt match with any id of projectsList")
        return
    }
}

// -----------------------------------------------------------------------------
totalCost() {
    const total = this.list.reduce((total, project) => total + project.cost, 0)
    console.log(total)
    return total
}
// -----------------------------------------------------------------------------
exportToJSON(fileName: string = "projects") {
    const json = JSON.stringify(this.list, null, 2)
    const blob = new Blob([json], {type: 'application/json'})
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    a.click()
    URL.revokeObjectURL(url)
}
// -----------------------------------------------------------------------------
importFromJSON() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json'
    const reader = new FileReader()
    reader.addEventListener('load', () => {
        const json = reader.result
        if (!json) { return }
        const projects: IProject[] = JSON.parse(json as string)
        for (const project of projects) {
            try {
                this.newProject(project)
            }
            catch (error) {
                alert(error)
            }
        }

    })
    input.addEventListener('change', () => {
        const filesList = input.files
        if (!filesList) { return }
        reader.readAsText(filesList[0])
    })
    input.click()
}
}

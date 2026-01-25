export class StorageHandler{

    constructor(){
        //projectName
        //projectDescription
        //tasks : [{},{},{}]
        this.projects = JSON.parse(localStorage.getItem("projects"))
        if (this.projects == null){
            this.projects = []
        }
    }

    addProject(name, description){
        this.projects.push({projectName: name, projectDescription: description, taskList: []})
        localStorage.setItem("projects", JSON.stringify(this.projects))
    }

    addTask(projectIndex, taskName, taskDescription, taskDueDate, taskPriority, completeStatus){
        this.projects = JSON.parse(localStorage.getItem("projects"))
        this.projects[projectIndex].taskList.push({
            name: taskName,
            description: taskDescription,
            dueDate: taskDueDate,
            priority: taskPriority,
            completed: completeStatus
        })    
        localStorage.setItem("projects", JSON.stringify(this.projects))
    }

    modifyProject(projectIndex, newName=undefined, newDescription=undefined){

    }

    modifyTask(projectIndex, taskIndex, newName=undefined, newDescription=undefined, newDueDate=undefined, newPriority=undefined, newCompleteStatus=undefined){
        this.projects = JSON.parse(localStorage.getItem("projects"));
        const task = this.projects[projectIndex].taskList[taskIndex];
        console.log(projectIndex, taskIndex)
        console.log(this.projects)

        if (newName != undefined){
            task.name = newName;
        }
        if (newDescription != undefined){
            task.description = newDescription;
        }
        if (newDueDate != undefined){
            task.dueDate = newDueDate;
        }
        if (newPriority != undefined){
            task.priority = newPriority;
        }
        if (newCompleteStatus != undefined){
            task.completed = newCompleteStatus;
        }

        this.projects[projectIndex].taskList[taskIndex] = task
        localStorage.setItem("projects", JSON.stringify(this.projects))
    }

    deleteProject(projectIndex){
        this.projects = JSON.parse(localStorage.getItem("projects"))
        this.projects.splice(projectIndex, 1)
        localStorage.setItem("projects", JSON.stringify(this.projects))
    }

    deleteTask(projectIndex, taskIndex){
        this.projects = JSON.parse(localStorage.getItem("projects"));
        this.projects[projectIndex].taskList.splice(taskIndex, 1);
        localStorage.setItem("projects", JSON.stringify(this.projects))
    }

    clear(){
        this.projects = [];
        localStorage.clear();
    }

}

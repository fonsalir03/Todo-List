import {isPast, parse, format} from "date-fns";

export class TaskItem{
    name = undefined
    #description = undefined
    #dueDate = undefined
    #priority = undefined
    completed = false;

    constructor(name, description, dueDate, priority, completeStatus, project){
        this.name = name;
        this.description = description;
        this.dueDate = dueDate
        this.priority = priority
        this.project = project
        this.completed = completeStatus
    }

    updateProjectCurrentTaskIndex(){
        const currentTaskIndex = this.project.items.findIndex( (task)=> task == this );
        this.project.currentTaskIndex = currentTaskIndex;
    }

    get name(){
        return this.name
    }
    set name(newName){
        this.name = newName;
    }
    
    get description(){
        return this.#description;
    }
    set description(newDescription){
        this.#description = newDescription
    }

    get dueDate(){
        return format(this.#dueDate, "MM/dd/yyyy")
    }
    set dueDate(dateStr){
        //const year = dateArr[0], monthIndex = dateArr[1] - 1, day = dateArr[2];
        if(dateStr.includes("/")){
            this.#dueDate = parse(dateStr, "MM/dd/yyyy", new Date())
        }else {
            this.#dueDate = parse(dateStr, "yyyy-MM-dd", new Date())
        }

    }

    get priority(){
        return this.#priority;
    }
    set priority(newPriority){
        this.#priority = newPriority;
    }

    toggleCompleted(){
        this.completed = !this.completed;
    };

}




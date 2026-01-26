import { Handler } from "./handler.js";
import { TaskItem } from "./taskItem.js"

export class Project extends Handler{
    constructor(name, description) {
        super();
        this.name = name;
        this.description = description;
        this.currentTask = undefined
    }
    updateName(newName){
        this.name = newName;
    }
    updateDescription(newDescription){
        this.description = newDescription;
    }
    add(title, description, dueDate, priority, completeStatus) {
        const newTask = new TaskItem(title, description, dueDate, priority, completeStatus, this);
        this.items.push(newTask);
        return newTask
    }
}


export class EventHandler{
    
    constructor(dom, projectHandler, storage){
        this.dom = dom;
        this.projectHandler = projectHandler;
        this.addListeners();
        this.projects = [];
        this.currentProject = undefined;
        this.currentTask = {};
        this.storage = storage;

        if (this.storage.projects.len != 0){
            this.storage.projects.forEach((project)=>this.loadFromStorage(project))
        }
    }

    loadFromStorage(project){
        const newProjectObj = this.projectHandler.create(project.projectName, project.projectDescription);
        const newProjectDom = this.dom.renderProject(newProjectObj);
        this.projects.push({"dom": newProjectDom, "obj": newProjectObj});

        for (let taskIndex = 0; taskIndex < project.taskList.length; taskIndex++){
            const task = project.taskList[taskIndex]
            const newTaskObj = newProjectObj.add(task.name, task.description, task.dueDate, task.priority, task.completed);
            this.dom.renderTask(newTaskObj, newProjectDom);
        }
    }

    findIndexOf(title, holder){
        return holder.findIndex(item => item.obj.name == title);
    }

    // callback functions

    projectFormHandler(formData){
        
        const projectTitle = formData.get("title");
        const projectDescription = formData.get("description");

        const newProjectObj = this.projectHandler.create(projectTitle, projectDescription);

        this.storage.addProject(projectTitle, projectDescription);
        const newProjectDOM = this.dom.renderProject(newProjectObj);
        const newProject = {"dom": newProjectDOM, "obj" : newProjectObj};
        this.projects.push(newProject);

    }

    taskFormHandler(event, formData){
        this.projectIndex = event.submitter.dataset.projectIndex;
        //form inputs
        const taskTitle = formData.get("title");
        const taskDescription = formData.get("description");
        const taskDueDate = formData.get("date");
        const taskPriority = formData.get("priority");

        const newTaskObj = this.projectHandler.items[this.projectIndex].add(taskTitle, taskDescription, taskDueDate, taskPriority, false);

        this.storage.addTask(this.projectIndex,taskTitle, taskDescription, taskDueDate, taskPriority, false )
        //render task in dom and add to project dom obj
        this.dom.renderTask(newTaskObj, this.currentProject.dom);

    }

    formHandler(event){

        event.preventDefault();
        const formType = event.target.dataset.type;
        const formData = new FormData(this.dom.form);

        if (formType == "task"){
            this.taskFormHandler(event,formData);
        }
        if (formType == "project"){
            this.projectFormHandler(formData);
        }
        
        this.dom.dialog.remove();

    }

    updateCurrentProject(projectTitle){
        this.projectIndex = this.findIndexOf(projectTitle, this.projects);
        this.currentProject = this.projects[this.projectIndex];
    }

    updateCurrentTask(){
        this.taskIndex = this.currentProject.dom.currentTaskIndex;
        this.currentTask = {"dom": this.currentProject.dom.domTasks[this.taskIndex], "obj": this.currentProject.obj.items[this.taskIndex]};
    }

    deleteTask(fromStorage=true){
        this.taskIndex = this.currentProject.dom.currentTaskIndex;
        this.currentProject.dom.domTasks.splice(this.taskIndex, 1);
        this.currentProject.obj.items.splice(this.taskIndex, 1);
        if (fromStorage==true){
            this.storage.deleteTask(this.projectIndex, this.taskIndex)
        }
        this.currentTask.dom.taskContainer.remove();
    }
    deleteProject(){
        this.currentProject.dom.projectContainer.remove();
        this.projects.splice(this.projectIndex, 1);
        this.projectHandler.items.splice(this.projectIndex, 1);
        this.storage.deleteProject(this.projectIndex)
    }
    //moves the current task to the end of the project
    repositionTask(){
        const taskToMove = this.currentTask
        this.deleteTask(false);
        //push the task obj back into project obj
        this.currentProject.obj.items.push(taskToMove.obj);
        //push the task dom back into project dom
        this.currentProject.dom.domTasks.push(taskToMove.dom);
        //collapses task details
        taskToMove.dom.minimize();
        //re renders the task on the dom
        this.currentProject.dom.projectTasksContainer.appendChild(taskToMove.dom.taskContainer)
    }

    addListeners(){

        //debug button
        const debugButton = document.querySelector("#view-projects");
        debugButton.addEventListener("click", ()=> this.storage.clear())
        debugButton.textContent = "debug"

        document.body.addEventListener("change", (event)=> {
            if (event.target.id == "new-priority-input"){

                this.currentTask.obj.priority = event.target.value;
                this.storage.modifyTask(this.projectIndex, this.taskIndex, undefined, undefined, undefined, event.target.value)
                this.currentTask.dom.updatePriorityElem(this.currentTask.obj.priority);

            }
            if (event.target.id == "new-task-due-date"){

                this.currentTask.obj.dueDate = event.target.value;
                this.storage.modifyTask(this.projectIndex, this.taskIndex, undefined, undefined, event.target.value)
                this.currentTask.dom.updateDueDate(this.currentTask.obj.dueDate);

            }

        })

        document.body.addEventListener("click", (event) => {
            if (event.target.parentElement.id == "task-container" ){
                const projectTitle = event.target.parentElement.parentElement.parentElement.firstChild.textContent;
                this.updateCurrentProject(projectTitle);
                this.updateCurrentTask();

                //closes any open inputs
                this.projects.forEach( (project)=> project.dom.domTasks.forEach( (task)=> task.checkForOpenInputs() ? task.closeOpenInputs() : ""));

                if (event.target.nodeName == "BUTTON"){
                    switch (event.target.id){
                        case ("task-complete-toggle"):
                            if (this.currentTask.obj.completed == false){
                                this.currentTask.obj.completed = true;
                                this.repositionTask()
                            }
                            else if (this.currentTask.obj.completed == true){
                                this.currentTask.obj.completed = false;
                            }
                            this.storage.modifyTask(this.projectIndex, this.taskIndex, undefined, undefined, undefined, undefined, this.currentTask.obj.completed);
                            break;
                        case ("task-details-toggle"):
                            this.currentTask.dom.minimized ? this.currentTask.dom.maximize() : this.currentTask.dom.minimize()
                            break;
                        case ("task-delete-button"):
                            this.deleteTask();
                            break;
                    }
                }
                if (this.currentTask.dom.minimized == false && this.currentTask.obj.completed == false){
                    switch (event.target.id){
                    case ("task-title"):
                            this.currentTask.dom.takeTitleInput();
                            break;
                        case("task-description"):
                            this.currentTask.dom.takeDescriptionInput();
                            break;
                        case("task-due-date"):
                            this.currentTask.dom.takeDueDateInput();
                            break;
                        case("task-priority"):
                            this.currentTask.dom.takePriorityInput();
                            break;
                    }
                }

                
            }


            else if (event.target.parentElement.parentElement.id == "task-container"){
                const projectTitle = event.target.parentElement.parentElement.parentElement.parentElement.firstChild.textContent
                this.updateCurrentProject(projectTitle);
                this.updateCurrentTask();
                
                if (event.target.id == "new-date-cancel"){
                    this.currentTask.dom.removeDueDateInput();  
                }
                else if (event.target.id == "new-priority-cancel"){
                    this.currentTask.dom.removePriorityInput();
                }
                else if (event.target.id == "new-title-submit"){
                    const newTitle = this.currentTask.dom.newTitleInput.value
                    if (newTitle != ""){
                        this.currentTask.obj.name = newTitle
                        this.storage.modifyTask(this.projectIndex, this.taskIndex,newTitle)
                        this.currentTask.dom.updateTitle(true, newTitle);
                    }
                }
                else if (event.target.id == "new-title-cancel"){
                    this.currentTask.dom.updateTitle();
                }
                else if (event.target.id == "new-description-submit"){
                    const newDescription = this.currentTask.dom.newDescriptionInput.value
                    if (newDescription != ""){
                        this.currentTask.obj.description = newDescription;
                        this.storage.modifyTask(this.projectIndex, this.taskIndex, undefined, newDescription)
                        this.currentTask.dom.updateDescription(true, newDescription);
                    }
                }
                else if (event.target.id == "new-description-cancel"){
                    this.currentTask.dom.updateDescription();
                }
            }

            // checks if a dialog is already rendered on the DOM
            else if (document.body.contains(this.dom.dialog) == false){
                // create project button click event
                if (event.target.id == "create-project"){
                    this.dom.CreateForm("project");
                }
                // project button listeners
                else if (event.target.parentElement.id == "project-container"){

                    const DOMProject = event.target.parentElement;
                    const DOMProjectTitle = DOMProject.children[0].textContent;
                    this.projectIndex = this.findIndexOf(DOMProjectTitle, this.projects);
                    this.currentProject = this.projects[this.projectIndex];

                    if (event.target.id == "project-add-task-button"){
                        this.dom.CreateForm("task", this.projectIndex);
                    } else if (event.target.id == "project-del-button"){
                        this.deleteProject();
                    }

                }
            }
            // checks if an form wants to be closed
            else if (event.target.id == "form-cancel-button"){
                this.dom.dialog.remove();
            }

        });

        //checks if form is being submitted
        document.body.addEventListener("submit", (event)=> {
            if (event.target.id == "data-form"){
                this.formHandler(event);
            }
        })

    }
};
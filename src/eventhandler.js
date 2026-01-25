export class EventHandler{
    
    constructor(dom, projectHandler){
        this.dom = dom;
        this.projectHandler = projectHandler;
        this.addListeners();
        this.projects = [];
        this.currentProject = undefined;
        this.currentTask = {};
    }

    findIndexOf(title, holder){
        return holder.findIndex(item => item.obj.name == title);
    }

    // callback functions

    projectFormHandler(formData){
        
        const projectTitle = formData.get("title");
        const projectDescription = formData.get("description");
        const newProjectObj = this.projectHandler.create(projectTitle, projectDescription);

        const newProjectDOM = this.dom.renderProject(newProjectObj);
        const newProject = {"dom": newProjectDOM, "obj" : newProjectObj};
        this.projects.push(newProject);

    }

    taskFormHandler(event, formData){

        //form inputs
        const taskTitle = formData.get("title");
        const taskDescription = formData.get("description");
        const taskDueDate = formData.get("date");
        const taskPriority = formData.get("priority");

        this.projectIndex = event.submitter.dataset.projectIndex;
        //add task obj to project obj

        const newTaskObj = this.projectHandler.items[this.projectIndex].add(taskTitle, taskDescription, taskDueDate, taskPriority);
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
        const taskIndex = this.currentProject.dom.currentTaskIndex;
        this.currentTask = {"dom": this.currentProject.dom.domTasks[taskIndex], "obj": this.currentProject.obj.items[taskIndex]};
    }

    deleteTask(){
        const taskIndex =this.currentProject.dom.currentTaskIndex;
        this.currentProject.dom.domTasks.splice(taskIndex, 1);
        this.currentProject.obj.items.splice(taskIndex, 1);
        this.currentTask.dom.taskContainer.remove();
    }
    deleteProject(){
        this.currentProject.dom.projectContainer.remove();
        this.projects.splice(this.projectIndex, 1);
    }
    //moves the current task to the end of the project
    repositionTask(){
        const taskToMove = this.currentTask
        this.deleteTask()
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
        debugButton.addEventListener("click", ()=> localStorage.removeItem("projects"))
        debugButton.textContent = "debug"

        document.body.addEventListener("change", (event)=> {
            if (event.target.id == "new-priority-input"){

                this.currentTask.obj.priority = event.target.value;
                this.currentTask.dom.updatePriorityElem(this.currentTask.obj.priority);

            }
            if (event.target.id == "new-task-due-date"){

                this.currentTask.obj.dueDate = event.target.value;
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
                                this.currentTask.obj.completed = true
                                this.repositionTask()
                            }
                            else if (this.currentTask.obj.completed == true){
                                this.currentTask.obj.completed = false
                            }
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
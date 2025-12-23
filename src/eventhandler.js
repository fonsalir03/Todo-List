export class EventHandler{
    
    constructor(dom, projectHandler){
        this.dom = dom
        this.projectHandler = projectHandler;
        this.addListeners(this.dom)
        this.projects = []
        this.currentProject = undefined
        this.currentTask = {}
    }

    findIndexOf(title, holder){
        return holder.findIndex(item => item.obj.name == title)
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

        const projectIndex = event.submitter.dataset.projectIndex;

        //add task obj to project obj
        const newTaskObj = this.projectHandler.items[projectIndex].add(taskTitle, taskDescription, taskDueDate, taskPriority);
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
        const projectIndex = this.findIndexOf(projectTitle, this.projects);
        this.currentProject = this.projects[projectIndex];
    }
    updateCurrentTask(){
        const taskIndex = this.currentProject.dom.currentTaskIndex;
        this.currentTask = {"dom": this.currentProject.dom.domTasks[taskIndex], "obj": this.currentProject.obj.items[taskIndex]};
    }

    addListeners(){

        //debug button
        const debugButton = document.querySelector("#view-projects");
        debugButton.textContent = "debug"
        debugButton.addEventListener("click", ()=> console.log(this.currentTask.dom.updatePriorityElem("high")))

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
                            console.log("toggle the complete property");
                            break;
                        case ("task-details-toggle"):
                            console.log("toggle the min and max methods");
                            break;
                        case ("task-delete-button"):
                            console.log("delete this task");
                            break;
                    }
                }
                
                switch (event.target.id){
                    case ("task-title"):
                        this.currentTask.dom.takeTitleInput();
                        break;
                    case("task-description"):
                        console.log("user wants to edit the task description");
                        break;
                    case("task-due-date"):
                        this.currentTask.dom.takeDueDateInput();
                        break;
                    case("task-priority"):
                        this.currentTask.dom.takePriorityInput();
                        break;
                }
                
            } 
            else if (event.target.parentElement.parentElement.id == "task-container"){
                const projectTitle = event.target.parentElement.parentElement.parentElement.parentElement.firstChild.textContent
                this.updateCurrentProject(projectTitle);
                this.updateCurrentTask()
                
                if (event.target.id == "new-date-cancel"){
                    this.currentTask.dom.removeDueDateInput();  
                }
                if (event.target.id == "new-priority-cancel"){
                    this.currentTask.dom.removePriorityInput();
                }
            }

            // checks if a dialog is already rendered on the DOM
            else if (document.body.contains(this.dom.dialog) == false){
                // create project button click event
                if (event.target.id == "create-project"){
                    this.dom.CreateForm("project");
                }
                // create task button click event
                else if (event.target.id == "project-add-task-button"){

                    const DOMProject = event.target.parentElement;
                    const DOMProjectTitle = DOMProject.children[0].textContent;
                    const projectIndex = this.findIndexOf(DOMProjectTitle, this.projects);
                    this.currentProject = this.projects[projectIndex]

                    this.dom.CreateForm("task", projectIndex)

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
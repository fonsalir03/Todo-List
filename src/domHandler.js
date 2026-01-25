
class DOMProject {
    constructor(){
        this.createProjectContainers();
        this.domTasks = [];
        this.currentTaskIndex = undefined;
    }

    createProjectContainers(){
    
    // project container
    this.projectContainer = document.createElement("div");
    this.projectContainer.setAttribute("id", "project-container");

    // project title container
    this.projectTitleContainer = document.createElement("div");
    this.projectTitleContainer.setAttribute("id", "project-title");
    this.projectContainer.appendChild(this.projectTitleContainer);

    // project description
    this.projectDescription = document.createElement("div");
    this.projectDescription.setAttribute("id", "project-description");
    this.projectDescription.hidden = true;
    this.projectContainer.appendChild(this.projectDescription);

    // project add task button
    this.projectAddTaskButton = document.createElement("button");
    this.projectAddTaskButton.textContent = "+";
    this.projectAddTaskButton.setAttribute("id", "project-add-task-button");
    this.projectContainer.appendChild(this.projectAddTaskButton);

    // project delete task button
    this.projectDel = document.createElement("button");
    this.projectDel.textContent = "X";
    this.projectDel.setAttribute("id", "project-del-button");
    this.projectContainer.appendChild(this.projectDel);

    // project task container
    this.projectTasksContainer = document.createElement("div");
    this.projectTasksContainer.setAttribute("id", "project-tasks-container");
    this.projectContainer.appendChild(this.projectTasksContainer);
    
    }

}

// DOMTask(DOMProject)
class DOMTask {
    constructor(DOMProject){
        this.project = DOMProject;
        this.createContainersAndButtons();
        this.inEditMode = {"title": false, "description": false, "dueDate": false, "priority": false};
        this.minimized = undefined
        this.minimize();
    }

    appendChildren(){
        this.taskContainer.appendChild(this.taskTitleContainer);
        this.taskContainer.appendChild(this.taskDescriptionContainer);
        this.taskContainer.appendChild(this.taskDuedateContainer);
        this.taskContainer.appendChild(this.taskPriorityContainer);
        this.taskContainer.appendChild(this.taskCompletedToggle);
        this.taskContainer.appendChild(this.fullDetailsToggle);
        this.taskContainer.appendChild(this.taskDeleteButton);
    }

    createContainersAndButtons() {
    
    // taskContainer
    this.taskContainer = document.createElement("div");
    this.taskContainer.setAttribute("id", "task-container");
    this.taskContainer.addEventListener("click" , ()=> {
        
        const taskIndex = this.project.domTasks.findIndex( (task)=> task == this );
        this.project.currentTaskIndex = taskIndex;

    })

    // taskTitleContainer : persistent
    this.taskTitleContainer = document.createElement("div");
    this.taskTitleContainer.setAttribute("id", "task-title");

    // taskDescriptionContainer
    this.taskDescriptionContainer = document.createElement("div");
    this.taskDescriptionContainer.setAttribute("id", "task-description");

    // taskDuedateContainer : persistent
    this.taskDuedateContainer = document.createElement("div");
    this.taskDuedateContainer.setAttribute("id", "task-due-date");

    //priorityContainer
    this.taskPriorityContainer = document.createElement("div");
    this.taskPriorityContainer.setAttribute("id", "task-priority");

    // taskCompletedToggle
    this.taskCompletedToggle = document.createElement("button");
    this.taskCompletedToggle.textContent = "✓"
    this.taskCompletedToggle.setAttribute("id", "task-complete-toggle");

    // fulldetailsToggle : persistent
    this.fullDetailsToggle = document.createElement("button");
    this.fullDetailsToggle.setAttribute("id", "task-details-toggle");
    
    // taskDeleteButton
    this.taskDeleteButton = document.createElement("button");
    this.taskDeleteButton.textContent = "delete"
    this.taskDeleteButton.setAttribute("id", "task-delete-button");
    
    this.appendChildren();
    // project-task-container
    this.project.projectTasksContainer.appendChild(this.taskContainer);

    }

    //minimize() will hide all non persistent elements
    minimize() {
        this.minimized = true;
        this.fullDetailsToggle.textContent = "▼"

        this.taskDescriptionContainer.hidden = true;
        this.taskPriorityContainer.hidden = true;
        this.taskCompletedToggle.hidden = true;
        this.taskDeleteButton.hidden = true;
    }
    //maximize() will unhide all non persitent elements
    maximize() {
        this.minimized = false;
        this.fullDetailsToggle.textContent = "▲"

        this.taskDescriptionContainer.hidden = false;
        this.taskPriorityContainer.hidden = false;
        this.taskCompletedToggle.hidden = false;
        this.taskDeleteButton.hidden = false;
    }

    takeTitleInput(){
        this.inEditMode.title = true
        //grab the title element through this
        //store the old value
        this.oldTitle = this.taskTitleContainer.textContent;
        //clear out the container
        this.taskTitleContainer.textContent = "";
        //create the input element
        this.newTitleInput = document.createElement("input");
        this.newTitleInput.setAttribute("id", "new-title-input");
        this.newTitleInput.setAttribute("type", "text");
        //create the submit button
        this.newTitleSubmit = document.createElement("button");
        this.newTitleSubmit.setAttribute("id", "new-title-submit")
        this.newTitleSubmit.textContent = "✓";
        //create the cancel button
        this.newTitleCancel = document.createElement("button");
        this.newTitleCancel.setAttribute("id", "new-title-cancel");
        this.newTitleCancel.textContent = "x";

        this.taskTitleContainer.appendChild(this.newTitleInput);
        this.taskTitleContainer.appendChild(this.newTitleSubmit)
        this.taskTitleContainer.appendChild(this.newTitleCancel);
    }
     
    updateTitle(modify=false, newValue = ""){
        this.taskTitleContainer.removeChild(this.newTitleInput);        
        this.taskTitleContainer.removeChild(this.newTitleSubmit);
        this.taskTitleContainer.removeChild(this.newTitleCancel);

        if (modify == true){
            this.taskTitleContainer.textContent = newValue;
        } else{
            this.taskTitleContainer.textContent = this.oldTitle;
        }
        this.inEditMode.title = false;
    }

    takeDescriptionInput(){
        this.inEditMode.description = true;
        //store the old value
        this.oldDescription = this.taskDescriptionContainer.textContent;
        this.taskDescriptionContainer.textContent = ""
        //create input element
        this.newDescriptionInput = document.createElement("textarea");
        //create submit button
        this.newDescriptionSubmit = document.createElement("button");
        this.newDescriptionSubmit.setAttribute("id", "new-description-submit");
        this.newDescriptionSubmit.textContent = "✓"
        //create cancel button
        this.newDescriptionCancel = document.createElement("button");
        this.newDescriptionCancel.setAttribute("id", "new-description-cancel");
        this.newDescriptionCancel.textContent = "X"
        //append the children
        this.taskDescriptionContainer.appendChild(this.newDescriptionInput);
        this.taskDescriptionContainer.appendChild(this.newDescriptionSubmit);
        this.taskDescriptionContainer.appendChild(this.newDescriptionCancel);
    }

    updateDescription(modify=false, newVal=""){
        this.taskDescriptionContainer.removeChild(this.newDescriptionInput);
        this.taskDescriptionContainer.removeChild(this.newDescriptionSubmit);
        this.taskDescriptionContainer.removeChild(this.newDescriptionCancel);
        
        if (modify==true){
            this.taskDescriptionContainer.textContent = newVal;
        } else {
            this.taskDescriptionContainer.textContent = this.oldDescription;
        }
        
        this.inEditMode.description = false;
    }

    takeDueDateInput(){
        if (this.taskDuedateContainer.children.length == 0){
            this.inEditMode.dueDate = true;

            this.oldDueDateValue = this.taskDuedateContainer.textContent;
            // clear out old date
            this.taskDuedateContainer.textContent = "";
            //creation of the date picker
            this.newDateInput = document.createElement("input");
            this.newDateInput.setAttribute("type", "date");
            this.newDateInput.setAttribute("id", "new-task-due-date");
            //creation of the cancel button
            this.newDateCancel = document.createElement("button");
            this.newDateCancel.setAttribute("id", "new-date-cancel");

            this.taskDuedateContainer.appendChild(this.newDateInput);
            this.taskDuedateContainer.appendChild(this.newDateCancel);
        }
    }
    removeDueDateInput(){
        this.inEditMode.dueDate = false;

        this.taskDuedateContainer.removeChild(this.newDateInput);
        this.taskDuedateContainer.removeChild(this.newDateCancel);
        this.taskDuedateContainer.textContent = this.oldDueDateValue;
    }

    updateDueDate(newDate){
        this.removeDueDateInput();
        this.taskDuedateContainer.textContent = newDate;
    }

    takePriorityInput(){
        this.inEditMode.priority = true;

        this.oldPriorityContainerVal = this.taskPriorityContainer.textContent
        this.taskPriorityContainer.textContent = "";
        //create the input element (same as the form input, select element with option nested elements)
        this.priorityInput = document.createElement("select");
        this.priorityInput.setAttribute("id", "new-priority-input");
        this.priorityInput.setAttribute("name", "new-priority");

        //options
        this.priorityInputOptionPlaceholder = document.createElement("option");
        this.priorityInputOptionPlaceholder.textContent = "how urgent is this task?";
        this.priorityInputOptionPlaceholder.value = ""

        this.priorityInputOptionLow = document.createElement("option");
        this.priorityInputOptionLow.textContent = "low";
        this.priorityInputOptionLow.value = "low"

        this.priorityInputOptionMed = document.createElement("option");
        this.priorityInputOptionMed.value = "medium";
        this.priorityInputOptionMed.textContent = "medium";

        this.priorityInputOptionHigh = document.createElement("option");
        this.priorityInputOptionHigh.value = "high";
        this.priorityInputOptionHigh.textContent = "high";

        //create cancel button
        this.priorityInputCancel = document.createElement("button");
        this.priorityInputCancel.setAttribute("id", "new-priority-cancel");

        //append the options
        this.priorityInput.appendChild(this.priorityInputOptionPlaceholder);
        this.priorityInput.appendChild(this.priorityInputOptionLow);
        this.priorityInput.appendChild(this.priorityInputOptionMed);
        this.priorityInput.appendChild(this.priorityInputOptionHigh);
        //append the input element to the priority containers
        this.taskPriorityContainer.appendChild(this.priorityInput);
        //append the cancel button
        this.taskPriorityContainer.appendChild(this.priorityInputCancel);
    }

    removePriorityInput(){
        this.inEditMode.priority = false;

        this.taskPriorityContainer.removeChild(this.priorityInputCancel);
        this.taskPriorityContainer.removeChild(this.priorityInput);
        this.taskPriorityContainer.textContent = this.oldPriorityContainerVal;
    }

    updatePriorityElem(newVal){
        this.removePriorityInput()
        this.taskPriorityContainer.textContent = `priority: ${newVal}`
        //1: low, 2: medium, 3: high/urgent
        //change the task container background or border color
    }

    checkForOpenInputs(){
        this.hasOpenInputs = Object.values(this.inEditMode).some(el => el == true)
        return this.hasOpenInputs;
    }

    closeOpenInputs(){
        if (this.inEditMode.dueDate == true){
            this.removeDueDateInput();
        }
        if (this.inEditMode.priority == true){
            this.removePriorityInput();
        }
        if (this.inEditMode.title == true){
            this.updateTitle();
        }
        if (this.inEditMode.description == true){
            this.updateDescription();
        }
    }
}

export class DomHandler{

    constructor(){
        // content that is constant to the page
        this.CreateMainContainers();
        this.CreateToolbarButtons();
        //testing

        document.body.appendChild(this.mainContentDiv);
    }
    
    CreateMainContainers(){

        //main container
        this.mainContentDiv = document.createElement("div");
        this.mainContentDiv.setAttribute("id", "main-content");

        //toolbar 
        this.toolbarDiv = document.createElement("div");
        this.toolbarDiv.setAttribute("id", "toolbar");
        this.mainContentDiv.appendChild(this.toolbarDiv);

        //task item section
        this.taskSectionDiv = document.createElement("div");
        this.taskSectionDiv.setAttribute("id", "task-buttons");
        this.toolbarDiv.appendChild(this.taskSectionDiv);

        //project section
        this.projectSectionDiv = document.createElement("div");
        this.projectSectionDiv.setAttribute("id", "project-buttons");
        this.toolbarDiv.appendChild(this.projectSectionDiv);

        //viewer
        this.viewerDiv = document.createElement("div");
        this.viewerDiv.setAttribute("id", "viewer");
        this.mainContentDiv.appendChild(this.viewerDiv);
        
    }

    CreateToolbarButtons(){

        //create project button
        this.createProjectButton = document.createElement("button");
        this.createProjectButton.setAttribute("id", "create-project");
        this.createProjectButton.textContent = "Create Project";
        this.projectSectionDiv.appendChild(this.createProjectButton);

        //view projects button
        this.viewProjectsButton = document.createElement("button");
        this.viewProjectsButton.setAttribute("id", "view-projects");
        this.viewProjectsButton.textContent = "All Projects";
        this.projectSectionDiv.appendChild(this.viewProjectsButton);
    }

    CreateForm(type, projectIndex){
        //check for if the form is for a task item or project

        // dialog
        this.dialog = document.createElement("dialog");
        this.dialog.setAttribute("id", "data-dialog");

        // form
        this.form = document.createElement("form");
        this.form.setAttribute("id", "data-form");
        this.form.setAttribute("data-type", type);
        this.dialog.appendChild(this.form);

        //  form title
        this.formTitleInput = document.createElement("input");
        this.formTitleInput.setAttribute("type", "text");
        this.formTitleInput.setAttribute("id", "form-title");
        this.formTitleInput.setAttribute("required", "");
        this.formTitleInput.setAttribute("name", "title");
        this.form.appendChild(this.formTitleInput);

        //  form description
        this.formDescriptionInput = document.createElement("textarea");
        this.formDescriptionInput.setAttribute("id", "form-description");
        this.formDescriptionInput.setAttribute("name","description");
        this.form.appendChild(this.formDescriptionInput);

        if (type == "task"){
            //  form date picker
            this.formDateInput = document.createElement("input");
            this.formDateInput.setAttribute("type", "date");
            this.formDateInput.setAttribute("id", "form-date");
            this.formDateInput.setAttribute("required", "");
            this.formDateInput.setAttribute("name", "date");
            this.form.appendChild(this.formDateInput);

            //  priority
            this.formPriorityLabel = document.createElement("label");
            this.formPriorityLabel.textContent = "How important is this task?";
            this.formPriorityLabel.setAttribute("for","priority");
            this.form.appendChild(this.formPriorityLabel);

            //  create the priority selection
            this.formPriority = document.createElement("select");
            this.formPriority.setAttribute("name", "priority");

            // priority option 1 : low
            this.formPriorityOption1 = document.createElement("option");
            this.formPriorityOption1.value = "low";
            this.formPriorityOption1.textContent = "low";
            this.formPriority.appendChild(this.formPriorityOption1);

            // priority option 2 : medium
            this.formPriorityOption2 = document.createElement("option");
            this.formPriorityOption2.value = "medium";
            this.formPriorityOption2.textContent = "medium";
            this.formPriority.appendChild(this.formPriorityOption2);

            // priority option 3 : high
            this.formPriorityOption3 = document.createElement("option");
            this.formPriorityOption3.value = "high";
            this.formPriorityOption3.textContent = "high";
            this.formPriority.appendChild(this.formPriorityOption3);

            this.form.appendChild(this.formPriority);
        }
        
        //Submit button
        this.formSubmitButton = document.createElement("button");
        this.formSubmitButton.setAttribute("id", "form-submit-button");
        this.formSubmitButton.setAttribute("data-project-index", projectIndex)
        this.formSubmitButton.textContent = "Submit";
        this.form.appendChild(this.formSubmitButton);       

        //  create the Cancel button
        this.formCancelButton = document.createElement("button");
        this.formCancelButton.setAttribute("id", "form-cancel-button");
        this.formCancelButton.textContent = "Cancel";
        this.dialog.appendChild(this.formCancelButton);

        document.body.appendChild(this.dialog);
        this.dialog.show();
    }

    // RenderProject(projectInstance)
    renderProject(project){
        const newDOMProject = new DOMProject();

        newDOMProject.projectTitleContainer.textContent = project.name;
        if (project.description != ""){
            newDOMProject.projectDescription.textContent = project.description;
            newDOMProject.projectDescription.hidden = false;
        }
        
        this.viewerDiv.appendChild(newDOMProject.projectContainer);
        return newDOMProject
    }

    renderTask(taskObj, DOMProject){
        const newDOMTask = new DOMTask(DOMProject);
        DOMProject.domTasks.push(newDOMTask);

        newDOMTask.taskTitleContainer.textContent = taskObj.name;
        newDOMTask.taskDescriptionContainer.textContent = taskObj.description;
        newDOMTask.taskDuedateContainer.textContent = taskObj.dueDate;
        newDOMTask.taskPriorityContainer.textContent = "priority: " + taskObj.priority
        //project task item container

    }
}
import { Project } from "./project.js";

import { DomHandler } from "./domHandler.js"
import { EventHandler } from "./eventhandler.js"
import { Handler } from "./handler.js"

import { StorageHandler } from "./storageHandler.js";

import "./styles.css";

const domHandler = new DomHandler();
const projectHandler = new Handler();
const storage = new StorageHandler();
const eventHandler = new EventHandler(domHandler, projectHandler, storage);

//create the default project
if (JSON.parse(localStorage.getItem("projects")).length == 0){
    //generate default project
    const defaultProject = eventHandler.newProject("My Project", "This project contains tasks that are set to be completed");
    eventHandler.currentProject = defaultProject
    eventHandler.newTask(0, "buy a penguin", "I need to buy a penguin, but only from the African Sahara", "2025-11-21", "high", false)
    eventHandler.newTask(0, "walk my fish", "My fish has been skipping leg day recently, I need to make sure he is getting the exersize he needs!", "2025-11-21", "low", false)
    eventHandler.newTask(0, "finish the odin project", "I want to finish The Odin Project so I can make awesome applications and tools!", "2027-12-15", "high", false)
}
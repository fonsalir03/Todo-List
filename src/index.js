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
//DB DECLARATION
window.db 	= {};

db.tasksSerial = 3;
db.tasks 	= {
	1: {id: 1, parentId: 2,name: 'Creating objects', started: false, total: 64},
	2: {id: 2, parentId: 1,name: 'Creating view', started: false, total: 3},
	3: {id: 3, parentId: 1,name: 'Creating routes', started: false, total: 17}
};

db.listsSerial = 3;
db.lists 	= {
	1: {id: 1, parentId: 3,name: 'ToDo', tasks: [db.tasks[2], db.tasks[3]]},
	2: {id: 2, parentId: 3,name: 'Doing', tasks: [db.tasks[1]]},
	3: {id: 3, parentId: 3,name: 'Done'}
};

db.boardsSerial = 3;
db.boards 	= {
	1: {id: 1, name: 'Development'},
	2: {id: 2, name: 'Marketing'},
	3: {id: 3, name: 'Sales', lists: [db.lists[1], db.lists[2], db.lists[3]] }
};




//LOGGING API
var apilogging = true;
function apiLog (result, params){

	if(apilogging){
		console.log(params.type + ' ' + params.url, result);
	}

	return result;
}
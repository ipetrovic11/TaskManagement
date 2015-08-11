//DB DECLARATION
window.db 	= {};

db.listsSerial = 3;
db.lists 	= {
	1: {id: 1, name: 'ToDo'},
	2: {id: 2, name: 'Doing'},
	3: {id: 3, name: 'Done'}
};

db.boardsSerial = 3;
db.boards 	= {
	1: {id: 1, name: 'Development'},
	2: {id: 2, name: 'Marketing'},
	3: {id: 3, name: 'Sales', lists: [db.lists[1], db.lists[2], db.lists[3]] }
};

db.tasksSerial = 3;
db.task 	= {};




//LOGGING API
var apilogging = true;
function apiLog (result, params){

	if(apilogging){
		console.log(params.type + ' ' + params.url, result);
	}

	return result;
}
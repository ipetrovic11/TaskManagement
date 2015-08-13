Task = can.Model.extend({

	//API calls
	findAll: 	'GET /tasks',
	findOne:  	'GET /tasks/{id}',
	create: 	'POST /tasks',
	update: 	'PUT /tasks/{id}',
	destroy: 	'DELETE /tasks/{id}',

	//Parsing function in case that we need them
	parseModels: function(data, xhr){
		return data;
	},
	parseModel: function(data, xhr){
		return data;
	}

},{

	/*
		customDestroy will destroy it self and if there is event it will be stoped
		from propagation
	*/
	customDestroy: function(context, el, value){
		value.stopPropagation();
		this.destroy();
	},

});


/*
	Fixture for Task model for parsing all API calls 
	to DB so it can be loaded later
*/
can.fixture({
	'GET /tasks': function (params){
		var tasks = Object.keys(db.tasks).map(function (key) {return db.tasks[key]});
		return apiLog(tasks, params);
	},

	'GET /tasks/{id}': function (params){
		var task = db.tasks[params.data.id];
		return apiLog(task, params);
	},

	'POST /tasks': function (params){
		db.tasksSerial++;
		db.tasks[db.tasksSerial] = {
			id: db.tasksSerial, 
			name: params.data.name, 
			parentId: params.data.parentId,
			started: params.data.started,
			total: params.data.total
		}
		if(!db.lists[params.data.parentId].tasks){
			db.lists[params.data.parentId].tasks = [];
		}
		db.lists[params.data.parentId].tasks.push(db.tasks[db.tasksSerial]);
		var result = {id: db.tasksSerial};
		return apiLog(result, params);
	},

	'PUT /tasks/{id}': function (params){
		var task = db.tasks[params.data.id];
		task.name 		= params.data.name;
		task.parentId 	= params.data.parentId;
		task.started 	= params.data.started;
		task.total 		= params.data.total;
		var result = {};
		return apiLog(result, params);
	},

	'DELETE /tasks/{id}': function (params){
		var task = db.tasks[params.data.id];
		//Removeing reference form parent
		for(var i in db.lists[task.parentId].tasks){
			if(db.lists[task.parentId].tasks[i].id == task.id){
				delete db.lists[task.parentId].tasks.splice(i, 1);
			}
		}
		delete db.tasks[params.data.id];
		var result = {};
		return apiLog(result, params);
	}
});

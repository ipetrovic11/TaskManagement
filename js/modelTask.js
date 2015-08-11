List = can.Model.extend({

	//API
	findAll: 	'GET /tasks',
	findOne:  	'GET /tasks/{id}',
	create: 	'POST /tasks',
	update: 	'PUT /tasks/{id}',
	destroy: 	'DELETE /tasks/{id}',

	//PARSE
	parseModels: function(data, xhr){
		return data;
	},
	parseModel: function(data, xhr){
		return data;
	}

},{});


//API REQUESTS
can.fixture('GET /tasks', function (params){

	var tasks = Object.keys(db.tasks).map(function (key) {return db.tasks[key]});

	return apiLog(tasks, tasks);
});

can.fixture('GET /tasks/{id}', function (params){

	var task = db.tasks[params.data.id];

	return apiLog(task, params);
});

can.fixture('POST /tasks', function (params){

	db.tasksSerial++;
	db.tasks[db.tasksSerial] = {id: db.tasksSerial, name: params.data.name}

	var result = {id: db.tasksSerial};

	return apiLog(result, params);
});

can.fixture('PUT /tasks/{id}', function (params){

	var task = db.tasks[params.data.id];

	task.name = params.data.name;


	var result = {};

	return apiLog(result, params);
});

can.fixture('DELETE /tasks/{id}', function (params){

	delete db.tasks[params.data.id];

	var result = {};

	return apiLog(result, params);
});

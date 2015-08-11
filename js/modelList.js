List = can.Model.extend({

	//Neasted(assosiated models and serialisation)
	attributes: {
		tasks: 'Task.models'
	},

	//API
	findAll: 	'GET /lists',
	findOne:  	'GET /lists/{id}',
	create: 	'POST /lists',
	update: 	'PUT /lists/{id}',
	destroy: 	'DELETE /lists/{id}',

	//PARSE
	parseModels: function(data, xhr){
		return data;
	},
	parseModel: function(data, xhr){
		return data;
	}
},{
	customSave: function(){
		this.save().then(function(list){
			if(list.tasks){
				list.tasks.each(function(task){
					task.save();
				});
			}
		});
	},
	//WITH REAL API(AJAX) WILL HAVE TO CHECK IF THIS WILL WORK BECAUSE OF ASYNC
	customDestroy: function(){
		if(this.tasks){
			this.tasks.each(function(task){
				task.destroy();
			});
		}
		this.destroy();
	}

});


//API REQUESTS
can.fixture('GET /lists', function (params){

	var lists = Object.keys(db.lists).map(function (key) {return db.lists[key]});

	return apiLog(lists, params);
});

can.fixture('GET /lists/{id}', function (params){

	var list = db.lists[params.data.id];

	return apiLog(list, params);
});

can.fixture('POST /lists', function (params){

	db.listsSerial++;
	db.lists[db.listsSerial] = {id: db.listsSerial, name: params.data.name}

	var result = {id: db.listsSerial};

	return apiLog(result, params);
});

can.fixture('PUT /lists/{id}', function (params){

	var list = db.lists[params.data.id];

	list.name = params.data.name;
	list.tasks = params.data.tasks;

	//Deserialisation for DB
	for(var i in list.tasks){
		list.tasks[i] = db.tasks[list.tasks[i].id];
	}

	var result = {};

	return apiLog(result, params);
});

can.fixture('DELETE /lists/{id}', function (params){

	var list = db.lists[params.data.id];

	for(var i in list.tasks){
		delete db.tasks[list.tasks[i].id];
	}

	//Removeing reference form parent
	for(var i in db.boards[list.parentId].lists){
		if(db.boards[list.parentId].lists[i].id == list.id){
			db.boards[list.parentId].lists.splice(i, 1);
		}
	}

	delete db.lists[params.data.id];

	var result = {};

	return apiLog(result, params);
});

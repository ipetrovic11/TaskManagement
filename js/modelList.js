List = can.Model.extend({

	//Neasted(assosiated models and serialisation)
	attributes: {
		lists: 'Task.models'
	},
	convert: {
		'Task.models': function (val){

			var serialization = [];

			for(var i =0; i< val.length; i++){
				serialization.push(val[i].id);
			}

			return serialization;
		}
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

	delete db.lists[params.data.id];

	var result = {};

	return apiLog(result, params);
});

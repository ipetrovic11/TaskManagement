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
	customDestroy: function(context, el, value){
		if(value)
			value.stopPropagation();

		if(this.attr('tasks')){
			this.attr('tasks').each(function(task){
				task.destroy();
			});
		}
		this.destroy();
	},
	//RETURNING CURENT NUMBER OF TASKS IN LIST
	tasksNumber: function(){
		return this.attr('tasks')? this.attr('tasks').attr('length') : 0;
	},
	//COUNTING TOTAL TIME IN ALL TASKS IN LIST
	timeSpent: function(){
		var total = 0;
		if(this.attr('tasks')){
			for(var i = 0; i<this.attr('tasks').attr('length'); i++){
				total += this.attr('tasks')[i].attr('total');
			}
		}

		return total;
	}

});

//API REQUESTS
can.fixture({
	'GET /lists': function (params){
		var lists = Object.keys(db.lists).map(function (key) {return db.lists[key]});
		return apiLog(lists, params);
	},


	'GET /lists/{id}': function (params){
		var list = db.lists[params.data.id];
		return apiLog(list, params);
	},


	'POST /lists': function (params){
		db.listsSerial++;
		db.lists[db.listsSerial] = {id: db.listsSerial, name: params.data.name, parentId: params.data.parentId};
		if(!db.boards[params.data.parentId].lists){
			db.boards[params.data.parentId].lists = [];
		}
		db.boards[params.data.parentId].lists.push(db.lists[db.listsSerial]);
		var result = {id: db.listsSerial};
		return apiLog(result, params);
	},


	'PUT /lists/{id}': function (params){
		var list = db.lists[params.data.id];
		list.name = params.data.name;
		list.tasks = params.data.tasks;
		//Deserialisation for DB
		for(var i in list.tasks){
			list.tasks[i] = db.tasks[list.tasks[i].id];
		}
		var result = {};
		return apiLog(result, params);
	},


	'DELETE /lists/{id}': function (params){
		var list = db.lists[params.data.id];
		//Deleting all sub tasks
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
	}
});

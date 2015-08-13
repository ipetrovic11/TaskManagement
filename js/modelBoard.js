Board = can.Model.extend({
	
	//Neasted, sub lists
	attributes: {
		lists: 'List.models'
	},

	//API calls
	findAll: 	'GET /boards',
	findOne:  	'GET /boards/{id}',
	create: 	'POST /boards',
	update: 	'PUT /boards/{id}',
	destroy: 	'DELETE /boards/{id}',

	//Parsing function in case that we need them
	parseModels: function(data, xhr){
		return data;
	},
	parseModel: function(data, xhr){
		return data;
	}
},{
	/*
		customSave will go thru all sub lists and save them 
		as well as it self
	*/
	customSave: function(){
		this.save().then(function(board){
			if(board.lists){
				board.lists.each(function(list){
					list.customSave();
				})
			}
		});
	},

	/*
		customDestroy will go thru all sub lists and destroy them 
		as well as it self, if there is event it will be stoped
		from propagation
	*/
	customDestroy: function(context, el, value){
		if(value)
			value.stopPropagation();

		if(this.lists){
			this.lists.each(function(list){
				list.customDestroy();
			});
		}
		this.destroy();
	},

	/*
		listsNumber will return current number of sub lists
		with event delegation
	*/
	listsNumber: function(){
		return this.attr('lists')? this.attr('lists').attr('length') : 0;
	},


	/*
		tasksNumber will return current number of sub tasks
		in all sub lists together, with event delegation
	*/
	tasksNumber:function(){
		var total = 0;
		if(this.attr('lists')){
			for(var i = 0; i<this.attr('lists').attr('length'); i++){
				total += this.attr('lists')[i].tasksNumber();
			}
		}
		return total;
	},

	/*
		timeSpent will return total time that is spent
		on all sub lists together
	*/
	timeSpent:function(){
		var total = 0;
		if(this.attr('lists')){
			for(var i = 0; i<this.attr('lists').attr('length'); i++){
				total += this.attr('lists')[i].timeSpent();
			}
		}
		return total;
	}

});


/*
	Fixture for Board model for parsing all APIS calls
	to DB so it can be loaded later
*/
can.fixture({
	'GET /boards': function (params){
		var boards = Object.keys(db.boards).map(function (key) {return db.boards[key]});
		return apiLog(boards, params);
	},


	'GET /boards/{id}': function (params){
		var board = db.boards[params.data.id];
		return apiLog(board, params);
	},


	'POST /boards': function (params){
		db.boardsSerial++;
		db.boards[db.boardsSerial] = {id: db.boardsSerial, name: params.data.name}
		var result = {id: db.boardsSerial};
		return apiLog(result, params);
	},


	'PUT /boards/{id}': function (params){
		var board = db.boards[params.data.id];
		board.name = params.data.name;
		board.lists = params.data.lists;
		//Deserialisation for DB
		for(var i in board.lists){
			board.lists[i] = db.lists[board.lists[i].id];
		}
		var result = {};
		return apiLog(result, params);
	},


	'DELETE /boards/{id}': function (params){
		var board = db.boards[params.data.id];
		//Deleting all sub lists and sub tasks
		for(var i in board.lists){
			var list = board.lists[i];
			for(var i in list.tasks){
				delete db.tasks[list.tasks[i].id];
			}
			delete db.lists[board.lists[i].id]
		}
		delete db.boards[params.data.id];
		var result = {};
		return apiLog(result, params);
	}
})








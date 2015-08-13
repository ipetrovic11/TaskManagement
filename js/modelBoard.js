Board = can.Model.extend({
	
	//Neasted(assosiated models and serialisation)
	attributes: {
		lists: 'List.models'
	},

	//API
	findAll: 	'GET /boards',
	findOne:  	'GET /boards/{id}',
	create: 	'POST /boards',
	update: 	'PUT /boards/{id}',
	destroy: 	'DELETE /boards/{id}',

	//PARSE
	parseModels: function(data, xhr){
		return data;
	},
	parseModel: function(data, xhr){
		return data;
	}
},{
	customSave: function(){
		this.save().then(function(board){
			if(board.lists){
				board.lists.each(function(list){
					list.customSave();
				})
			}
		});
	},
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
	//RETURNING CURENT NUMBER OF LISTS IN BOARD
	listsNumber: function(){
		return this.attr('lists')? this.attr('lists').attr('length') : 0;
	},
	//COUNTING TOTAL TASK IN ALL LISTS IN BOARD
	tasksNumber:function(){
		var total = 0;
		if(this.attr('lists')){
			for(var i = 0; i<this.attr('lists').attr('length'); i++){
				total += this.attr('lists')[i].tasksNumber();
			}
		}
		return total;
	},
	//COUNTING TOTAL TIME IN ALL TASKS IN ALL LISTS IN BOARD
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


//API REQUESTS
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








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
	//WITH REAL API(AJAX) WILL HAVE TO CHECK IF THIS WILL WORK BECAUSE OF ASYNC
	customDestroy: function(){
		if(this.lists){
			this.lists.each(function(list){
				list.customDestroy();
			});
		}
		this.destroy();
	}

});


//API REQUESTS
can.fixture('GET /boards', function (params){

	var boards = Object.keys(db.boards).map(function (key) {return db.boards[key]});

	return apiLog(boards, params);
});

can.fixture('GET /boards/{id}', function (params){

	var board = db.boards[params.data.id];

	return apiLog(board, params);
});

can.fixture('POST /boards', function (params){

	db.boardsSerial++;
	db.boards[db.boardsSerial] = {id: db.boardsSerial, name: params.data.name}

	var result = {id: db.boardsSerial};

	return apiLog(result, params);
});

can.fixture('PUT /boards/{id}', function (params){

	var board = db.boards[params.data.id];

	board.name = params.data.name;
	board.lists = params.data.lists;

	//Deserialisation for DB
	for(var i in board.lists){
		board.lists[i] = db.lists[board.lists[i].id];
	}

	var result = {};

	return apiLog(result, params);
});

can.fixture('DELETE /boards/{id}', function (params){

	var board = db.boards[params.data.id];

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
});

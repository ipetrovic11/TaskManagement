$(document).ready(function() {
    $('#content').html(can.view('boards-template', {}));
});


(function(){

	var boards = new Board.List({});

	can.Component.extend({
		tag: 'boards',
		scope: {
			boards: boards,
			/*
				crate empty board from input value and push it to boards List
			*/
			createBoard: function(context, el, value){
				var value = can.trim(el.val());

				if (value !== '') {
					var board = new Board({
						name: value
					})

					var parentThis = this;
					board.save().then(function(){
						parentThis.boards.push(board);
					});

					el.val('');
				}

			},
			/*
				render one board view
			*/
			openBoard: function (context, el, value) {
				$('#content').html(can.view('board-template', {board: context}));

			},
		}
	});


	can.Component.extend({
		tag: 'board',
		scope: {
			/*
				create new list with value from input element
				and push it to lists List in current board
			*/
			createList: function(context, el, value){

				var value = can.trim(el.val());

				if (value !== '') {
					var list = new List({
						name: value,
						parentId: context.id
					})

					list.save().then(function(){
						if(!context.lists){
							context.attr('lists', new List.List());
						}
						context.lists.push(list);
					});

					el.val('');
				}
			},
			/*
				create new task with value from input element
				with init values  and push it to tasks List in 
				current list
			*/
			createTask: function(context, el, value){
				var value = can.trim(el.val());

				if (value !== '') {
					var task = new Task({
						name: value,
						parentId: context.id,
						started: false,
						total: 0
					})

					task.save().then(function(){
						if(!context.tasks){
							context.attr('tasks', new Task.List());
						}
						context.tasks.push(task);
					});

					el.val('');
				}
			},
			/*
				render view for one task with start-stop button
			*/
			openTask: function (context, parentContext) {
				var boardId = parentContext.id;
				$('#content').html(can.view('task-template', {task: context, parent: boardId}));
			},
			/*
				returns to first page with all boards
			*/
			goBack: function(context, el, value){
				$('#content').html(can.view('boards-template', {}));
			}
		},
	});


	can.Component.extend({
		tag: 'task',
		scope: {
			boards: boards,
			/*
				startTimer will setInterval for model at count each second
				that it is running. 
				Attribute counter will contain setInterval
				Attribute started will contain current State
			*/
			startTimer: function(context, el, value){
				context.attr('started', true);
				context.attr('counter', setInterval(function(task){
					var current = task.attr('total');
					task.attr('total', current + 1);
				}, 1000, context));
			},
			/*
				stopTimer will clearInterval for attribute counter
				and set started to false
			*/
			stopTimer: function(context, el, value){
				clearInterval(context.attr('counter'));
				context.attr('started', false);
				context.save();
			},
			/*
				stopTimer will clearInterval for attribute counter
				and set started to false
			*/
			goBack: function(context, el, value){
				this.boards.each(function(board){
					if(board.id == context){
						$('#content').html(can.view('board-template', {board: board}));
					}
				})
			}
		}
	});
	
})();
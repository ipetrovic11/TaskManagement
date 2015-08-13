$(document).ready(function() {
    $('#content').html(can.view('boards-template', {}));
});


(function(){

	var boards = new Board.List({});

	can.Component.extend({
		tag: 'boards',
		scope: {
			boards: boards,
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
			openBoard: function (context, el, value) {
				$('#content').html(can.view('board-template', {board: context}));

			},
		}
	});


	can.Component.extend({
		tag: 'board',
		scope: {
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
			openTask: function (context, parentContext) {
				var boardId = parentContext.id;
				$('#content').html(can.view('task-template', {task: context, parent: boardId}));
			},
			goBack: function(context, el, value){
				$('#content').html(can.view('boards-template', {}));
			}
		},
	});


	can.Component.extend({
		tag: 'task',
		scope: {
			boards: boards,
			startTimer: function(context, el, value){
				context.attr('started', true);
				context.attr('counter', setInterval(function(task){
					var current = task.attr('total');
					task.attr('total', current + 1);
				}, 1000, context));
			},
			stopTimer: function(context, el, value){
				clearInterval(context.attr('counter'));
				context.attr('started', false);
				context.save();
			},
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
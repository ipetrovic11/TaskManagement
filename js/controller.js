can.Component.extend({

	tag: 'boards',
	scope: {
		boards: new Board.List({}),
		createBoard: function (context, el) {
			var value = can.trim(el.val());

			if (value !== '') {
				new Board({
					name: value
				}).save();

				el.val('');
			}
		},
	},
	events: {

		'{Board} created': function (Construct, ev, board) {
			this.scope.attr('boards').push(board);
		}
	},
});

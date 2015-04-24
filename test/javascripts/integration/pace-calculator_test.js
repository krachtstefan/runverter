// moduleForModel('Run', 'Run Model');

// test('dede', function() {
// 	 // var this.subject();
// 	 console.log(this)
// 	 var player = this.subject({ level: 4 });
// });


module("/", {
  setup: function() {
    Ember.run(Runverter, Runverter.advanceReadiness);
  },
  teardown: function() {
   	// Runverter.reset();
  }
});

test("/", function() {
  expect(1);
  visit("/").then(function() {
    ok(exists("form.uk-form"), "Pace calculator form was rendered");
  });
});
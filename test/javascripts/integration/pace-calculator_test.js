module("/", {
  setup: function() {
    Ember.run(Runverter, Runverter.advanceReadiness);
  },
  teardown: function() {
    Runverter.registry = Runverter.buildRegistry(); // see https://github.com/emberjs/ember.js/issues/10310#issuecomment-95685137
    Runverter.reset();
  }
});

test("renders pace calculator form", function() {
  expect(1);
  visit("/").then(function() {
    ok(exists("form.uk-form"), "Pace calculator form was rendered");
  });
});
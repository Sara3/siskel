var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    if (this.get('like')) {
      this.set('like', false);
    } else {
      this.set('like', true);
    }
  }
});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {

    this.on('change', function(e) {
      //console.log(e.attributes);
      //not called when change is made ?
      this.sortByField(this.comparator);
        
    });
  },

  comparator: 'title',

  sortByField: function(field) {
    this.comparator = field;
    //does not listen to comparator
    this.Collection.sort()
    console.log(this.comparator);
  
  }

});




var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});






var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    this.model.on('change:toggleLike',this.render,this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
    this.render();

  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({
  
  initialize: function() {
   // console.log(this.collection);
   this.collection.on('sort', this.render(), this);
   console.log("movies view is called");
    
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});

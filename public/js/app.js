function FoodQuery(centralLocation, query) {
  this.currentLatLong = new google.maps.LatLng(centralLocation.coords.latitude, centralLocation.coords.longitude);
  this.map = new google.maps.Map(document.getElementById('map'), {
    center: this.currentLatLng,
    zoom: 15
  });
  this.queryVal = query;
  this.searchService = new google.maps.places.PlacesService(this.map);
}

FoodQuery.prototype.execute = function (onSuccess) {
  var request = {
    location: this.currentLatLong,
    radius: '3000',
    openNow: true,
    query: this.queryVal
  };

  this.searchService.textSearch(request, onSuccess);
};

var Header = React.createClass({displayName: "Header",
  render: function () {
    return(
      React.createElement("header", {className: "page-header"}, 
        React.createElement("h1", null, this.props.title)
      )
    );
  }
});

var Footer = React.createClass({displayName: "Footer",
  render: function () {
    return(React.createElement("img", {src: "public/img/powered-by-google.png", alt: "Powered By Google"}));
  }
});

var RouletteWheel = React.createClass({displayName: "RouletteWheel",
  componentDidMount: function() {
    var canvas = React.findDOMNode(this.refs.canvas);
    this.wheel = new RouletteWheelCanvas(canvas, []);
  },
  componentWillReceiveProps: function(newProps) {
    this.wheel.restaurants = newProps.items;
    this.wheel.draw();
    this.wheel.pickWinner(function (winner) {
      alert(winner);
    });
  },
  render: function () {
    return ( React.createElement("canvas", {id: "wheelcanvas", ref: "canvas"}) );
  }
});

var Searcher = React.createClass({displayName: "Searcher",
  getInitialState: function() {
    return {location: null};
  },
  componentWillMount: function() {
    var _this = this;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function onSuccess(location) {
        _this.setState({location: location});
      }, function failedToGetLocation(error) {
        alert(error.code);
      });
    } else {
      alert("Geolocation is not supported by this browser. I cannot proceed.");
    }
  },
  query: function(event) {
    event.preventDefault();
    var searchQuery = React.findDOMNode(this.refs.query).value.trim();
    var _this = this;
    (new FoodQuery(this.state.location, searchQuery)).execute(function(results, status) {
      if (status == google.maps.places.PlacesServiceStatus.OK) {
        _this.props.onResultsFound(results);
      } else {
        alert('The googs broke ...');
      }
    });
  },
  render: function () {
    var placeholder;
    if(this.state.location) {
      placeholder = "Whatcha thinkin'?";
    } else {
      placeholder = 'Loading location ...';
    }
    return (
      React.createElement("form", {onSubmit: this.query, className: "row"}, 
        React.createElement("div", {className: "col-xs-9"}, 
          React.createElement("input", {type: "text", name: "q", placeholder: placeholder, className: "form-control", ref: "query", tabindex: "1", autoFocus: true})
        ), 
        React.createElement("div", {className: "col-xs-3"}, 
          React.createElement("button", {type: "submit", disabled: !this.state.location, className: "btn btn-primary"}, "Spin!")
        )
      )
    );
  }
});

var ResultList = React.createClass({displayName: "ResultList",
  render: function() {
    return(
      React.createElement("ol", {className: "row"}, 
        this.props.listItems.map(function(item, i) {
          return(
            React.createElement("li", {className: "place"}, 
              React.createElement("p", null, React.createElement("i", {className: "glyphicon glyphicon-cutlery"}), " ", item.name)
            )
          )
        }, this)
      )
    );
  }
});

var RouletteApp = React.createClass({displayName: "RouletteApp",
  getInitialState: function() {
    return {queryResults: []};
  },
  onResultsFound: function(results) {
    this.setState({queryResults: results});
  },
  render: function () {
    return (
      React.createElement("div", {class: true}, 
        React.createElement(Header, {title: "Lunch Roulette!"}), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-6"}, React.createElement(RouletteWheel, {items: this.state.queryResults})), 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement(Searcher, {onResultsFound: this.onResultsFound.bind(this)}), 
            React.createElement(ResultList, {listItems: this.state.queryResults})
          )
        ), 
        React.createElement(Footer, null)
      )
    );
  }
});

React.render(
  React.createElement(RouletteApp, null),
  document.getElementById('roulette-app')
);
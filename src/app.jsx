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

var Header = React.createClass({
  render: function () {
    return(
      <header className="page-header">
        <h1>{this.props.title}</h1>
      </header>
    );
  }
});

var Footer = React.createClass({
  render: function () {
    return(<img src="public/img/powered-by-google.png" alt="Powered By Google"/>);
  }
});

var RouletteWheel = React.createClass({
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
    return ( <canvas id="wheelcanvas" ref="canvas"></canvas> );
  }
});

var Searcher = React.createClass({
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
      <form onSubmit={this.query} className="row">
        <div className="col-xs-9">
          <input type="text" name="q" placeholder={placeholder} className="form-control" ref="query"/>
        </div>
        <div className="col-xs-3">
          <button type="submit" disabled={!this.state.location} className="btn btn-primary">Spin!</button>
        </div>
      </form>
    );
  }
});

var ResultList = React.createClass({
  render: function() {
    return(
      <ol className="row">
        {this.props.listItems.map(function(item, i) {
          return(
            <li className="place">
              <p><i className="glyphicon glyphicon-cutlery"></i> {item.name}</p>
            </li>
          )
        }, this)}
      </ol>
    );
  }
});

var RouletteApp = React.createClass({
  getInitialState: function() {
    return {queryResults: []};
  },
  onResultsFound: function(results) {
    this.setState({queryResults: results});
  },
  render: function () {
    return (
      <div class>
        <Header title="Lunch Roulette!"/>
        <div className="row">
          <div className="col-md-6"><RouletteWheel items={this.state.queryResults}/></div>
          <div className="col-md-6">
            <Searcher onResultsFound={this.onResultsFound.bind(this)}/>
            <ResultList listItems={this.state.queryResults}/>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }
});

React.render(
  <RouletteApp/>,
  document.getElementById('roulette-app')
);
var React = require('react');
var ReactDOM = require('react-dom');


var ReactRouter = require('react-router');
var Router  = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var HashHistory = ReactRouter.hashHistory;


var NavBar = React.createClass({
  render: function() {
    return (
<nav className="navbar navbar-default navbar-fixed-top">
  <div className="container">
    <div className="navbar-header">
      <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
        <span className="sr-only">Toggle navigation</span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
      </button>
      <a className="navbar-brand" href="#">SimpleBudget</a>
    </div>
    <div id="navbar" className="navbar-collapse collapse">
      <ul className="nav navbar-nav">
        <li className={(this.props.currentNav === "home") ? "active" : ""}><a href="#">Home</a></li>
        <li className={(this.props.currentNav === "spend") ?  "active" : ""}><a href="#/spend">Spend</a></li>
        <li className={(this.props.currentNav === "reports") ? "active" : ""}><a href="#/reports">Reports</a></li>
        <li className={(this.props.currentNav === "settings") ? "active" : ""}><a href="#/settings">Settings</a></li>
      </ul>
    </div>
  </div>
</nav>
    );
  }
});


var Home = React.createClass({
  render: function() {
    return (
<div>
  <NavBar currentNav="home" />
  <div className="container">
    <div className="jumbotron">
      <h1>Simple Budget</h1>
      <p>Just want to keep track of how much you spend every month without fuss?</p>
      <p><a className="btn btn-lg btn-primary" href="#/settings" role="button">Yeah, thought so...</a></p>
    </div>
  </div>
</div>
    );
  }
});


var Spend = React.createClass({
  getInitialState: function() {
    return {
      categories: [],
      monthlyTotals: {},
      monthlyLog: {}
    };
  },
  
  componentDidMount: function() {
    var lsRef = localStorage.getItem('sbudget');
    if (lsRef) {
      this.state = JSON.parse(lsRef);
      if (this.state.categories.length === 0) {
        HashHistory.replace('/settings');
      }
      this.forceUpdate();
    }
  },
  
  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem('sbudget', JSON.stringify(nextState));
  },
    
  displayCat: function(key) {
    return <SpendCat key={key} category={key} index={this.state.categories.indexOf(key)} spend={this.spend}/>;
  },
  
  spend: function(category, price) {
    var timeId = (new Date()).getTime();
    var yearId = (new Date()).getFullYear().toString();
    var monthId = (new Date()).getMonth()+1;
    var dateId;
    if (monthId < 10) {
      dateId = parseInt(yearId + '0' + monthId, 10);
    } else {
      dateId = parseInt(yearId + monthId, 10);
    }
    
    {/* Need to learn more about Javascript Objects... */}
    
    if (!this.state.monthlyTotals[dateId]) {
      this.state.monthlyTotals[dateId] = {};
    }
    
    if (!this.state.monthlyTotals[dateId][category]) {
      this.state.monthlyTotals[dateId][category] = 0;
    }
    
    this.state.monthlyTotals[dateId][category] = parseInt(this.state.monthlyTotals[dateId][category], 10) + parseInt(price, 10);
    this.setState({monthlyTotals: this.state.monthlyTotals});
    
    
    if (!this.state.monthlyLog[dateId]) {
      this.state.monthlyLog[dateId] = {};
    }
    
    this.state.monthlyLog[dateId][timeId] = { price: price, category: category };
    this.setState({monthlyLog: this.state.monthlyLog});
  },
  
  render: function() {
    return (
<div>
  <NavBar currentNav="spend"/>
  <div className="container">
    <h1>Spend</h1>
    <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
      {this.state.categories.map(this.displayCat)}       
    </div>
  </div>
</div>
    );
  }
});


var SpendCat = React.createClass({
  formSubmit: function(e) {
    e.preventDefault();
    this.props.spend(this.props.category, this.refs.price.value);
    this.refs.priceEntry.reset();
  },

  render: function() {
    var heading = 'heading'+this.props.index;
    var collapse = 'collapse'+this.props.index;
    var hcollapse = '#collapse'+this.props.index;
    
    return (
<div className="panel panel-default">
  <div className="panel-heading" role="tab" id={heading}>
    <h4 className="panel-title">
      <a role="button" data-toggle="collapse" data-parent="#accordion" href={hcollapse} aria-expanded="false" aria-controls={collapse}>
        {this.props.category}
      </a>
    </h4>
  </div>
  <div id={collapse} className="panel-collapse collapse" role="tabpanel" aria-labelledby={heading}>
    <div className="panel-body">
      <form className="form-inline" ref="priceEntry" onSubmit={this.formSubmit}>
        <div className="form-group">
          <input type="tel" className="form-control" ref="price" placeholder="Price" />
        </div>
        <button type="submit" className="btn btn-default">Spent!</button>
      </form>
    </div>
  </div>
</div>
    );
  }
});


var Reports = React.createClass({
  getInitialState: function() {
    return {
      categories: [],
      monthlyTotals: {},
      monthlyLog: {},
      showMonthId: this.getMonthId(),
      showDelete: false
    };
  },
  
  componentDidMount: function() {
    var lsRef = localStorage.getItem('sbudget');
    if (lsRef) {
      this.state = JSON.parse(lsRef);
      {/* TODO: fix me. better handle of defaults */}
      this.state.showMonthId = this.getMonthId();
      this.forceUpdate();
    }
  },
  
  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem('sbudget', JSON.stringify(nextState));
  },

  getMonthId: function() {
    var yearId = (new Date()).getFullYear().toString();
    var monthId = (new Date()).getMonth()+1;
    var dateId;
    if (monthId < 10) {
      dateId = parseInt(yearId + '0' + monthId, 10);
    } else {
      dateId = parseInt(yearId + monthId, 10);
    }
    return dateId;
        
  },

  deleteMonthlyLog: function(key) {
    var toDelete = this.state.monthlyLog[this.state.showMonthId][key];
    if (confirm('Are you sure you want to delete '+toDelete.category+' ('+toDelete.price+')x')) {
      this.state.monthlyTotals[this.state.showMonthId][toDelete.category] = parseInt(this.state.monthlyTotals[this.state.showMonthId][toDelete.category], 10) - parseInt(toDelete.price, 10);
      this.setState({monthlyTotals: this.state.monthlyTotals});
      delete this.state.monthlyLog[this.state.showMonthId][key];
      this.setState({monthlyLog: this.state.monthlyLog});
    }
  },

  displayLog: function(key) {
    var data = this.state.monthlyLog[this.state.showMonthId][key];
    return <ReportMonthLine key={key} date={key} category={data.category} price={data.price} deleteMonthlyLog={this.deleteMonthlyLog} showDelete={this.state.showDelete} />;
  },
  
  displaySummary: function(key) {
    return <ReportSummaryLine key={key} category={key} total={this.state.monthlyTotals[this.state.showMonthId][key]} />;
  },
  
  prevMonth: function(e) {
    {/* this is so bad... */}
    var y = parseInt(this.state.showMonthId.toString().substring(0,4), 10);
    var m = parseInt(this.state.showMonthId.toString().substring(4,6), 10) - 1;
    
    var rawPrevDate = new Date(y, m-1, 1);
    
    var month = rawPrevDate.getMonth()+1;
    if (month < 10) {
      month = '0'+ month.toString();
    } else {
      month = month.toString();
    }
    var newMonthId = parseInt(rawPrevDate.getFullYear().toString() + month, 10); 
    this.state.showMonthId = newMonthId;
    this.setState({showMonthId: this.state.showMonthId});
  },
  
  nextMonth: function(e) {
    {/* this is so bad... */}
    var y = parseInt(this.state.showMonthId.toString().substring(0,4), 10);
    var m = parseInt(this.state.showMonthId.toString().substring(4,6), 10) - 1;
    
    var rawNextDate = new Date(y, m+1, 1);

    var month = rawNextDate.getMonth()+1;
    if (month < 10) {
      month = '0'+ month.toString();
    } else {
      month = month.toString();
    }
    var newMonthId = parseInt(rawNextDate.getFullYear().toString() + month, 10); 
    this.state.showMonthId = newMonthId;
    this.setState({showMonthId: this.state.showMonthId});
  },
  
  toggleDelete: function() {
    this.state.showDelete = !this.state.showDelete;
    this.setState({showDelete: this.state.showDelete});
  },
  
  render: function() {
    var y = parseInt(this.state.showMonthId.toString().substring(0,4), 10);
    var m = parseInt(this.state.showMonthId.toString().substring(5,6), 10) - 1;
    var rawCurDate = new Date(y, m, 1);
    var rawPrevDate = new Date(y, m-1, 1);
    
    
    
    var monthLog = this.state.monthlyLog[this.state.showMonthId] || {};
    var monthSummary = this.state.monthlyTotals[this.state.showMonthId] || {};
    return (
<div>
  <NavBar currentNav="reports" />
  <div className="container">
  <h1>Reports</h1>
  <p>&nbsp;</p>
  <div className="row">
    <div className="col-md-2 col-sm-2 col-xs-2 text-left"><h3><button className ="btn btn-default" onClick={this.prevMonth}><span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></button></h3></div>
    <div className="col-md-8 col-sm-8 col-xs-8 text-center"><h3>{this.state.showMonthId}</h3></div>
    <div className="col-md-2 col-sm-2 col-xs-2 text-right"><h3><button className = "btn btn-default" onClick={this.nextMonth}><span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></button></h3></div>  
  </div>
  <p>&nbsp;</p>
  <table className="table">
    <thead><tr><th>Category</th><th className="text-right">Total</th></tr></thead>
    <tbody>{Object.keys(monthSummary).sort().map(this.displaySummary)}</tbody>
  </table>

  <p>&nbsp;</p>
  <table className="table table-striped">
    <thead><tr><th>Date</th><th>Category</th><th className="text-right">Price</th></tr></thead>
    <tbody>{Object.keys(monthLog).sort().reverse().map(this.displayLog)}</tbody>
  </table>
  <p><button className="btn btn-danger pull-right" onClick={this.toggleDelete}><span className="glyphicon glyphicon-trash" aria-hidden="true"></span></button></p>
  </div>
</div>
    );
  }
});


var ReportMonthLine = React.createClass({
  deleteLine: function(key) {
    this.props.deleteMonthlyLog(key);
  },
  
  render: function() {
    var rawDate = new Date(parseInt(this.props.date,10));
    var day = rawDate.getDate();
    var hour = '0' + rawDate.getHours();
    var minute = '0' + rawDate.getMinutes();
    var fmtDate = day + ' - ' + hour.substr(-2) + ':' + minute.substr(-2);
    return (
<tr><td>{fmtDate}</td><td>{this.props.category}</td><td className="text-right">{this.props.price} {this.props.showDelete ? <button onClick={this.deleteLine.bind(null, this.props.date)}>&times;</button> : null }</td></tr>
    );
  }
});


var ReportSummaryLine = React.createClass({
  render: function() {
    return (
<tr><td>{this.props.category}</td><td className="text-right">{this.props.total}</td></tr>
    );
  }
});


var Settings = React.createClass({
  getInitialState: function() {
    return { 
      categories: [],
      monthlyTotals: {},
      monthlyLog: {}
    };
  },
  
  componentDidMount: function() {
    var lsRef = localStorage.getItem('sbudget');
    if (lsRef) {
      this.state = JSON.parse(lsRef);
      this.forceUpdate();
    }
  },
  
  componentWillUpdate: function(nextProps, nextState) {
    localStorage.setItem('sbudget', JSON.stringify(nextState));
  },
  
  clearData: function(e) {
    if (confirm('Do you really want to delete all your data?')) {
      this.replaceState(this.getInitialState());
      localStorage.removeItem('sbudget');
    }
  },
  
  createCat: function(e) {
    e.preventDefault();
    this.state.categories.push(this.refs.newcat.value);
    this.setState({categories: this.state.categories});
    this.refs.newCatForm.reset();
  },

  displayCat: function(key) {
    return (
      <li className="list-group-item" key={key}>{key} <button onClick={this.deleteCat.bind(null, key)}>&times;</button></li>
    );
  },

  displayOptionCat: function(key) {
    return (
      <option key={key}>{key}</option>
    );
  },
  
  deleteCat: function(key) {
    if (confirm('Are you sure you want to delete: '+key+'?')) {
      this.state.categories.splice(this.state.categories.indexOf(key), 1);
      this.setState({categories: this.state.categories});
    }
  },

  manualSpend: function(e) {
    e.preventDefault();
    var category = this.refs.manualCat.value;
    console.log(category);
    var price = this.refs.manualPrice.value;

    var rawRndTime = new Date();
    var rndTime = (rawRndTime.getSeconds() * 1000) + rawRndTime.getMilliseconds();

    var rawDate = new Date(this.refs.manualDate.value);
    var timeId = rawDate.getTime() + rndTime;
    console.log(timeId);
    var yearId = rawDate.getFullYear().toString();
    var monthId = rawDate.getMonth()+1;
    var dateId;
    if (monthId < 10) {
      dateId = parseInt(yearId + '0' + monthId, 10);
    } else {
      dateId = parseInt(yearId + monthId, 10);
    }

    if (!this.state.monthlyTotals[dateId]) {
      this.state.monthlyTotals[dateId] = {};
    }
    
    if (!this.state.monthlyTotals[dateId][category]) {
      this.state.monthlyTotals[dateId][category] = 0;
    }
    
    this.state.monthlyTotals[dateId][category] = parseInt(this.state.monthlyTotals[dateId][category], 10) + parseInt(price, 10);
    this.setState({monthlyTotals: this.state.monthlyTotals});
    
    
    if (!this.state.monthlyLog[dateId]) {
      this.state.monthlyLog[dateId] = {};
    }
    
    this.state.monthlyLog[dateId][timeId] = { price: price, category: category };
    this.setState({monthlyLog: this.state.monthlyLog});
    this.refs.manSpendForm.reset();
    
  },

  render: function() {
    return (
<div>
  <NavBar currentNav="settings" />
  <div className="container">
    <h2>Settings</h2>
    <ul className="list-group">
      <li className="list-group-item active">Spending Categories</li>
      {this.state.categories.map(this.displayCat)}
      <li className="list-group-item">
        <form className="form-inline" ref="newCatForm" onSubmit={this.createCat}>
          <div className="form-group">
            <input type="text" className="form-control" ref="newcat" placeholder="New Category" />
          </div>
          <button type="submit" className="btn btn-default">Add</button>
        </form>
      </li>
    </ul>
    <p>&nbsp;</p>
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3 className="panel-title">Manual Spending Entry</h3>
      </div>
      <div className="panel-body">
        <form className="form-inline" ref="manSpendForm" onSubmit={this.manualSpend}>
          <div className="form-group">
            <select className="form-control" ref="manualCat">{this.state.categories.map(this.displayOptionCat)}</select>
          </div>
          <div className="form-group">
            <input type="date" className="form-control" ref="manualDate" />
          </div>
          <div className="form-group">
            <input type="tel" className="form-control" ref="manualPrice" placeholder="Price" />
          </div>
          <button type="submit" className="btn btn-default">Spend</button>
        </form>
      </div>
    </div>    
    <p>&nbsp;</p>
    <button className="btn btn-danger btn-block" onClick={this.clearData}>Clear All Data</button>
  </div>
</div>
    );
  }
});


var NotFound = React.createClass({
  render: function() {
    return ( 
<h1>404 - Not Found</h1>
    );
  }
});


var routes = (
  <Router history={HashHistory}>
    <Route path="/" component={Home}/>
    <Route path="/spend" component={Spend}/>
    <Route path="/reports" component={Reports}/>
    <Route path="/settings" component={Settings}/>
    <Route path="*" component={NotFound}/>
  </Router>
);


ReactDOM.render(routes, document.querySelector('#app'));

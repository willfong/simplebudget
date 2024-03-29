/*global localStorage*/
/*global $*/

var React = require("react");
var ReactDOM = require("react-dom");

var ReactRouter = require("react-router");
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var Navigation = ReactRouter.Navigation;
var HashHistory = ReactRouter.hashHistory;

var moment = require("moment");

// Because of a bug, cant use below
// moment.locale('cs');

// This is the woraround
moment.locale("en");

require("moment/locale/zh-tw");
moment.locale("zh-tw");

var classNames = require("classnames");

var $i = {};
$i["template_for_new_languages"] = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	10: 10,
	11: 11,
	12: 12,
	13: 13,
	14: 14,
	15: 15,
	16: 16,
	17: 17,
	18: 18,
	19: 19,
	20: 20,
	21: 21,
	22: 22,
	23: 23,
	24: 24,
	25: 25,
	26: 26,
	27: 27,
	28: 28,
	29: 29,
	30: 30,
	31: 31,
	32: 32,
	33: 33,
	34: 34,
	35: 35,
	36: 36,
	37: 37,
};
$i["en"] = {
	1: "SimpleBudget",
	2: "Home",
	3: "Spend",
	4: "Reports",
	5: "Settings",
	6: "Price",
	7: "Spent!",
	8: "Spend",
	9: "Reports",
	10: "Category",
	11: "Total",
	12: "Date",
	13: "Price",
	14: "Are you sure you want to delete: ",
	15: "Do you really want to delete all your data?",
	16: "Are you sure you want to save to Dropbox?",
	17: "Are you sure you want to load from Dropbox to here?",
	18: "Are you sure you want to revoke access to Dropbox?",
	19: "Settings",
	20: "Spending Categories",
	21: "New Category",
	22: "Add",
	23: "Language",
	24: "Backup to Dropbox",
	25: "Manual Spending Entry",
	26: "Clear All Data",
	27: "Get Code",
	28: "Dropbox Code",
	29: "Link",
	30: "Last saved to Dropbox",
	31: "Never saved",
	32: "Save to Dropbox",
	33: "Show Advanced Options",
	34: "Hide",
	35: "These are advanced options you generally don't need to use.",
	36: "Restore from Dropbox",
	37: "Revoke Dropbox Access",
};
$i["zh-tw"] = {
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	10: 10,
	11: 11,
	12: 12,
	13: 13,
	14: 14,
	15: 15,
	16: 16,
	17: 17,
	18: 18,
	19: 19,
	20: 20,
	21: 21,
	22: 22,
	23: 23,
	24: 24,
	25: 25,
	26: 26,
	27: 27,
	28: 28,
	29: 29,
	30: 30,
	31: 31,
	32: 32,
	33: 33,
	34: 34,
	35: 35,
	36: 36,
	37: 37,
};

var NavBar = React.createClass({
	render: function () {
		return (
			<nav className="navbar navbar-default navbar-fixed-top">
				<div className="container">
					<div className="navbar-header">
						<button
							type="button"
							className="navbar-toggle collapsed"
							data-toggle="collapse"
							data-target="#navbar"
							aria-expanded="false"
							aria-controls="navbar"
						>
							<span className="sr-only">Toggle navigation</span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</button>
						<a className="navbar-brand" href="#">
							{" "}
							{$i["en"][1]}
						</a>
					</div>
					<div id="navbar" className="navbar-collapse collapse">
						<ul className="nav navbar-nav">
							<li className={this.props.currentNav === "home" ? "active" : ""}>
								<a href="#">{$i["en"][2]}</a>
							</li>
							<li className={this.props.currentNav === "spend" ? "active" : ""}>
								<a href="#/spend">{$i["en"][3]}</a>
							</li>
							<li className={this.props.currentNav === "reports" ? "active" : ""}>
								<a href="#/reports">{$i["en"][4]}</a>
							</li>
							<li className={this.props.currentNav === "settings" ? "active" : ""}>
								<a href="#/settings">{$i["en"][5]}</a>
							</li>
						</ul>
					</div>
				</div>
			</nav>
		);
	},
});

var Home = React.createClass({
	render: function () {
		return (
			<div>
				<NavBar currentNav="home" />
				<div className="container">
					<div className="jumbotron">
						<h1>Simple Budget</h1>
						<p>Just want to keep track of how much you spend every month without fuss?</p>
						<p>
							<a className="btn btn-lg btn-primary" href="#/settings" role="button">
								Yeah, thought so...
							</a>
						</p>
					</div>
				</div>
			</div>
		);
	},
});

var Spend = React.createClass({
	getInitialState: function () {
		return {
			language: "en",
			categories: [],
			monthlyTotals: {},
			monthlyLog: {},
		};
	},

	componentDidMount: function () {
		var lsRef = localStorage.getItem("sbudget");
		if (lsRef) {
			this.state = JSON.parse(lsRef);
			if (this.state.categories.length === 0) {
				HashHistory.replace("/settings");
			}
			this.forceUpdate();
		}
	},

	componentWillUpdate: function (nextProps, nextState) {
		localStorage.setItem("sbudget", JSON.stringify(nextState));
	},

	displayCat: function (key) {
		return (
			<SpendCat key={key} category={key} index={this.state.categories.indexOf(key)} spend={this.spend} language="en" />
		);
	},

	spend: function (category, price) {
		var timeId = new Date().getTime();
		var yearId = new Date().getFullYear().toString();
		var monthId = new Date().getMonth() + 1;
		var dateId;
		if (monthId < 10) {
			dateId = parseInt(yearId + "0" + monthId, 10);
		} else {
			dateId = parseInt(yearId + monthId, 10);
		}

		{
			/* Need to learn more about Javascript Objects... */
		}

		if (!this.state.monthlyTotals[dateId]) {
			this.state.monthlyTotals[dateId] = {};
		}

		if (!this.state.monthlyTotals[dateId][category]) {
			this.state.monthlyTotals[dateId][category] = 0;
		}

		this.state.monthlyTotals[dateId][category] =
			parseInt(this.state.monthlyTotals[dateId][category], 10) + parseInt(price, 10);
		this.setState({ monthlyTotals: this.state.monthlyTotals });

		if (!this.state.monthlyLog[dateId]) {
			this.state.monthlyLog[dateId] = {};
		}

		this.state.monthlyLog[dateId][timeId] = { price: price, category: category };
		this.setState({ monthlyLog: this.state.monthlyLog });
	},

	render: function () {
		return (
			<div>
				<NavBar currentNav="spend" language="en" />
				<div className="container">
					<h1>{$i["en"][8]}</h1>
					<div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
						{this.state.categories.map(this.displayCat)}
					</div>
				</div>
			</div>
		);
	},
});

var SpendCat = React.createClass({
	getInitialState: function () {
		return {
			enableSubmit: false,
			inputError: "",
		};
	},

	formSubmit: function (e) {
		e.preventDefault();
		this.props.spend(this.props.category, this.refs.price.value);
		this.refs.priceEntry.reset();
		this.state.enableSubmit = false;
	},

	handleChange: function (e) {
		if (e.target.value.length > 0) {
			if (e.target.value > 0) {
				this.state.enableSubmit = true;
				this.state.inputError = "";
			} else {
				this.state.enableSubmit = false;
				this.state.inputError = " has-error has-feedback";
			}
		} else {
			this.state.inputError = "";
			this.state.enableSubmit = false;
		}
		this.setState({ inputError: this.state.inputError, enableSubmit: this.state.enableSubmit });
	},

	render: function () {
		var heading = "heading" + this.props.index;
		var collapse = "collapse" + this.props.index;
		var hcollapse = "#collapse" + this.props.index;
		var inputClass = "form-group" + this.state.inputError;

		return (
			<div className="panel panel-default">
				<div className="panel-heading" role="tab" id={heading}>
					<h4 className="panel-title">
						<a
							role="button"
							data-toggle="collapse"
							data-parent="#accordion"
							href={hcollapse}
							aria-expanded="false"
							aria-controls={collapse}
						>
							{this.props.category}
						</a>
					</h4>
				</div>
				<div id={collapse} className="panel-collapse collapse" role="tabpanel" aria-labelledby={heading}>
					<div className="panel-body">
						<form ref="priceEntry" onSubmit={this.formSubmit}>
							<div className="row">
								<div className="col-md-10 col-xs-8">
									<div className={inputClass}>
										<input
											type="tel"
											className="form-control"
											ref="price"
											placeholder={$i["en"][6]}
											onChange={this.handleChange}
										/>
									</div>
								</div>
								<div className="col-md-2 col-xs-4">
									<button type="submit" className="btn btn-default" disabled={!this.state.enableSubmit}>
										{$i["en"][7]}
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	},
});

var Reports = React.createClass({
	getInitialState: function () {
		return {
			language: "en",
			categories: [],
			monthlyTotals: {},
			monthlyLog: {},
			showMonthId: this.getMonthId(),
			showDelete: false,
		};
	},

	componentDidMount: function () {
		var lsRef = localStorage.getItem("sbudget");
		if (lsRef) {
			this.state = JSON.parse(lsRef);
			{
				/* TODO: fix me. better handle of defaults */
			}
			this.state.showMonthId = this.getMonthId();
			this.forceUpdate();
			switch (this.state.language) {
				case "en":
					moment.locale("en");
					break;
				case "zh-tw":
					require("moment/locale/zh-tw");
					moment.locale("zh-tw");
					break;
			}
		}
		this.state.showDelete = false;
	},

	componentWillUpdate: function (nextProps, nextState) {
		localStorage.setItem("sbudget", JSON.stringify(nextState));
	},

	getMonthId: function () {
		var yearId = new Date().getFullYear().toString();
		var monthId = new Date().getMonth() + 1;
		var dateId;
		if (monthId < 10) {
			dateId = parseInt(yearId + "0" + monthId, 10);
		} else {
			dateId = parseInt(yearId + monthId, 10);
		}
		return dateId;
	},

	deleteMonthlyLog: function (key) {
		var toDelete = this.state.monthlyLog[this.state.showMonthId][key];
		if (confirm($i["en"][14] + toDelete.category + " (" + toDelete.price + ")?")) {
			this.state.monthlyTotals[this.state.showMonthId][toDelete.category] =
				parseInt(this.state.monthlyTotals[this.state.showMonthId][toDelete.category], 10) -
				parseInt(toDelete.price, 10);
			this.setState({ monthlyTotals: this.state.monthlyTotals });
			delete this.state.monthlyLog[this.state.showMonthId][key];
			this.setState({ monthlyLog: this.state.monthlyLog });
		}
	},

	displayLog: function (data) {
		return (
			<ReportMonthLine
				key={data.key}
				date={data.key}
				fmtDay={data.fmtDay}
				category={data.category}
				price={data.price}
				rowActive={data.rowActive}
				deleteMonthlyLog={this.deleteMonthlyLog}
				showDelete={this.state.showDelete}
			/>
		);
	},

	displaySummary: function (key) {
		return <ReportSummaryLine key={key} category={key} total={this.state.monthlyTotals[this.state.showMonthId][key]} />;
	},

	prevMonth: function (e) {
		{
			/* this is so bad... */
		}
		var y = parseInt(this.state.showMonthId.toString().substring(0, 4), 10);
		var m = parseInt(this.state.showMonthId.toString().substring(4, 6), 10) - 1;

		var rawPrevDate = new Date(y, m - 1, 1);

		var month = rawPrevDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month.toString();
		} else {
			month = month.toString();
		}
		var newMonthId = parseInt(rawPrevDate.getFullYear().toString() + month, 10);
		this.state.showMonthId = newMonthId;
		this.setState({ showMonthId: this.state.showMonthId });
	},

	nextMonth: function (e) {
		{
			/* this is so bad... */
		}
		var y = parseInt(this.state.showMonthId.toString().substring(0, 4), 10);
		var m = parseInt(this.state.showMonthId.toString().substring(4, 6), 10) - 1;

		var rawNextDate = new Date(y, m + 1, 1);

		var month = rawNextDate.getMonth() + 1;
		if (month < 10) {
			month = "0" + month.toString();
		} else {
			month = month.toString();
		}
		var newMonthId = parseInt(rawNextDate.getFullYear().toString() + month, 10);
		this.state.showMonthId = newMonthId;
		this.setState({ showMonthId: this.state.showMonthId });
	},

	toggleDelete: function () {
		this.state.showDelete = !this.state.showDelete;
		this.setState({ showDelete: this.state.showDelete });
	},

	render: function () {
		var monthLog = this.state.monthlyLog[this.state.showMonthId] || {};
		var monthSummary = this.state.monthlyTotals[this.state.showMonthId] || {};
		var formattedMonth;
		if ("en" == "zh-tw") {
			formattedMonth =
				"民國" +
				moment(this.state.showMonthId + "01")
					.subtract(1911, "years")
					.format("Y MMMM");
		} else {
			formattedMonth = moment(this.state.showMonthId + "01").format("MMMM YYYY");
		}

		var dailyTotals = {};
		var logCopy = Object.keys(monthLog)
			.sort()
			.reverse()
			.map((key, i) => {
				var data = this.state.monthlyLog[this.state.showMonthId][key];
				var rawDate = new Date(parseInt(key, 10));
				var day = rawDate.getDate();
				data.fmtDay = day;
				data.key = key;
				if (dailyTotals[day]) {
					dailyTotals[day] += Number(data.price);
				} else {
					dailyTotals[day] = Number(data.price);
				}
				return data;
			});

		var curDay = 0;
		var rowActive = false;
		var logLines = logCopy.map((row, i) => {
			if (i == 0 || row.fmtDay != curDay) {
				curDay = row.fmtDay;
				{
					/* Use the line below to make display level changes */
				}
				row.fmtDay = row.fmtDay;
				rowActive = !rowActive;
			} else {
				row.fmtDay = "";
			}
			row.rowActive = rowActive;
			return row;
		});

		return (
			<div>
				<NavBar currentNav="reports" language="en" />
				<div className="container">
					<h1>{$i["en"][9]}</h1>
					<p>&nbsp;</p>
					<div className="row">
						<div className="col-md-2 col-sm-2 col-xs-2 text-left">
							<h3>
								<button className="btn btn-default" onClick={this.prevMonth}>
									<span className="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>
								</button>
							</h3>
						</div>
						<div className="col-md-8 col-sm-8 col-xs-8 text-center">
							<h3>{formattedMonth}</h3>
						</div>
						<div className="col-md-2 col-sm-2 col-xs-2 text-right">
							<h3>
								<button className="btn btn-default" onClick={this.nextMonth}>
									<span className="glyphicon glyphicon-chevron-right" aria-hidden="true"></span>
								</button>
							</h3>
						</div>
					</div>
					<p>&nbsp;</p>
					<table className="table">
						<thead>
							<tr>
								<th>{$i["en"][10]}</th>
								<th className="text-right">{$i["en"][11]}</th>
							</tr>
						</thead>
						<tbody>{Object.keys(monthSummary).sort().map(this.displaySummary)}</tbody>
					</table>

					<p>&nbsp;</p>
					<table className="table">
						<thead>
							<tr>
								<th colSpan="2">{$i["en"][12]}</th>
								<th>{$i["en"][10]}</th>
								<th className="text-right">{$i["en"][13]}</th>
							</tr>
						</thead>
						<tbody>{logLines.map(this.displayLog)}</tbody>
					</table>
					<p>
						<button className="btn btn-danger pull-right" onClick={this.toggleDelete}>
							<span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
						</button>
					</p>
				</div>
			</div>
		);
	},
});

var ReportMonthLine = React.createClass({
	deleteLine: function (key) {
		this.props.deleteMonthlyLog(key);
	},

	render: function () {
		var rawDate = new Date(parseInt(this.props.date, 10));
		var hour = "0" + rawDate.getHours();
		var minute = "0" + rawDate.getMinutes();
		var fmtDate = hour.substr(-2) + ":" + minute.substr(-2);
		var rowClass = classNames({ active: this.props.rowActive });
		return (
			<tr className={rowClass}>
				<td>{this.props.fmtDay}</td>
				<td>{fmtDate}</td>
				<td>{this.props.category}</td>
				<td className="text-right">
					{this.props.price}{" "}
					{this.props.showDelete ? (
						<button onClick={this.deleteLine.bind(null, this.props.date)}>&times;</button>
					) : null}
				</td>
			</tr>
		);
	},
});

var ReportSummaryLine = React.createClass({
	render: function () {
		return (
			<tr>
				<td>{this.props.category}</td>
				<td className="text-right">{this.props.total}</td>
			</tr>
		);
	},
});

var LanguageOptions = React.createClass({
	handleChange: function (e) {
		this.props.changeLanguage(e.target.value);
	},
	render: function () {
		return (
			<select className="form-control" ref="languageSelect" onChange={this.handleChange} value={"en"}>
				<option value="en">English</option>
				<option value="zh-tw">繁體中文</option>
			</select>
		);
	},
});

var Settings = React.createClass({
	getInitialState: function () {
		return {
			language: "en",
			categories: [],
			monthlyTotals: {},
			monthlyLog: {},
			newCatName: "",
			dbToken: false,
			dbShowAdv: false,
			dbLastSaved: "",
		};
	},

	componentDidMount: function () {
		var lsRef = localStorage.getItem("sbudget");
		if (lsRef) {
			this.state = JSON.parse(lsRef);
			this.state.newCatName = "";
			this.forceUpdate();
			switch ("en") {
				case "en":
					moment.locale("en");
					break;
				case "zh-tw":
					require("moment/locale/zh-tw");
					moment.locale("zh-tw");
					break;
			}
		}
	},

	componentWillUpdate: function (nextProps, nextState) {
		localStorage.setItem("sbudget", JSON.stringify(nextState));
	},

	changeLanguage: function (lang) {
		this.state.language = lang;
		this.setState({ language: "en" });
	},

	clearData: function (e) {
		if (confirm($i["en"][15])) {
			this.replaceState(this.getInitialState());
			localStorage.removeItem("sbudget");
		}
	},

	createCat: function (e) {
		e.preventDefault();
		this.state.categories.push(this.refs.newcat.value);
		this.setState({ categories: this.state.categories });
		this.setState({ newCatName: "" });
		this.refs.newCatForm.reset();
	},

	displayCat: function (key) {
		return (
			<li className="list-group-item" key={key}>
				{key}{" "}
				<button className="btn btn-default btn-xs pull-right" onClick={this.deleteCat.bind(null, key)}>
					&times;
				</button>
			</li>
		);
	},

	displayOptionCat: function (key) {
		return <option key={key}>{key}</option>;
	},

	deleteCat: function (key) {
		if (confirm($i["en"][14] + key + "?")) {
			this.state.categories.splice(this.state.categories.indexOf(key), 1);
			this.setState({ categories: this.state.categories });
		}
	},

	dbCode2Token: function (dbCode) {
		var that = this;
		{
			/* TODO: All this needs to be refactored to be, you know, secure */
		}
		$.post(
			"https://api.dropboxapi.com/oauth2/token",
			{
				code: dbCode,
				grant_type: "authorization_code",
				client_id: "t7i1tds69yt0od4",
				client_secret: "9fkqh566wx55lhq",
			},
			function (data) {
				{
					/* TODO: This is where it's supposed to work... */
				}
			}
		).error(function (data) {
			{
				/* TODO: Why does jQ think the response was an error? */
			}
			var token = JSON.parse(data.responseText).access_token;
			that.state.dbToken = token;
			that.setState({ dbToken: token });
		});
	},

	dbSave: function (e) {
		e.preventDefault();
		if (confirm($i["en"][16])) {
			{
				/* TODO: put this date into the success handler */
			}
			this.setState({ dbLastSaved: moment() });
			var dbToken = this.state.dbToken;
			var dbData = localStorage.getItem("sbudget");
			var dbHeader = JSON.stringify({ path: "/saveddata.txt", mode: "overwrite", autorename: true, mute: false });
			$.ajax({
				type: "POST",
				url: "https://content.dropboxapi.com/2/files/upload",
				headers: {
					Authorization: "Bearer " + dbToken,
					"Dropbox-API-Arg": dbHeader,
				},
				contentType: "application/octet-stream",
				data: dbData,
			})
				.done(function (data) {
					console.log(data);
				})
				.fail(function (data) {
					console.log(data);
				});
		}
	},

	dbRestore: function (e) {
		e.preventDefault();
		if (confirm($i["en"][17])) {
			var that = this;
			var dbToken = this.state.dbToken;
			var dbHeader = JSON.stringify({ path: "/saveddata.txt" });
			$.ajax({
				type: "POST",
				url: "https://content.dropboxapi.com/2/files/download",
				headers: {
					Authorization: "Bearer " + dbToken,
					"Dropbox-API-Arg": dbHeader,
				},
			})
				.done(function (data) {
					{
						/* TODO: This seems a little fragile. */
					}
					that.state = JSON.parse(data);
					that.state.dbToken = dbToken;
					that.state.newCatName = "";
					that.forceUpdate();
				})
				.fail(function (data) {
					console.log(data);
				});
		}
	},

	dbRevoke: function (e) {
		e.preventDefault();
		var that = this;
		if (confirm($i["en"][18])) {
			var dbToken = this.state.dbToken;
			$.ajax({
				type: "POST",
				url: "https://api.dropboxapi.com/2/auth/token/revoke",
				headers: {
					Authorization: "Bearer " + dbToken,
				},
			}).done(function (data) {
				that.state.dbToken = false;
				that.setState({ dbToken: false });
			});
		}
	},

	dbShowAdvChange: function () {
		this.setState({ dbShowAdv: !this.state.dbShowAdv });
	},

	enableBtnNewCat: function (e) {
		this.setState({ newCatName: e.target.value });
	},

	manualSpend: function (e) {
		e.preventDefault();
		var category = this.refs.manualCat.value;
		var price = this.refs.manualPrice.value;

		var rawRndTime = new Date();
		var rndTime = rawRndTime.getSeconds() * 1000 + rawRndTime.getMilliseconds();

		var rawDate = new Date(this.refs.manualDate.value);
		var timeId = rawDate.getTime() + rndTime;
		var yearId = rawDate.getFullYear().toString();
		var monthId = rawDate.getMonth() + 1;
		var dateId;
		if (monthId < 10) {
			dateId = parseInt(yearId + "0" + monthId, 10);
		} else {
			dateId = parseInt(yearId + monthId, 10);
		}

		if (!this.state.monthlyTotals[dateId]) {
			this.state.monthlyTotals[dateId] = {};
		}

		if (!this.state.monthlyTotals[dateId][category]) {
			this.state.monthlyTotals[dateId][category] = 0;
		}

		this.state.monthlyTotals[dateId][category] =
			parseInt(this.state.monthlyTotals[dateId][category], 10) + parseInt(price, 10);
		this.setState({ monthlyTotals: this.state.monthlyTotals });

		if (!this.state.monthlyLog[dateId]) {
			this.state.monthlyLog[dateId] = {};
		}

		this.state.monthlyLog[dateId][timeId] = { price: price, category: category };
		this.setState({ monthlyLog: this.state.monthlyLog });
		this.refs.manSpendForm.reset();
	},

	render: function () {
		return (
			<div>
				<NavBar currentNav="settings" language="en" />
				<div className="container">
					<h2>{$i["en"][19]}</h2>
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">{$i["en"][20]}</h3>
						</div>
						<ul className="list-group">
							{this.state.categories.map(this.displayCat)}
							<li className="list-group-item">
								<form className="form-inline" ref="newCatForm" onSubmit={this.createCat}>
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											ref="newcat"
											placeholder={$i["en"][21]}
											onChange={this.enableBtnNewCat}
										/>
									</div>
									<button type="submit" className="btn btn-default" disabled={this.state.newCatName.length === 0}>
										{$i["en"][22]}
									</button>
								</form>
							</li>
						</ul>
					</div>
					<p>&nbsp;</p>
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">{$i["en"][23]}</h3>
						</div>
						<div className="panel-body">
							<LanguageOptions changeLanguage="en" language="en" />
						</div>
					</div>
					<p>&nbsp;</p>
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">{$i["en"][24]}</h3>
						</div>
						<div className="panel-body">
							{this.state.dbToken ? (
								<DbLoggedIn
									language="en"
									dbSave={this.dbSave}
									dbRestore={this.dbRestore}
									dbRevoke={this.dbRevoke}
									dbLastSaved={this.state.dbLastSaved}
									dbShowAdv={this.state.dbShowAdv}
									dbShowAdvChange={this.dbShowAdvChange}
								/>
							) : (
								<DbLogin language="en" dbCode2Token={this.dbCode2Token} />
							)}
						</div>
					</div>
					<p>&nbsp;</p>
					<div className="panel panel-default">
						<div className="panel-heading">
							<h3 className="panel-title">{$i["en"][25]}</h3>
						</div>
						<div className="panel-body">
							<form className="form-inline" ref="manSpendForm" onSubmit={this.manualSpend}>
								<div className="form-group">
									<select className="form-control" ref="manualCat">
										{this.state.categories.map(this.displayOptionCat)}
									</select>
								</div>
								<div className="form-group">
									<input type="date" className="form-control" ref="manualDate" />
								</div>
								<div className="form-group">
									<input type="tel" className="form-control" ref="manualPrice" placeholder={$i["en"][6]} />
								</div>
								<button type="submit" className="btn btn-default">
									{$i["en"][7]}
								</button>
							</form>
						</div>
					</div>
					<p>&nbsp;</p>

					<button className="btn btn-danger btn-block" onClick={this.clearData}>
						{$i["en"][26]}
					</button>
				</div>
			</div>
		);
	},
});

var DbLogin = React.createClass({
	dbGetCode: function () {
		window.open(
			"https://www.dropbox.com/oauth2/authorize?response_type=code&client_id=t7i1tds69yt0od4",
			"Login To Dropbox"
		);
	},

	dbCode2Token: function (e) {
		e.preventDefault();
		this.props.dbCode2Token(this.refs.dbCode.value);
		this.refs.dbForm.reset();
	},

	render: function () {
		return (
			<div>
				<button className="btn btn-primary btn-block" onClick={this.dbGetCode}>
					{$i["en"][27]}
				</button>
				<p>&nbsp;</p>
				<form className="form-inline" ref="dbForm" onSubmit={this.dbCode2Token}>
					<div className="form-group">
						<input type="text" className="form-control" ref="dbCode" placeholder={$i["en"][28]} size="55" />
					</div>
					<button type="submit" className="btn btn-default">
						{$i["en"][29]}
					</button>
				</form>
			</div>
		);
	},
});

var DbLoggedIn = React.createClass({
	showAdv: function (e) {
		e.preventDefault();
		this.props.dbShowAdvChange();
	},

	render: function () {
		return (
			<div>
				<p>
					{$i["en"][30]}: {this.props.dbLastSaved ? moment(this.props.dbLastSaved).calendar() : $i["en"][31]}
				</p>
				<button className="btn btn-default btn-block" onClick={this.props.dbSave}>
					{$i["en"][32]}
				</button>
				<p>&nbsp;</p>
				{this.props.dbShowAdv ? (
					<DbLoggedInAdv
						language="en"
						dbRestore={this.props.dbRestore}
						dbRevoke={this.props.dbRevoke}
						dbShowAdvChange={this.props.dbShowAdvChange}
					/>
				) : (
					<p>
						<a href="#" onClick={this.showAdv}>
							{$i["en"][33]}
						</a>
					</p>
				)}
			</div>
		);
	},
});

var DbLoggedInAdv = React.createClass({
	showAdv: function (e) {
		e.preventDefault();
		this.props.dbShowAdvChange();
	},
	render: function () {
		return (
			<div className="well well-lg">
				<p>
					<a href="#" onClick={this.showAdv}>
						{$i["en"][34]}
					</a>
				</p>
				<p>{$i["en"][35]}</p>
				<p>&nbsp;</p>
				<button className="btn btn-default btn-block" onClick={this.props.dbRestore}>
					{$i["en"][36]}
				</button>
				<p>&nbsp;</p>
				<button className="btn btn-danger btn-block" onClick={this.props.dbRevoke}>
					{$i["en"][37]}
				</button>
			</div>
		);
	},
});

var NotFound = React.createClass({
	render: function () {
		return <h1>404 - Not Found</h1>;
	},
});

var routes = (
	<Router history={HashHistory}>
		<Route path="/" component={Home} />
		<Route path="/spend" component={Spend} />
		<Route path="/reports" component={Reports} />
		<Route path="/settings" component={Settings} />
		<Route path="*" component={NotFound} />
	</Router>
);

ReactDOM.render(routes, document.querySelector("#app"));

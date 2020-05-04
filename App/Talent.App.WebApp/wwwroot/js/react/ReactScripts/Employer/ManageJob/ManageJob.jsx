import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { JobFilter } from './JobFilter.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Label, Button, Card, Grid, Checkbox, Accordion, Form, Segment } from 'semantic-ui-react';
import qs from 'query-string';
import { relativeTimeRounding } from 'moment';


export default class ManageJob extends React.Component {
	constructor(props) {
		super(props);
		let loader = loaderData
		loader.allowedUsers.push("Employer");
		loader.allowedUsers.push("Recruiter");
		//console.log(loader)
		this.state = {
			loadJobs: [],
			loaderData: loader,
			activePage: 1,
			sortby: { sortbyDate: "asc" },

			filter: {
				showActive: true,
				showClosed: false,
				showDraft: true,
				showExpired: true,
				showUnexpired: true
			},
			totalPages: 1,
			itemsPerPage: 6,
			activeIndex: "",
			filterOptionsArray: [
				'showActive', 'showDraft', 'showExpired', 'showUnexpired'
			],
			jobItem: []
		}
		this.loadData = this.loadData.bind(this);
		this.init = this.init.bind(this);
		this.loadNewData = this.loadNewData.bind(this);
		this.renderFilterJobs = this.renderFilterJobs.bind(this);
		this.renderPage = this.renderPage.bind(this);
		this.handlePaginationChange = this.handlePaginationChange.bind(this);
		this.onFilterChange = this.onFilterChange.bind(this);
		this.onSortChange = this.onSortChange.bind(this);
	};

	init() {
		let loaderData = TalentUtil.deepCopy(this.state.loaderData)
		loaderData.isLoading = false;
		//this.setState({ loaderData });//comment this

		//set loaderData.isLoading to false after getting data
		this.loadData(() => this.setState({ loaderData })
		)
	}

	componentDidMount() {
		this.init();
	};

	loadData(callback) {
		const { filter, sortby, activePage } = this.state;
		//var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs?'
		var link = 'https://talentcompetitiontask.azurewebsites.net/listing/listing/getSortedEmployerJobs?'
			+ qs.stringify(filter) + '&' + qs.stringify(sortby) + '&activePage=' + activePage;
		//var link = 'http://localhost:51689/listing/listing/getSortedEmployerJobs';
		var cookies = Cookies.get('talentAuthToken');
		// your ajax call and other logic goes here

		$.ajax({
			type: 'GET',
			headers: {
				'Authorization': 'Bearer ' + cookies,
				'Content-Type': 'application/json'
			},
			url: link,
			contentType: 'application/json',
			dataType: 'json',
			success: function (data) {
				this.setState({
					loadJobs: data.myJobs,
					totalPages: Math.ceil(data.totalCount / this.state.itemsPerPage),
				});
				callback();
			}.bind(this),
			error: function (e) {
				console.log('error')
			}.bind(this)
		});
	}

	loadNewData(data) {
		var loader = this.state.loaderData;
		loader.isLoading = true;
		data[loaderData] = loader;
		this.setState(data, () => {
			this.loadData(() => {
				loader.isLoading = false;
				this.setState({
					loadData: loader
				})
			})
		});
	}

	//page control
	handlePaginationChange(e, { activePage }) {
		this.setState({ activePage }, this.init);
	}

	renderPage() {
		const { activePage, totalPages } = this.state;
		return (
			<Pagination
				activePage={activePage}
				onPageChange={this.handlePaginationChange}
				totalPages={totalPages}
			/>)
	}
	// filter control

	onFilterChange(event, data) {
		let filter = TalentUtil.deepCopy(this.state.filter);
		var choices = data.value;
		for (var key in filter) {
			filter[key] = false;
			for (var i = 0; i < choices.length; i++) {
				if (key == choices[i]) {
					filter[key] = true;
				}
			}
		}
		this.setState({
			filterOptionsArray: data.value, filter, activePage: 1
		}
			, this.init
		)
	}
	onSortChange(event, data) {
		let sortby = TalentUtil.deepCopy(this.state.sortby);
		sortby.sortbyDate = data.value
		this.setState({ sortby, activePage: 1 }, this.init)
	}

	renderFilterJobs() {
		const { loadJobs, activePage, itemsPerPage } = this.state;

		if (this.state.loadJobs.length == 0) {
			return <p>No jobs found</p>
		}
		else {
			return loadJobs.map(x => {
				return <JobSummaryCard jobItem={x} key={x.id} onCloseRedirection={this.init} />
			})
		}
	}


	render() {
		return (
			<BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
				<section className="page-body">
					<div className="ui container">
						<h2>List of Jobs</h2>
						<JobFilter onFilterChange={this.onFilterChange}
							filterOptionsArray={this.state.filterOptionsArray}
							onSortChange={this.onSortChange}
							sortbyDate={this.state.sortbyDate}
						/>
						<Card.Group itemsPerRow={3}>
							{this.renderFilterJobs()}
						</Card.Group>

						<Grid textAlign='center' className="job-pagination">{this.renderPage()}</Grid>

					</div>

				</section>
			</BodyWrapper>
		)
	}
}
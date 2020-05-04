import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';
import { Icon, Label, Button, Dropdown } from 'semantic-ui-react';

const JobFilterOptions = [
	{
		text: 'showActive',
		value: 'showActive'
	},
	{
		text: 'showClosed',
		value: 'showClosed'
	},
	{
		text: 'showDraft',
		value: 'showDraft'
	},
	{
		text: 'showExpired',
		value: 'showExpired'
	},
	{
		text: 'showUnexpired',
		value: 'showUnexpired'
	}
];
const JobSortOptions = [
	{
		text: 'Newest first',
		value: 'desc'
	},
	{
		text: 'Newest last',
		value: 'asc'
	}
];

export class JobFilter extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div>
				<label>
					<Icon name='filter' />Filter:&nbsp;
                        </label>
				<Dropdown inline text='Choose filter'
					options={JobFilterOptions}
					multiple lazyLoad
					onChange={this.props.onFilterChange}
					value={this.props.filterOptionsArray} />
				<label>
					<Icon name='calendar' />Sort by date:&nbsp;
                        </label>
				<Dropdown inline options={JobSortOptions}
					onChange={this.props.onSortChange}
					value={this.props.sortbyDate} />
				<br /><br /><br />
			</div>
		)

	}
}
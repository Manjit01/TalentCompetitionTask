
import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import moment from 'moment';
import { Icon, Label, Button, Card } from 'semantic-ui-react';

export class JobSummaryCard extends React.Component {
	constructor(props) {
		super(props);
		this.checkExpired = this.checkExpired.bind(this)
		this.closeJob = this.closeJob.bind(this)
		this.editJob = this.editJob.bind(this)
		this.copyJob = this.copyJob.bind(this)
	}

	// expired judge
	checkExpired(expiredDate) {
		let date = new Date(new Date());
		let expiryDate = new Date(expiredDate);
		if (date > expiryDate) {
			return (
				<Button floated='left' size='mini' color='red'>
					Expired
                </Button>
			)
		}

	}

	// button on click
	closeJob(id) {
		var link = 'https://talentcompetitiontask.azurewebsites.net/listing/listing/CloseJob';
		var cookies = Cookies.get('talentAuthToken');
		$.ajax({
			type: 'POST',
			headers: {
				'Authorization': 'Bearer ' + cookies,
				'Content-Type': 'application/json'
			},
			url: link,
			contentType: 'application/json',
			dataType: 'json',
			data: JSON.stringify(id),
			success: function (data) {
				console.log(data)
				if (data.success) {
					TalentUtil.notification.show(data.message, "success", null, null);
					this.props.onCloseRedirection();
				}

			}.bind(this),
			error: function (e) {
				console.log(e.message)
			}.bind(this)
		});
	}

	editJob(id) {
		window.location = "/EditJob/" + id;
	}

	copyJob(id) {
		window.location = "/PostJob/" + id;
	}

	render() {
		var x = this.props.jobItem;
		return (
			<Card >
				<Card.Content className='job-card-content'>
					<Card.Header>{x.title}</Card.Header>
					<Card.Meta>
						<Label as='a' color='black' ribbon='right'>
							<Icon name='user' />&nbsp;&nbsp;
                                    {x.noOfSuggestions}
						</Label>
						<br /><br />
						<span >{x.location.country}, {x.location.city}</span>
					</Card.Meta>
					<Card.Description>{x.summary}</Card.Description>
				</Card.Content>
				<Card.Content extra>
					{this.checkExpired(x.expiryDate)}
					<Button.Group floated='right' size='mini'>
						<Button basic color='blue'
							onClick={() => { this.closeJob(x.id) }}>
							<Icon name='ban' /> Close
                                </Button>
						<Button basic color='blue'
							onClick={() => { this.editJob(x.id) }}>
							<Icon name='edit' /> Edit
                                </Button>
						<Button basic color='blue'
							onClick={() => { this.copyJob(x.id) }}>
							<Icon name='copy' /> Copy
                                </Button>
					</Button.Group>
				</Card.Content>
			</Card>
		)

	}
}
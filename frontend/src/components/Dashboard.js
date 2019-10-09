import React, { Component } from 'react';
import Header from './header-footer/header';
import Footer from './header-footer/footer';
import Question from './Question';
import { random } from 'lodash';
import Achievements from './Achievements';
class Dashboard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			answer: '',
			errorMsg: [
				'Oops!! Try Again',
				'You are almost there',
				'Better Luck Next Time',
				'Wrong!!',
				'Try! Try! Try!',
				'Far from Bingo'
			],
			successMsg: [
				'Bingo',
				'Congratulations',
				'Correct',
				'Target Accomplish',
				'One step ahead',
				'Level up',
				'Hurray!!!',
				'Yay'
			],
			selectedError: '',
			selectedSuccess: '',
			currQ: '',
			score: ''
		};
	}

	componentDidMount() {
		this.gettingDetails();
	}

	onAnswerChange = (e) => {
		this.setState({ answer: e.target.value });
	};
	gettoken = () => {
		const localtoken = localStorage.getItem('logintoken');
		fetch('http://127.0.0.1:8000/questions/', {
			method: 'post',
			headers: { Authorization: `Bearer ${localtoken}`, 'Content-Type': 'application/json' },
			body: JSON.stringify({
				answer: this.state.answer
			})
		})
			.then((response) => response.json())
			.then((responseJson) => {
				if (responseJson.success === false && this.state.answer.length > 0) {
					this.setState({
						selectedSuccess: ''
					});
					this.getRandomErr();
				} else {
					this.setState({
						selectedError: ''
					});
					this.getRandomSuccess();
				}
			})
			.catch((error) => {
				console.log(error);
			});

		this.refs.answer.value = '';
	};
	getRandomSuccess = () => {
		var item = this.state.successMsg[Math.floor(Math.random() * this.state.successMsg.length)];
		this.setState({
			selectedSuccess: item
		});
	};
	getRandomErr = () => {
		var item = this.state.errorMsg[Math.floor(Math.random() * this.state.errorMsg.length)];
		this.setState({
			selectedError: item
		});
	};
	gettingDetails = () => {
		const localtoken = localStorage.getItem('logintoken');
		fetch('http://127.0.0.1:8000/accounts/api/', {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${localtoken}`
			}
		})
			.then((res) => res.json())
			.then((response) => {
				this.setState({
					currQ: response.current_question,
					score: response.score
				});
			});
	};
	render() {
		return (
			<div className="dashboard">
				<Header />

				<div className="dashboard-content">
					<div className="question-container">
						<div style={{ margin: 'auto' }}>
							<h1 className="font-weight-bold">QUESTION</h1>
							<h4 className="text-left">Tier:</h4>
							<div className="input-group d-inline">
								<Question />
								<input
									className="answer-block"
									type="text"
									placeholder="I seek an Answer...."
									ref="answer"
									onChange={this.onAnswerChange}
								/>
							</div>
							<button className="login-btn answer-button" onClick={this.gettoken}>
								CHECK
							</button>
							<div style={{ color: 'red' }}>{this.state.selectedError}</div>
							<div style={{ color: 'green' }}>{this.state.selectedSuccess}</div>
							<br />
						</div>
					</div>

					<div>
						<h2 className="text-center text-primary font-weight-bolder">0</h2>
						<h3 className="text-center font-weight-bold">
							Level : {this.state.currQ} &nbsp; Score: {this.state.score}
						</h3>
						<hr className="styled-hr" />
						<h3 className="text-center font-weight-bold">Achievements</h3>
						<Achievements />
					</div>
				</div>

				<Footer />
			</div>
		);
	}
}
export default Dashboard;

import BootstrapTable from 'react-bootstrap-table-next';
import React, {useEffect, useState} from "react";
import UserPopup from "./UserModal/UserPopup";
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import {API_URL, DATE_FORMAT, SORT_ORDERS} from "../../common/constants";
import axios from "axios";
import editImg from '../../assets/images/pen.png'
import deleteImg from '../../assets/images/cross.png'
import './UserTable.css'
import {useHistory} from "react-router-dom";
import moment from "moment";
import {pagination, sortCode} from "../../common/config";
import UserDisableError from "./UserModal/UserDisableError";
import UserDisableConfirmation from "./UserModal/UserDisableConfirmation";

const defaultSorted = [{
	dataField: 'staffCode',
	order: SORT_ORDERS.ASC
}]


const UserTable = ({users, isLoading, isRecentUser}) => {

	const handleEditClicked = id => {
		history.push(`/edit/${id}`);
	}

	const [showErr, setShowErr] = useState(false);
	const handleCloseErr = () => setShowErr(false);
	const handleShowErr = () => setShowErr(true);

	const [showConfirm, setShowConfirm] = useState(false);
	const handleCloseConfirm = () => setShowConfirm(false);
	const handleShowConfirm = () => setShowConfirm(true);
	const [idDisable, setIdDisable] = useState(null);

	const handleDeleteClicked = (id) => {
		axios
		.get(`${API_URL}/users/${id}/valid`)
		.then((res) => {
      if (res.data === true) {
        setIdDisable(id);
        handleShowConfirm();}
        else handleShowErr();
		})
		.catch((err) => {
			console.error("Delete error: ", err);
		});
	};

	const columnFormatter = (cell, row) => {
		return (
			<div className="table__actions">
			<span
				className="action__items"
				title={`Edit user ${row.userName}`}
				onClick={() => handleEditClicked(row.id)}
			>
				<img src={editImg} alt="edit"/>
			</span>

				<span
					className="action__items"
					title={`Delete user ${row.userName}`}
					onClick={() => handleDeleteClicked(row.id)}
				>
				<img src={deleteImg} alt="delete"/>
			</span>
			</div>
		)
	};

	const columns = [
		{
			dataField: 'staffCode',
			text: 'Staff Code',
			sort: true,
			sortFunc: (a, b, order) => {
				return sortCode(a, b, order);
			}
		}, {
			dataField: 'fullName',
			text: 'Full Name',
			sort: true
		}, {
			dataField: 'userName',
			text: 'Username',
		}, {
			dataField: 'joinedDate',
			text: 'Join Date',
			sort: true,
			sortFunc: (a, b, order) => {
				if (order === SORT_ORDERS.ASC)
					return moment(a, DATE_FORMAT.TO) - moment(b, DATE_FORMAT.TO);
				return moment(b, DATE_FORMAT.TO) - moment(a, DATE_FORMAT.TO);
			}
		}, {
			dataField: 'type',
			text: 'Type',
			sort: true
		}, {
			dataField: 'action',
			text: '',
			width: '50',
			events: {
				onClick: (e) => {
					e.stopPropagation();
				}
			},
			formatter: columnFormatter,
			headerStyle: () => {
				return {width: '100px'};
			}
		}
	];

	const [userDetail, setUserDetail] = useState({});
	const [userIdPopup, setUserIdPopup] = useState(1);

	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);
	let history = useHistory();

	// Get user detail for popup
	useEffect(() => {
		axios({
			method: 'GET',
			url: `${API_URL}/users/${userIdPopup}`
		}).then(res => {
			setUserDetail(res.data);
		}).catch(err => {
			console.log(err);
		})
	}, [userIdPopup])

	const getUserDetail = {
		onClick: (e, row) => {
			setUserIdPopup(row.id);
			toggleTrueFalse();
		},
	}

	const toggleTrueFalse = () => {
		setShow(handleShow);
	};

	return (
		<>
			<BootstrapTable
				keyField='id'
				data={users}
				columns={columns}
				hover
				rowEvents={getUserDetail}
				formatter={columnFormatter}
				defaultSorted={isRecentUser ? [] : defaultSorted}
				pagination={pagination}
			/>
			{isLoading && <div>Loading...</div>}
			{show ? <UserPopup show={show} handleClose={handleClose} userInfo={userDetail}/> : null}
			{showErr ? (
				<UserDisableError showErr={showErr} handleCloseErr={handleCloseErr} />
			) : null}

			{showConfirm ? (
				<UserDisableConfirmation
				idDisable={idDisable}
				showConfirm={showConfirm}
				handleCloseConfirm={handleCloseConfirm}
				/>
			) : null}
		</>
	)
}

export default UserTable;

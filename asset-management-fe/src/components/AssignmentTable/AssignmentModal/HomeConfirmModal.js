import React, {useState} from 'react';
import {Button, Modal} from "react-bootstrap";
import axios from "axios";
import {API_URL, FILTER_ASM_STATE_OPTIONS} from "../../../common/constants";
import moment from "moment";
import {Redirect, useHistory} from "react-router-dom";

const HomeConfirmModal =
    ({
         message, buttonName,
         handleCloseAcceptConfirm, handleCloseDeclineConfirm,
         showAcceptConfirm, showDeclineConfirm,
         assignments, assignmentID,
         setLoading
    }) => {

        const history = useHistory();

        const updateDataState = () => {
            const index = assignments.map(x => {
                return x.id;
            }).indexOf(assignmentID);
            assignments.splice(index, 1);
        }

        const handleConfirmDecline = () => {
            axios
                .delete(`${API_URL}/user/assignment/decline/${assignmentID}`)
                .then(() => {
                    console.log(`Decline successful assignment: ${assignmentID}`);
                    handleCloseDeclineConfirm();
                })
                .catch(err => {
                    handleCloseDeclineConfirm();
                    alert(`Decline error: ${err}`);
                });
            updateDataState();
        }
        console.log(assignments)
        const assignment = assignments.find( a => a.id === assignmentID);
        let formattedDate = moment(assignment.assignedDate).format("YYYY-MM-DD");
        console.log(formattedDate)
        const handleConfirmAccept = () => {
            axios({
                method: 'PUT',
                url: `${API_URL}/user/assignment/accept/${assignmentID}`,
                data: {
                    assetCode: assignment.assetCode,
                    assignBy: assignment.assignBy,
                    assignTo: assignment.assignTo,
                    assignedDate: formattedDate,
                    state: FILTER_ASM_STATE_OPTIONS.ACCEPTED,
                    note: assignment.note
                }
            }).then(() => {
                console.log(`Accept successful assignment: ${assignmentID}`);
                handleCloseAcceptConfirm();
                return <Redirect to="/" />;
            }).catch(err => {
                handleCloseAcceptConfirm();
                alert(`Accept error: ${err}`);
            });
            history.go();
        }

    return (
        <Modal
            show={buttonName==="Accept" ? showAcceptConfirm : showDeclineConfirm}
            onHide={buttonName==="Accept" ? handleCloseAcceptConfirm : handleCloseDeclineConfirm}
            centered
            backdrop="static">
            <Modal.Header closeButton='' className="text-danger">
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer className="confirm">
                <Button
                    variant="danger"
                    onClick={buttonName==="Accept" ? handleConfirmAccept : handleConfirmDecline}
                    type="submit"
                >
                    {buttonName}
                </Button>
                <Button variant="outline-secondary" onClick={buttonName==="Accept" ? handleCloseAcceptConfirm : handleCloseDeclineConfirm}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default HomeConfirmModal;
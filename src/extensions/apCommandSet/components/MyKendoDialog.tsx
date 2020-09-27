import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';



export default class MyKendoDialog extends React.Component<any, any> {

    constructor(props) {
        debugger;
        super(props);

        this.state = {
            visible: true
        };

        // This comes from Kendo Demo.. I don't know why they need it. 
        this.toggleDialog = this.toggleDialog.bind(this);
    }


    public toggleDialog() {
        this.setState({
            visible: !this.state.visible
        });
    }

    public render() {
        return (
            <Dialog title={"Please confirm"} onClose={this.toggleDialog}>
                <p style={{ margin: "25px", textAlign: "center" }}>Are you sure you want to continue?</p>
                <DialogActionsBar>
                    <button className="k-button" onClick={this.toggleDialog}>No</button>
                    <button className="k-button" onClick={this.toggleDialog}>Yes</button>
                </DialogActionsBar>
            </Dialog>
        );
    }

}
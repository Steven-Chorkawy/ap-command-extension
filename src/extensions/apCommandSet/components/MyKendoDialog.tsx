import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

export default class MyKendoDialog extends React.Component {
    constructor(props?) {
        super(props);
        this.state = {
            visible: true
        };
        // this.toggleDialog = this.toggleDialog.bind(this);
    }

    // private toggleDialog() {
    //     this.setState({
    //         visible: !this.state.visible
    //     });
    // }

    // public render(): void {
    //     ReactDOM.render(
    //         <Dialog title={"Please confirm"} onClose={this.toggleDialog}>
    //             <p style={{ margin: "25px", textAlign: "center" }}>Are you sure you want to continue?</p>
    //             <DialogActionsBar>
    //                 <button className="k-button" onClick={this.toggleDialog}>No</button>
    //                 <button className="k-button" onClick={this.toggleDialog}>Yes</button>
    //             </DialogActionsBar>
    //         </Dialog>,
    //        this.domElement
    //     );
    // }
}

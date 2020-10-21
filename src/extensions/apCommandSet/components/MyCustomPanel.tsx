import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BaseDialog, IDialogConfiguration } from '@microsoft/sp-dialog';
import {
    Panel,
    PanelType
} from 'office-ui-fabric-react';

export default class MyCustomPanel extends BaseDialog {


    constructor(props?) {
        super(props);
        debugger;
    }

    public render(): void {
        debugger;
        ReactDOM.render(
            <Panel
                isLightDismiss={false}
                isOpen={true}
                type={PanelType.medium}
                onDismiss={(e) => {
                    debugger;
                    this.close();
                }}
            >
                Hello there from my custom Panel
            </Panel>,
            this.domElement
        );
    }
}

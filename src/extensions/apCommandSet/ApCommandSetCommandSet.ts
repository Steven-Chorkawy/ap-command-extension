import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseListViewCommandSet,
  Command,
  IListViewCommandSetListViewUpdatedParameters,
  IListViewCommandSetExecuteEventParameters
} from '@microsoft/sp-listview-extensibility';
import { Dialog as SPDialog, IPromptOptions } from '@microsoft/sp-dialog';

import * as strings from 'ApCommandSetCommandSetStrings';

import MyKendoDialog from './components/MyKendoDialog';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IApCommandSetCommandSetProperties {
  // This is an example; replace with your own properties
  sampleTextOne: string;
  sampleTextTwo: string;
}

const LOG_SOURCE: string = 'ApCommandSetCommandSet';



export default class ApCommandSetCommandSet extends BaseListViewCommandSet<IApCommandSetCommandSetProperties> {

  private dialogPlaceHolder: HTMLDivElement = null;

  private _mapRows(selectedRows: any): void {
    selectedRows.map(row => {
      console.log('First Field:');
      console.log('getValue, index: 0');
      console.log(row.getValue(row.fields[0]));
      console.log('getValueByName: ID')
      console.log(row.getValueByName('ID'));
    });
  }

  private _RowAccessorToObject(selectedRows): Array<any> {
    let output = [];
    for (let rowIndex = 0; rowIndex < selectedRows.length; rowIndex++) {
      const row = selectedRows[rowIndex];
      let rowObject = {};
      for (let fieldIndex = 0; fieldIndex < row.fields.length; fieldIndex++) {
        const field = row.fields[fieldIndex];
        rowObject[field.internalName] = row.getValueByName(field.internalName);
      }
      output.push(rowObject);
    }
    return output;
  }

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, 'Initialized ApCommandSetCommandSet');

    let el = document.createElement("div");
    this.dialogPlaceHolder = document.body.appendChild(el);

    return Promise.resolve();
  }

  @override
  public onListViewUpdated(event: IListViewCommandSetListViewUpdatedParameters): void {
    console.log('\n\nonListViewUpdated');
    console.log(event);
    const compareOneCommand: Command = this.tryGetCommand('COMMAND_1');
    if (compareOneCommand) {
      this._mapRows((event.selectedRows));
      // This command should be hidden unless exactly one row is selected.
      compareOneCommand.visible = event.selectedRows.length === 1;
    }
  }

  @override
  public onExecute(event: IListViewCommandSetExecuteEventParameters): void {
    console.log('\n\nonExecute');
    console.log(event);
    switch (event.itemId) {
      case 'COMMAND_1':
        this._mapRows(event.selectedRows);
        debugger;
        //SPDialog.alert(`${this.properties.sampleTextOne}${JSON.stringify(this._RowAccessorToObject(event.selectedRows))}`);
        const elem: React.ReactElement<any> = React.createElement(MyKendoDialog);
        debugger;
        ReactDOM.render(elem, this.dialogPlaceHolder);
        break;
      case 'COMMAND_2':
        //SPDialog.alert(`${this.properties.sampleTextTwo}`);
        
        SPDialog.prompt('Enter:',).then(value => {
          console.log(value);
        });
        break;
      default:
        throw new Error('Unknown command');
    }
  }
}
